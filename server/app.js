const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Conversation = require("./models/conversation");

const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);

const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");
const friendRoutes = require("./routes/friend");
const meetingRoutes = require("./routes/meeting");
const PORT = process.env.PORT || 5000;

const { saveMeeting, updateMeeting } = require("./controllers/meeting.js");
const {
  deleteMessage,
  forwardMessage,
  deleteConversation,
  blockConversation,
  blockMemberConversation,
} = require("./controllers/conversation.js");
const User = require("./models/user");
const User_Socket_Room = require("./models/user-socket");
const User_Socket_Chat = new User_Socket_Room();
// const User_Socket_Video = new User_Socket_Room();
const User_Socket = new User_Socket_Room();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// https://helpex.vn/question/cross-domain-session-cookie-express-api-on-heroku-react-app-on-netlify-60e9d52132040a40275cd60d?fbclid=IwAR1J6CuQwzb6CGsDDZjb7XZEwi3yLIBMxAXfy5UL9DCh7uhove0oM_0edJA
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [process.env.REACT_URL, process.env.TEST_REACT_URL],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const store = new MongoDBStore({
  uri: process.env.MONGOOSE_URL,
  collection: "session-store",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: Date.now() + 1000 * 60 * 60 * 10,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
  })
);

const io_chat = io.of("/chat-room");
io_chat.on("connection", (socket) => {
  socket.on("join-chat", async ({ conversationId, userId }) => {
    User_Socket_Chat.addUser({
      conversationId,
      userInfo: {
        socketId: socket.id,
        userId: userId,
      },
    });
    socket.join(conversationId);
  });

  socket.on(
    "send-message",
    async ({ user, message, conversationId, reply, files, id }) => {
      socket.broadcast.to(conversationId).emit("receive-message", {
        text: message,
        reply,
        sender: user,
        files,
        id,
      });
    }
  );

  socket.on("delete-message", ({ conversationId, id }) => {
    deleteMessage(conversationId, id);
    io_chat.to(conversationId).emit("delete-message", { id });
  });

  socket.on("delete-conversation", async ({ conversationId, user, group }) => {
    const { msg, type, conversation } = await deleteConversation({
      conversationId,
      user,
      group,
    });
    socket.broadcast
      .to(conversationId)
      .emit("delete-conversation", { msg, type, conversation });
  });

  socket.on(
    "block-conversation",
    async ({ conversationId, userId, isBlocked, userName }) => {
      const { conversation } = await blockConversation({
        conversationId,
        userId,
        isBlocked,
      });

      socket.broadcast.to(conversationId).emit("block-conversation", {
        isBlocked,
        userName,
        members: conversation.members,
        type: 1,
      });

      // send to socket.id only
      io_chat.to(`${socket.id}`).emit("block-conversation", {
        members: conversation.members,
        type: 0,
      });
    }
  );

  socket.on(
    "block-member-conversation",
    async ({ conversationId, blockeeId, isBlocked, userName, userId }) => {
      const { conversation } = await blockMemberConversation({
        conversationId,
        userId,
        blockeeId,
        isBlocked,
      });

      const { userInfo } = User_Socket_Chat.findUser({
        conversationId,
        userId: blockeeId,
      });

      // send to socket.id only
      io_chat.to(`${userInfo.socketId}`).emit("block-conversation", {
        members: conversation.members,
        isBlocked,
        userName,
        type: 1,
      });

      io_chat.to(`${socket.id}`).emit("block-conversation", {
        members: conversation.members,
        type: 0,
      });
    }
  );

  socket.on("forward-message", async ({ forward }, cb) => {
    const conversation = await forwardMessage(forward);
    cb();
    io_chat.to(conversation._id.toString()).emit("forward-message", {
      messageOb: conversation.messages[conversation.messages.length - 1],
      conversation,
    });
  });

  socket.on("leave-chat", ({ conversationId, userId }) => {
    User_Socket_Chat.removeUser({ conversationId, userId });
    socket.leave(conversationId);
  });
});

const io_video = io.of("/video-room");
io_video.on("connection", (socket) => {
  socket.on("join-video", async ({ userId }) => {
    try {
      const conversations = await Conversation.find({
        "members.user": userId,
      })
        .select({
          members: { $elemMatch: { user: userId } },
        })
        .populate({ path: "members.user" });

      conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("make-connection-call", async ({ conversationId, caller }, cb) => {
    try {
      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: "members.user",
          select: "-password -twoFA.secret",
        }
      );
      const callee = conversation.members.find(
        (mem) => mem.user._id.toString() !== caller._id.toString()
      );

      cb(callee.user);

      // sending to all clients except sender
      socket.broadcast.to(conversationId).emit("make-connection-call", {
        conversationId,
        conversation,
        caller,
        callee,
      });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on(
    "make-group-connection-call",
    async ({ conversationId, callerId }) => {
      try {
        const conversation = await Conversation.findById(
          conversationId
        ).populate({
          path: "members.user",
          select: "-password -twoFA.secret",
        });

        // sending to all clients except sender
        socket.broadcast.to(conversationId).emit("make-group-connection-call", {
          conversationId,
          conversation,
          callerId,
        });
      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on(
    "reject-call",
    ({
      conversationId,
      caller,
      callee,
      date,
      callAccepted,
      isReceivedCall,
    }) => {
      try {
        if (!isReceivedCall) {
          socket.broadcast.to(conversationId.toString()).emit("reject-call", {
            error: "Caller canceled the call!!!",
          });
        } else {
          socket.broadcast
            .to(conversationId.toString())
            .emit("reject-call", { error: "Callee canceled the call!!!" });
        }
        saveMeeting(caller, callee.user, date, callAccepted, conversationId);
      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on("call-user", ({ conversationId, signal }) => {
    socket.broadcast.to(conversationId).emit("call-user", { signal });
  });

  socket.on("answer-call", ({ conversationId, signal, hasVideo }) => {
    io_video
      .to(conversationId)
      .emit("accept-call", { signal, hasUserVideo: hasVideo });
  });

  socket.on(
    "join-meeting-room",
    ({ conversationId, caller, callee, date, callAccepted }) => {
      saveMeeting(caller.user, callee.user, date, callAccepted, conversationId);
      io_video.to(conversationId).emit("join-meeting-room");
    }
  );

  socket.on("toggle-video", ({ conversationId }) => {
    socket.broadcast.to(conversationId).emit("toggle-video");
  });

  socket.on("toggle-muted", ({ conversationId }) => {
    socket.broadcast.to(conversationId).emit("toggle-muted");
  });

  socket.on("leave-meeting-room", ({ conversationId, callerId, calleeId }) => {
    console.log("A user disconnected video-room!!!");
    updateMeeting(callerId, calleeId);
    io_video.to(conversationId).emit("leave-meeting-room");
  });
});

const io_group_video = io.of("/group-video-room");
io_group_video.on("connection", (socket) => {
  socket.on(
    "join-group-video",
    ({
      conversationId,
      userName,
      userImg,
      userShowVideo,
      userMuted,
      userShareScreen,
    }) => {
      try {
        User_Socket.addUser({
          conversationId,
          userInfo: {
            userId: socket.id,
            userName,
            userImg,
            userShowVideo,
            userMuted,
            userShareScreen,
          },
        });
        socket.emit("users-in-room", {
          usersInRoom: User_Socket.getUsersInRoom(
            conversationId.toString(),
            socket.id.toString()
          ),
        });
        socket.join(conversationId);
        // console.log("Video Group Rooms: ", io_group_video.adapter.rooms);
      } catch (err) {
        console.log(err);
      }
    }
  );

  socket.on(
    "sending-signal",
    ({ userToSignal, callerId, signal, conversationId }) => {
      try {
        const { userInfo } = User_Socket.findUser({
          conversationId,
          userId: callerId,
        });
        io_group_video.to(userToSignal).emit("user-joined", {
          signal,
          callerInfo: {
            callerId: userInfo.userId,
            callerName: userInfo.userName,
            callerImg: userInfo.userImg,
            callerShowVideo: userInfo.userShowVideo,
            callerMuted: userInfo.userMuted,
            callerShareScreen: userInfo.userShareScreen,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on("returning-signal", ({ callerId, signal }) => {
    io_group_video
      .to(callerId)
      .emit("receiving-returned-signal", { signal, calleeId: socket.id });
  });

  socket.on("toggle-group-video", ({ conversationId }) => {
    User_Socket.updateUserShowVideo({ conversationId, userId: socket.id });
    socket.broadcast
      .to(conversationId)
      .emit("toggle-group-video", { peerId: socket.id });
  });

  socket.on("toggle-group-muted", ({ conversationId }) => {
    User_Socket.updateUserMuted({ conversationId, userId: socket.id });
    socket.broadcast
      .to(conversationId)
      .emit("toggle-group-muted", { peerId: socket.id });
  });

  socket.on("group-share-screen", ({ conversationId }) => {
    User_Socket.updateUserShareScreen({ conversationId, userId: socket.id });
    socket.broadcast
      .to(conversationId)
      .emit("group-share-screen", { peerId: socket.id });
  });

  socket.on("leave-group-video", ({ conversationId }) => {
    const userInRoom = User_Socket.removeUser({
      conversationId,
      userId: socket.id,
    });
    socket.broadcast.emit("user-leaved", {
      peerId: userInRoom[0].userInfo.userId,
      userInfo: userInRoom[0].userInfo,
    });
  });

  socket.on("disconnect", () => {
    const rooms = User_Socket.getRoomsOfUser({ userId: socket.id });
    rooms.forEach(({ conversationId }) => {
      const userInRoom = User_Socket.removeUser({
        userId: socket.id,
        conversationId: conversationId,
      });
      socket.broadcast.emit("user-leaved", {
        peerId: userInRoom[0].userInfo.userId,
        userInfo: userInRoom[0].userInfo,
      });
    });
  });
});

const io_notify = io.of("/notify");
io_notify.on("connection", (socket) => {
  socket.on("join-room", ({ userId }) => {
    socket.userId = userId;
  });

  socket.on("log-out", () => {
    // to all clients in the current namespace except the sender
    socket.broadcast.emit("log-out");
  });

  socket.on("log-in", () => {
    socket.broadcast.emit("log-in");
  });

  socket.on("post-new-conversation", () => {
    socket.broadcast.emit("post-new-conversation");
    io_notify.to(socket.id).emit("post-new-conversation");
  });

  socket.on("post-new-group-conversation", () => {
    socket.broadcast.emit("post-new-group-conversation");
    io_notify.to(socket.id).emit("post-new-group-conversation");
  });

  socket.on("delete-conversation", () => {
    socket.broadcast.emit("delete-conversation");
    io_notify.to(socket.id).emit("delete-conversation");
  });

  socket.on("forward-message", () => {
    // to all clients in the current namespace
    socket.broadcast.emit("forward-message");
    io_notify.to(socket.id).emit("forward-message");
  });

  socket.on("send-message", () => {
    socket.broadcast.emit("send-message");
    io_notify.to(socket.id).emit("send-message");
  });

  socket.on("block-conversation", () => {
    // to all clients in the current namespace
    io_notify.emit("block-conversation");
  });

  socket.on("disconnect", async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, { status: false });
      socket.broadcast.emit("log-out");
    } catch (err) {
      console.error(err);
    }
  });
});

app.get("/", (req, res, next) => {
  res.status(200).json({ msg: `Server is on port ${PORT}!!!` });
});
app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/friend", friendRoutes);
app.use("/meeting", meetingRoutes);

(async function() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    server.listen(PORT, () => {
      console.log(`Server is on port ${PORT}!!!`);
    });
  } catch (err) {
    console.error(err);
  }
})();
