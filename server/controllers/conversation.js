const Conversation = require("../models/conversation");
const File = require("../models/file");
const { uploads } = require("../util/cloudinary.js");
exports.postNewGroupConversation = async (req, res, next) => {
  try {
    const { members, groupName, groupImg } = req.body;
    const uploadedRes = await uploads(
      { fileName: groupName, folderName: "images-group" },
      groupImg
    );
    const newConversation = new Conversation({
      members,
      messages: [],
      name: groupName,
      profilePhoto: uploadedRes.url,
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
    const { isGroup } = req.query;
    let conversations = [];
    if (userId !== "error") {
      if (!parseInt(isGroup)) {
        conversations = await Conversation.find({
          members: { $in: [userId] },
        }).populate({ path: "members messages.sender messages.files" });
      } else {
        conversations = await Conversation.find({
          $and: [
            {
              $expr: { $gte: [{ $size: "$members" }, 3] },
            },
            { members: userId },
          ],
        }).populate({ path: "members messages.sender" });
      }
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
    const { newMessage, replyOb, forwardOb, dataImgs, dataAttachments } =
      req.body;
    let newFile = null;
    if (dataImgs.length !== 0) {
      const uploadedImgs = await Promise.all(
        dataImgs.map((dataImg) => {
          return uploads(
            { fileName: dataImg.name, folderName: "images" },
            dataImg.url
          );
        })
      );
      let images = [];
      for (let i = 0; i < dataImgs.length; i++) {
        images.push({
          url: uploadedImgs[i].url,
          name: dataImgs[i].name,
        });
      }
      newFile = new File({
        images: images,
        attachments: [],
      });
      await newFile.save();
    } else if (dataAttachments.length !== 0) {
      const uploadedAttachments = await Promise.all(
        dataAttachments.map((dataAttachment) => {
          return uploads(
            { fileName: dataAttachment.name, folderName: "attachments" },
            dataAttachment.data
          );
        })
      );
      let attachments = [];
      for (let i = 0; i < dataAttachments.length; i++) {
        attachments.push({
          url: uploadedAttachments[i].url,
          name: dataAttachments[i].name,
          size: dataAttachments[i].size,
        });
      }

      newFile = new File({
        images: [],
        attachments: attachments,
      });
      await newFile.save();
    }

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
            files: newFile._id,
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
      path: "messages.sender messages.files",
    });
    // .select("-messages.sender.password");
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(err);
  }
};

const findGroupConversation = async (groupId) => {
  return await Conversation.findById(groupId);
};

const createNewConversation = async (friend, userId, group = null) => {
  try {
    const existedConversation = await Conversation.findOne({
      $and: [
        { members: friend._id },
        { members: userId },
        { $expr: { $lte: [{ $size: "$members" }, 2] } },
      ],
    }).populate({ path: "members" });

    if (existedConversation) {
      return existedConversation;
    }
    const newConversation = await new Conversation({
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
    const { friend, userId, group } = req.body;
    if (friend.isGroup) {
      return res.status(200).json(await findGroupConversation(friend._id));
    }
    return res
      .status(200)
      .json(await createNewConversation(friend, userId, group));
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
    let conversation = null;
    if (!forwardOb.forwardee.isGroup) {
      await createNewConversation(forwardOb.forwardee, forwardOb.forwarder._id);
      conversation = await Conversation.findOneAndUpdate(
        {
          $and: [
            { members: forwardOb.forwarder._id },
            { members: forwardOb.forwardee._id },
            { $expr: { $lte: [{ $size: "$members" }, 2] } },
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
      ).populate({ path: "messages.sender" });
    } else {
      conversation = await Conversation.findByIdAndUpdate(
        forwardOb.forwardee._id,
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
      ).populate({ path: "messages.sender" });
    }

    return conversation;
  } catch (err) {
    console.error(err);
  }
};

module.exports.createNewConversation = createNewConversation;
