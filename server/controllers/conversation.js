const Conversation = require("../models/conversation");
exports.postConversation = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.send("Start new conversation!!!");
  } catch (err) {
    console.error(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let conversations = [];
    if (userId !== "error") {
      conversations = await Conversation.find({
        members: { $in: [userId] },
      }).populate({ path: "members" });
    }
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
  }
};

exports.getConversationDetail = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate({
      path: "members",
    });
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
  }
};

exports.postNewMessage = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.query;
    const { newMessage } = req.body;
    await Conversation.updateOne(
      { _id: conversationId },
      {
        $push: {
          messages: {
            text: newMessage,
            senderId: userId,
            date: new Date(Date.now()),
          },
        },
      }
    );
    res.status(200).json("successfully");
  } catch (err) {
    console.error(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId);
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(err);
  }
};

exports.postNewConversation = async (req, res, next) => {
  try {
    const { friend, userId } = req.body;
    const existedConversation = await Conversation.findOne({
      $and: [{ members: friend._id }, { members: userId }],
    }).populate({ path: "members" });
    if (existedConversation) {
      return res.status(200).json(existedConversation);
    }
    const newConversation = new Conversation({
      members: [friend._id, userId],
      messages: [],
    });
    await newConversation.save();
    res.status(200).json(await newConversation.populate({ path: "members" }));
  } catch (err) {
    console.error(err);
  }
};

exports.deleteMessage = async (conversationId, text) => {
  try {
    await Conversation.findByIdAndUpdate(conversationId, {
      $pull: { messages: { text: text } },
    });
  } catch (err) {
    console.error(err);
  }
};
