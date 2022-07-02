const Conversation = require("../models/conversation");
const Reply = require("../models/reply");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/file");
const { uploads, deletes, uploadsFiles } = require("../util/cloudinary.js");
exports.postNewGroupConversation = async (req, res, next) => {
  try {
    const { members, groupName, groupImg } = req.body;
    const uploadedRes = await uploads(
      { fileName: groupName.split(".")[0], folderName: "images-group" },
      groupImg
    );
    const newConversation = new Conversation({
      members,
      messages: [],
      name: groupName,
      profilePhoto: uploadedRes.url,
    });
    await newConversation.save();
    res
      .status(200)
      .json(
        await newConversation.populate({ path: "members", select: "-password" })
      );
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
        }).populate({
          path: "members messages.sender messages.files messages.reply",
          select: "-password",
        });
      } else {
        conversations = await Conversation.find({
          $and: [
            {
              $expr: { $gte: [{ $size: "$members" }, 3] },
            },
            { members: userId },
          ],
        }).populate({
          path: "members messages.sender messages.files messages.reply",
          select: "-password",
        });
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
      path: "members messages.sender messages.files messages.reply",
      select: "-password",
    });
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
  }
};

exports.postNewMessage = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.query;
    const { id, newMessage, replyOb, forwardOb, dataImgs, dataAttachments } =
      req.body;
    let file_id = null;

    if (dataImgs.length !== 0) {
      const { fileId } = await uploadsFiles(dataImgs, id, "images");
      file_id = fileId;
    } else if (dataAttachments.length !== 0) {
      const { fileId } = await uploadsFiles(dataAttachments, id, "attachments");
      file_id = fileId;
    } else {
      const newFile = await new File({
        images: [],
        attachments: [],
      }).save();
      file_id = newFile._id;
    }

    let newReply;
    if (replyOb) {
      newReply = await Reply({
        messageId: replyOb.messageId,
        replyer: replyOb.replyer,
        replyee: replyOb.replyee,
        text: replyOb.text,
        haveImages: replyOb.haveImages,
        haveAttachments: replyOb.haveAttachments,
      }).save();
    }

    await Conversation.updateOne(
      { _id: conversationId },
      {
        $push: {
          messages: {
            _id: id,
            text: newMessage,
            sender: userId,
            date: new Date(Date.now()),
            reply: replyOb ? newReply._id : null,
            forward: forwardOb ? forwardOb : null,
            // files: newFile._id,
            files: file_id,
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
      path: "messages.sender messages.files messages.reply",
      select: "-password",
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
    }).populate({ path: "members", select: "-password" });

    if (existedConversation) {
      return existedConversation;
    }
    const newConversation = await new Conversation({
      members: [friend._id, userId],
      messages: [],
    });
    await newConversation.save();

    return await newConversation.populate({
      path: "members",
      select: "-password",
    });
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

exports.deleteMessage = async (conversationId, id) => {
  try {
    const conversation = await Conversation.findById(conversationId).select({
      messages: { $elemMatch: { _id: id } },
    });
    await Conversation.updateOne(
      { _id: conversationId },
      {
        $pull: { messages: { _id: id } },
      }
    );
    await Reply.deleteOne({
      _id: conversation.messages[0].reply,
    });
    await Reply.deleteMany({ messageId: id });

    const file = await File.findByIdAndRemove(conversation.messages[0].files);
    if (file.images.length !== 0) {
      file.images.forEach(async (img) => {
        try {
          await deletes({
            public_id: img.cloudinary_id,
            resource_type: "image",
          });
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (file.attachments.length !== 0) {
      file.attachments.forEach(async (attachment) => {
        try {
          await deletes({
            public_id: attachment.cloudinary_id,
            resource_type: "raw",
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.forwardMessage = async (forwardOb) => {
  try {
    let conversation = null;
    let file_id = null;
    if (forwardOb.images.length !== 0) {
      const { fileId } = await uploadsFiles(
        forwardOb.images,
        forwardOb.id,
        "images"
      );
      file_id = fileId;
    } else if (forwardOb.attachments.length !== 0) {
      const { fileId } = await uploadsFiles(
        forwardOb.attachments,
        forwardOb.id,
        "attachments"
      );
      file_id = fileId;
    }
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
              forward: true,
              files: file_id,
            },
          },
        },
        { new: true }
      ).populate({
        path: "messages.sender messages.files",
        select: "-password",
      });
    } else {
      conversation = await Conversation.findByIdAndUpdate(
        forwardOb.forwardee._id,
        {
          $push: {
            messages: {
              text: forwardOb.text,
              sender: forwardOb.forwarder._id,
              date: new Date(Date.now()),
              forward: true,
              files: file_id,
            },
          },
        },
        { new: true }
      ).populate({
        path: "messages.sender messages.files",
        select: "-password",
      });
    }
    return conversation;
  } catch (err) {
    console.error(err);
  }
};

module.exports.createNewConversation = createNewConversation;
