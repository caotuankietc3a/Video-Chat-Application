const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Conversation = require("./models/conversation");
const uri =
  "mongodb+srv://kietcao:hokgadau123@cluster0.ps9wx.mongodb.net/chat-zoom?";

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
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const store = new MongoDBStore({
  uri: uri,
  collection: "session-store",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
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
    async ({ userId, message, conversationId, reply }) => {
      const sender = await User.findById(userId);
      io_chat.to(conversationId).emit("receive-message", {
        text: message,
        reply,
        userId: userId,
        sender,
      });
    }
  );

  socket.on("leave-chat", ({ conversationId }) => {
    socket.leave(conversationId);
    console.log("A user disconnected chat-room!!!");
    console.log("Chat Rooms: ", io_chat.adapter.rooms);
  });

  socket.on("delete-message", ({ conversationId, text }) => {
    deleteMessage(conversationId, text);
    io_chat.to(conversationId).emit("delete-message", { text });
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
    }).populate({ path: "members" });
    socket.join(
      conversations.map((conversation) => conversation._id.toString())
    );
    console.log("Video Rooms: ", io_video.adapter.rooms);
  });

  socket.on("make-connection-call", async ({ conversationId, caller }, cb) => {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "members",
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
  // socket.on(
  //   "reject-call",
  //   ({ conversationId, caller, callee, date, callAccepted }) => {
  //     saveMeeting(caller, callee, date, callAccepted);
  //     io_video.to(conversationId).emit("reject-call");
  //   }
  // );

  socket.on("reject-call", ({ conversationId, isReceivedCall }) => {
    console.log(isReceivedCall);
    if (!isReceivedCall) {
      // User_Socket.removeUsersInRoom(conversationId);
      return socket.broadcast
        .to(conversationId.toString())
        .emit("reject-call", {
          error: "Caller canceled the call!!!",
        });
    }

    socket.broadcast
      .to(conversationId.toString())
      .emit("reject-call", { error: "Callee canceled the call!!!" });
  });

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
      // saveMeeting(caller, callee, date, callAccepted);
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
    // updateMeeting(callerId, calleeId);
    io_video.to(conversationId).emit("leave-meeting-room");
  });
});

const io_group_video = io.of("/group-video-room");
io_group_video.on("connection", (socket) => {
  socket.on("join-group-video", ({ conversationId }) => {
    User_Socket.addUser({ conversationId, userId: socket.id });
    console.log(User_Socket.getAllUsersInRoom(conversationId));
    socket.emit("users-in-room", {
      usersInRoom: User_Socket.getUsersInRoom(
        conversationId.toString(),
        socket.id.toString()
      ),
    });
  });

  socket.on("sending-signal", ({ userToSignal, callerId, signal }) => {
    io_group_video.to(userToSignal).emit("user-joined", { signal, callerId });
  });

  socket.on("returning-signal", ({ callerId, signal }) => {
    io_group_video
      .to(callerId)
      .emit("receiving-returned-signal", { signal, calleeId: socket.id });
  });

  socket.on("leave-group-video", ({ conversationId, isReceivedCall, user }) => {
    // if (isReceivedCall) {
    const userInRoom = User_Socket.removeUser({
      conversationId,
      userId: socket.id,
    });
    // console.log(userInRoom);
    // console.log(User_Socket.getAllUsersInRoom(conversationId));
    socket.broadcast.emit("user-leaved", {
      peerId: userInRoom[0].userId,
      userName: user ? user.fullname : "TEST USER",
    });
    // } else {
    //   User_Socket.removeUsersInRoom(conversationId);
    //   const userInRoom = User_Socket.removeUser({ conversationId, userId: socket.id });
    // }
  });

  socket.on("disconnect", () => {
    const rooms = User_Socket.getRoomsOfUser({ userId: socket.id });
    rooms.forEach(({ conversationId }) => {
      const userInRoom = User_Socket.removeUser({
        userId: socket.id,
        conversationId: conversationId,
      });
      socket.broadcast.emit("user-leaved", { peerId: userInRoom[0].userId });
    });
  });
});

const io_notify = io.of("/notify");
io_notify.on("connection", (socket) => {
  console.log(io_notify.adapter.rooms);
  socket.on("log-out", () => {
    // to all clients in the current namespace except the sender
    console.log("dfasdf ");
    socket.broadcast.emit("log-out");
  });

  socket.on("log-in", () => {
    console.log("dfasdf asdassdfa");
    socket.broadcast.emit("log-in");
  });
});

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/friend", friendRoutes);
app.use("/meeting", meetingRoutes);

(async function () {
  try {
    await mongoose.connect(uri);
    server.listen(5000, () => {
      console.log("Server is on port 5000!!!");
    });
  } catch (err) {
    console.error(err);
  }
})();
