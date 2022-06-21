const users = [];
class User_Socket {
  static addUser({ userId, conversationId }) {
    const existUser = users.find(
      (user) => user.userId === userId && user.conversationId === conversationId
    );
    if (!existUser) {
      users.push({ userId, conversationId });
    }
  }

  static removeUser({ userId, conversationId }) {
    const index = users.findIndex(
      (user) => user.userId === userId && user.conversationId === conversationId
    );
    console.log(index);
    if (index !== -1) {
      users.splice(index, 1);
    }
  }

  static getUser({ userId, conversationId }) {
    return users.find(
      (user) => user.userId === userId && user.conversationId === conversationId
    );
  }

  static getNo_UsersInRoom(conversationId) {
    return users.filter((user) => user.conversationId === conversationId)
      .length;
  }

  static getUsersInRoom(conversationId) {
    return users.filter((user) => user.conversationId === conversationId);
  }
}

module.exports = User_Socket;
