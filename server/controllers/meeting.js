const Meeting = require("../models/meeting.js");
const User = require("../models/user.js");
exports.getMeetings = async (req, res, _next) => {
  try {
    const { userId } = req.query;
    const meetings = await Meeting.find({
      $or: [{ caller: userId }, { callee: userId }],
    }).populate({ path: "caller callee" });
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
      $or: [{ caller: id }, { callee: id }],
    }).populate({ path: "caller callee" });
    res.status(200).json({ calls_detail: meetings, callee: callee });
  } catch (err) {
    console.error(err);
  }
};

exports.saveMeeting = async (caller, callee, date, callAccepted) => {
  try {
    const newMeeting = new Meeting({
      caller,
      callee,
      date,
      callAccepted,
    });
    newMeeting.save();
  } catch (err) {
    console.error(err);
  }
};
