const mongoose = require("mongoose");
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

const { saveMeeting, updateMeeting } = require("./controllers/meeting.js");
const {
  deleteMessage,
  forwardMessage,
} = require("./controllers/conversation.js");
const User = require("./models/user");
const User_Socket = require("./models/user-socket");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.REACT_URL,
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
  })
);

const io_chat = io.of("/chat-room");
io_chat.on("connection", (socket) => {
  socket.on("join-chat", ({ conversationId }) => {
    console.log("A user connected to chat-room!!!");
    socket.join(conversationId);
    console.log("Chat Rooms: ", io_chat.adapter.rooms);
  });

  socket.on(
    "send-message",
    async ({ userId, message, conversationId, reply, files, id }) => {
      const sender = await User.findById(userId).select(
        "-password -twoFA.secret"
      );
      io_chat.to(conversationId).emit("receive-message", {
        text: message,
        reply,
        userId: userId,
        sender,
        files,
        id,
      });
    }
  );

  socket.on("leave-chat", ({ conversationId }) => {
    socket.leave(conversationId);
    console.log("A user disconnected chat-room!!!");
    console.log("Chat Rooms: ", io_chat.adapter.rooms);
  });

  socket.on("delete-message", ({ conversationId, id }) => {
    deleteMessage(conversationId, id);
    io_chat.to(conversationId).emit("delete-message", { id });
  });

  socket.on("forward-message", async ({ forward }) => {
    const conversation = await forwardMessage(forward);
    io_chat.to(conversation._id.toString()).emit("forward-message", {
      messageOb: conversation.messages[conversation.messages.length - 1],
      conversation,
    });
  });
});

const io_video = io.of("/video-room");
io_video.on("connection", (socket) => {
  socket.on("join-video", async ({ userId }) => {
    console.log("A user connected video-room!!!");
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).populate({ path: "members", select: "-password -twoFA.secret" });
    socket.join(
      conversations.map((conversation) => conversation._id.toString())
    );
    console.log("Video Rooms: ", io_video.adapter.rooms);
  });

  socket.on("make-connection-call", async ({ conversationId, caller }, cb) => {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "members",
      select: "-password -twoFA.secret",
    });
    const callee = conversation.members.find(
      (user) => user._id.toString() !== caller._id.toString()
    );

    cb(callee);

    // sending to all clients except sender
    socket.broadcast.to(conversationId).emit("make-connection-call", {
      conversationId,
      conversation,
      caller,
      callee,
    });
  });

  socket.on(
    "make-group-connection-call",
    async ({ conversationId, callerId }) => {
      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: "members",
          select: "-password -twoFA.secret",
        }
      );
      // sending to all clients except sender
      socket.broadcast.to(conversationId).emit("make-group-connection-call", {
        conversationId,
        conversation,
        callerId,
      });
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
      if (!isReceivedCall) {
        socket.broadcast.to(conversationId.toString()).emit("reject-call", {
          error: "Caller canceled the call!!!",
        });
      } else {
        socket.broadcast
          .to(conversationId.toString())
          .emit("reject-call", { error: "Callee canceled the call!!!" });
      }
      saveMeeting(caller, callee, date, callAccepted);
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
      saveMeeting(caller, callee, date, callAccepted);
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
      console.log(User_Socket.getAllUsersInRoom(conversationId));
      socket.emit("users-in-room", {
        usersInRoom: User_Socket.getUsersInRoom(
          conversationId.toString(),
          socket.id.toString()
        ),
      });
      socket.join(conversationId);
      console.log("Video Group Rooms: ", io_group_video.adapter.rooms);
    }
  );

  socket.on(
    "sending-signal",
    ({ userToSignal, callerId, signal, conversationId }) => {
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
  console.log(io_notify.adapter.rooms);
  socket.on("log-out", () => {
    // to all clients in the current namespace except the sender
    socket.broadcast.emit("log-out");
  });

  socket.on("log-in", () => {
    socket.broadcast.emit("log-in");
  });

  socket.on("post-new-conversation", () => {
    socket.broadcast.emit("post-new-conversation");
  });

  socket.on("post-new-group-conversation", () => {
    socket.broadcast.emit("post-new-group-conversation");
  });
});

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/friend", friendRoutes);
app.use("/meeting", meetingRoutes);

(async function () {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    server.listen(5000, () => {
      console.log("Server is on port 5000!!!");
    });
  } catch (err) {
    console.error(err);
  }
})();
