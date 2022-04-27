const User = require('../models/user');
exports.getFriends = async (req, res, next) => {
   try {
      const userId = req.params.userId;
      let friends = [];
      if (userId !== "error") {
         friends = await User.find({_id: {$ne: userId}});
      }
      res.status(200).json(friends);
   } catch (err) {
      console.error(err);
   }
}

exports.getFriendDetail = async (req, res, next) => {
   try {
      const friendId = req.params.friendId;
      const friend = await User.findById(friendId);
      res.status(200).json(friend);
   } catch (err) {
      console.error(err);
   }
}
