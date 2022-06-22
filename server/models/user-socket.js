const users = [];
class User_Socket {
  static addUser({ conversationId, userId }) {
    users.push({ userId, conversationId });
  }

  static removeUser({ userId, conversationId }) {
    const index = users.findIndex(
      (user) => user.userId === userId && user.conversationId === conversationId
    );
    if (index !== -1) {
      users.splice(index, 1);
    }
  }

  static removeUsersInRoom(conversationId) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].conversationId.toString() === conversationId.toString()) {
        users.splice(i, 1);
        i--;
      }
    }
  }

  static getRoomsOfUser({ userId }) {
    return users.filter((user) => user.userId === userId);
  }

  static getNo_UsersInRoom(conversationId) {
    return users.filter((user) => user.conversationId === conversationId)
      .length;
  }

  static getUsersInRoom(conversationId, id) {
    return users.filter((user) => {
      return user.conversationId === conversationId && user.userId !== id;
    });
  }
}

module.exports = User_Socket;
