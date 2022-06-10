const Meeting = require("../models/meeting.js");
exports.getMeetings = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const meetings = await Meeting.find({
      $or: [{ caller: userId }, { callee: userId }],
    }).populate({ path: "callee" });
    res.status(200).json(meetings);
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
