const Meeting = require("../models/meeting.js");
const Conversation = require("../models/conversation.js");
const User = require("../models/user.js");
exports.getMeetings = async (req, res, _next) => {
  try {
    const { userId } = req.query;
    const meetings = await Meeting.find({
      $or: [{ caller: userId }, { callee: userId }],
    }).populate({ path: "caller callee", select: "-password" });
    const reversed_meetings = meetings.reverse();
    const check_set = new Set();
    const meeting_array = reversed_meetings.filter((meeting, _i) => {
      const callerId = meeting.caller._id.toString();
      const calleeId = meeting.callee._id.toString();
      if (callerId !== userId.toString() && !check_set.has(callerId)) {
        check_set.add(callerId);
        return true;
      }
      if (calleeId !== userId.toString() && !check_set.has(calleeId)) {
        check_set.add(calleeId);
        return true;
      }
      return false;
    });
    res.status(200).json(meeting_array);
  } catch (err) {
    console.error(err);
  }
};

exports.getMeetingDetail = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.query;
    const meeting = await Meeting.findById(meetingId);
    const id =
      meeting.caller._id.toString() !== userId.toString()
        ? meeting.caller._id
        : meeting.callee._id;
    const callee = await User.findById(id);
    const meetings = await Meeting.find({
      $and: [
        { $or: [{ caller: id }, { callee: id }] },
        { $or: [{ caller: userId }, { callee: userId }] },
      ],
    }).populate({ path: "caller callee", select: "-password" });
    const reversed_meetings = meetings.reverse();
    res.status(200).json({ calls_detail: reversed_meetings, callee: callee });
  } catch (err) {
    console.error(err);
  }
};

exports.saveMeeting = async (
  caller,
  callee,
  date,
  callAccepted,
  conversationId
) => {
  try {
    const newMeeting = await new Meeting({
      caller,
      callee,
      date,
      callAccepted,
    }).save();
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          meetings: newMeeting._id,
        },
      },
      { new: true }
    );
    console.log(conversation);
  } catch (err) {
    console.error(err);
  }
};

exports.updateMeeting = async (callerId, calleeId) => {
  try {
    const existed_meeting = await Meeting.find({
      $or: [
        {
          $and: [{ caller: callerId }, { callee: calleeId }],
        },
        {
          $and: [{ caller: calleeId }, { callee: callerId }],
        },
      ],
    });
    const meeting = existed_meeting.reverse()[0];
    const s = meeting.date.getSeconds();
    const h = meeting.date.getHours();
    const m = meeting.date.getMinutes();
    const day = meeting.date.getUTCDate();

    let cur_s = new Date(Date.now()).getSeconds();
    let cur_h = new Date(Date.now()).getHours();
    let cur_m = new Date(Date.now()).getMinutes();
    let cur_day = new Date(Date.now()).getUTCDate();
    // console.log(day, " ", h, " ", m, " ", s, " ");
    // console.log(cur_day, " ", cur_h, " ", cur_m, " ", cur_s);
    if (cur_s - s <= 0) {
      cur_s += 60 - s;
      cur_m--;
      if (cur_m - m <= 0) {
        cur_m += 60 - m;
        cur_h--;
        if (cur_h - h <= 0) {
          cur_h += 24 - h;
          cur_day--;

          cur_day -= day;
        } else {
          cur_h -= h;
          cur_day -= day;
        }
      } else {
        cur_m -= m;
        cur_h -= h;
        cur_day -= day;
      }
    } else {
      cur_s -= s;
      cur_h -= h;
      cur_m -= m;
      cur_day -= day;
    }
    // console.log(cur_day, " ", cur_h, " ", cur_m, " ", cur_s);
    const timeCall =
      cur_h === 0
        ? cur_m === 0
          ? `${cur_s}s`
          : `${cur_m}m ${cur_s}s`
        : `${cur_h}h ${cur_m}m ${cur_s}s`;
    // console.log(timeCall);
    await meeting.updateOne({ timeCall });
  } catch (err) {
    console.error(err);
  }
};
