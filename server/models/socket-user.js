const users = [];
class User {
   static addUser(userId, conversationId) {
      const existedUser = users.find(user => user.userId === userId);
      if (!existedUser) {
         const user = {userId, conversationId};
         users.push(user);
      }
   }

   static removeUser(userId) {
      const index = users.findIndex(user => user.userId === userId);
      if (index !== -1) {
         users.splice(index, 1);
      }
   }

   static getUser(id) {
      return users.find(user => user.id === id);
   }

   static getUsersInRoom(room) {
      return users.filter(user => user.room === room);
   }
}

module.exports = {
   SocketUser: User,
   users
};
