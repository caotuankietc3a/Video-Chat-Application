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
const { SocketUser, users } = require("./models/socket-user");

const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");
const friendRoutes = require("./routes/friend");

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

io.on("connection", (socket) => {
  console.log("A user connected!!");
  // socket.on("join-video", async ({ userId }) => {
  //   const conversations = await Conversation.find({
  //     members: { $in: [userId] },
  //   }).populate({ path: "members" });
  //   socket.join(
  //     conversations.map((conversation) => conversation._id.toString())
  //   );
  // });
  socket.on("join-message", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("leave-message", ({ conversationId }) => {
    socket.leave(conversationId);
  });

  socket.on("sendMessage", ({ userId, message, conversationId }) => {
    io.to(conversationId).emit("message", {
      text: message,
      userId: userId,
    });
  });

  socket.on("disconnect", (cb) => {
    console.log("A user disconnected!!");
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
  // socket.on("accept-decline", (data) => {
  //    console.log(data);
  //    io.to(conversationId).emit("accept-decline", {});
  // });
  socket.on("callUser", ({ conversationId, signalData, from, name }) => {
    io.to(conversationId).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", ({ to, signal }) => {
    io.to(to).emit("callAccepted", { signal });
  });

  socket.on("declineCall", ({ to, signal }) => {
    io.to(to).emit("de", { signal });
  });
});

app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/friend", friendRoutes);

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
