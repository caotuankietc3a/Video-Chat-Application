const users = [];
class User_Socket {
  static addUser({ conversationId, userId }) {
    users.push({ userId, conversationId });
  }

  static removeUser({ userId, conversationId }) {
    const index = users.findIndex(
      (user) => user.userId === userId && user.conversationId === conversationId
    );
    console.log(index);
    if (index !== -1) {
      return users.splice(index, 1);
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

  static getAllUsersInRoom(conversationId) {
    return users.filter((user) => {
      return user.conversationId === conversationId;
    });
  }
}

module.exports = User_Socket;
