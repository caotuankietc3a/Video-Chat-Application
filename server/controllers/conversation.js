const Conversation = require("../models/conversation");
const Reply = require("../models/reply");
const Meeting = require("../models/meeting");
const File = require("../models/file");
const {
  uploads,
  deletes,
  uploadsFiles,
  deletesFiles,
} = require("../util/cloudinary.js");
const { sendInvitationMessage } = require("../util/mailer");
exports.postNewGroupConversation = async (req, res, next) => {
  try {
    const { members, groupName, groupImg } = req.body;
    const uploadedRes = await uploads(
      { fileName: groupName.trim().split(".")[0], folderName: "images-group" },
      groupImg
    );
    const newConversation = new Conversation({
      members,
      messages: [],
      name: groupName,
      profilePhoto: {
        url: uploadedRes.secure_url,
        name: groupName.trim().split(".")[0],
        cloudinary_id: uploadedRes.public_id,
      },
      meetings: [],
    });
    await newConversation.save();
    res.status(200).json(
      await newConversation.populate({
        path: "members.user",
        select: "-password -twoFA.secret",
      })
    );
  } catch (err) {
    console.error(err);
  }
};

exports.postNewInvitationMessage = async (req, res, next) => {
  try {
    const { receiverEmail, textArea, senderEmail } = req.body;
    sendInvitationMessage({ senderEmail, receiverEmail, textArea });
    res.status(200).json({
      msg: "An invite request has been sended successfully!!!",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: err.message, status: "error" });
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
          "members.user": userId,
        }).populate({
          path: "members.user messages.sender messages.files messages.reply",
          select: "-password -twoFA.secret",
        });
      } else {
        conversations = await Conversation.find({
          $and: [
            {
              $expr: { $gte: [{ $size: "$members" }, 3] },
            },
            { "members.user": userId },
          ],
        }).populate({
          path: "members.user messages.sender messages.files messages.reply",
          select: "-password -twoFA.secret",
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
      path: "members.user messages.sender messages.files messages.reply",
      select: "-password -twoFA.secret",
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

    let newReply = null;
    if (replyOb) {
      newReply = await new Reply({
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
      select: "-password -twoFA.secret",
    });
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error(err);
  }
};

const findGroupConversation = async (groupId) => {
  return await Conversation.findById(groupId).populate({
    path: "members.user",
  });
};

const createNewConversation = async (friend, userId) => {
  try {
    const existedConversation = await Conversation.findOne({
      $and: [
        { "members.user": friend._id },
        { "members.user": userId },
        { $expr: { $lte: [{ $size: "$members" }, 2] } },
      ],
    }).populate({ path: "members.user", select: "-password -twoFA.secret" });

    if (existedConversation) {
      return existedConversation;
    }
    const newConversation = await new Conversation({
      members: [
        { user: friend._id, isAdmin: false },
        { user: userId, isAdmin: true },
      ],
      messages: [],
      meetings: [],
    }).save();

    return await newConversation.populate({
      path: "members.user",
      select: "-password -twoFA.secret",
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
    deletesFiles(conversation.messages[0].files);
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
    } else {
      const newFile = await new File({
        images: [],
        attachments: [],
      }).save();
      file_id = newFile._id;
    }
    if (!forwardOb.forwardee.isGroup) {
      await createNewConversation(forwardOb.forwardee, forwardOb.forwarder._id);
      conversation = await Conversation.findOneAndUpdate(
        {
          $and: [
            { "members.user": forwardOb.forwarder._id },
            { "members.user": forwardOb.forwardee._id },
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
        select: "-password -twoFA.secret",
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
        select: "-password -twoFA.secret",
      });
    }
    return conversation;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteConversation = async ({
  conversationId,
  user: { userId, isAdmin, userName },
  group: { groupName, isGroup },
}) => {
  try {
    if ((isGroup && isAdmin) || !isGroup) {
      const conversation = await Conversation.findByIdAndRemove(conversationId);
      if (conversation.profilePhoto.cloudinary_id !== "")
        await deletes({
          public_id: conversation.profilePhoto.cloudinary_id,
          resource_type: "image",
        });
      conversation.messages.forEach(async (message) => {
        deletesFiles(message.files);

        message.reply &&
          (await Reply.deleteOne({
            _id: message.reply,
          }));
      });
      conversation.meetings.forEach(async (meeting) => {
        await Meeting.deleteOne({ _id: meeting });
      });
      if (!isGroup) {
        return {
          msg: `Sorry ${userName} removed the conversation with you!!!`,
          type: true,
        };
      } else if (isAdmin && isGroup) {
        return {
          msg: `Sorry ${userName} removed the <strong>${groupName}</strong> conversation!!!`,
          type: true,
        };
      }
    } else {
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $pull: {
            members: { user: userId },
          },
        },
        { new: true }
      ).populate({ path: "members.user" });
      return {
        msg: `${userName} had left the <strong>${groupName}</strong> conversation!!!`,
        type: false,
        conversation,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

exports.blockConversation = async ({ conversationId, userId, isBlocked }) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        "members.$[].block": {
          isBlocked: isBlocked,
          userId: isBlocked ? userId : undefined,
        },
      },
      { new: true }
    ).populate({ path: "members.user", select: "-password -twoFA.secret" });
    return { conversation };
  } catch (err) {
    console.error(err);
  }
};

exports.blockMemberConversation = async ({
  conversationId,
  userId,
  blockeeId,
  isBlocked,
}) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        "members.$[member].block": {
          isBlocked: isBlocked,
          userId: isBlocked ? userId : undefined,
        },
      },
      { arrayFilters: [{ "member.user": blockeeId }], new: true }
    ).populate({ path: "members.user", select: "-password -twoFA.secret" });
    return { conversation };
  } catch (err) {
    console.error(err);
  }
};

module.exports.createNewConversation = createNewConversation;
