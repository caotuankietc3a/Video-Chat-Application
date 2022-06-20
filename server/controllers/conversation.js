const Conversation = require("../models/conversation");
const User = require("../models/user");
const { Types } = require("mongoose");
exports.postNewGroupConversation = async (req, res, next) => {
  try {
    const { members, groupName, groupImg } = req.body;
    const existedConversation = await Conversation.findOne({
      members: [...members],
    }).populate({ path: "members" });
    if (existedConversation) {
      return res.status(200).json(existedConversation);
    }
    const newConversation = new Conversation({
      members: members.map((mem) => Types.ObjectId(mem)),
      messages: [],
      name: groupName,
      profilePhoto: groupImg,
    });
    await newConversation.save();
    res.status(200).json(await newConversation.populate({ path: "members" }));
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
      }).populate({ path: "members messages.sender" });
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
      path: "members messages.sender",
    });
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
  }
};

exports.postNewMessage = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.query;
    const { newMessage, replyOb, forwardOb } = req.body;
    await Conversation.updateOne(
      { _id: conversationId },
      {
        $push: {
          messages: {
            text: newMessage,
            sender: userId,
            date: new Date(Date.now()),
            reply: replyOb ? replyOb : null,
            forward: forwardOb ? forwardOb : null,
          },
        },
      }
    );
    res.status(200).json({ msg: "successfully" });
  } catch (err) {
    console.error(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages.sender",
    });
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(err);
  }
};

const createNewConversation = async (friend, userId) => {
  try {
    const existedConversation = await Conversation.findOne({
      $and: [{ members: [friend._id, userId] }, { members: { $size: 2 } }],
    }).populate({ path: "members" });
    if (existedConversation) {
      await existedConversation.save();
      return existedConversation;
    }
    const newConversation = new Conversation({
      members: [friend._id, userId],
      messages: [],
    });
    await newConversation.save();
    return await newConversation.populate({ path: "members" });
  } catch (err) {
    console.error(err);
  }
};

exports.postNewConversation = async (req, res, _next) => {
  try {
    const { friend, userId } = req.body;
    res.status(200).json(await createNewConversation(friend, userId));
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

exports.forwardMessage = async (forwardOb) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        $and: [
          { members: forwardOb.forwarder._id },
          { members: forwardOb.forwardee._id },
        ],
      },
      {
        $push: {
          messages: {
            text: forwardOb.text,
            sender: forwardOb.forwarder._id,
            date: new Date(Date.now()),
            forward: forwardOb,
          },
        },
      },
      { new: true }
    );
    return await conversation;
  } catch (err) {
    console.error(err);
  }
};

module.exports.createNewConversation = createNewConversation;
