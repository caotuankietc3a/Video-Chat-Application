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

  socket.on("send-message", ({ userId, message, conversationId, reply }) => {
    io_chat.to(conversationId).emit("receive-message", {
      text: message,
      reply,
      userId: userId,
    });
  });

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
      (user) => user._id.toString() !== caller._id
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
    "reject-call",
    ({ conversationId, caller, callee, date, callAccepted }) => {
      saveMeeting(caller, callee, date, callAccepted);
      io_video.to(conversationId).emit("reject-call");
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
