const users = [];
class User_Socket {
  static addUser({ conversationId, userInfo }) {
    users.push({ userInfo, conversationId });
  }

  static findUser({ conversationId, userId }) {
    return users.find((user) => {
      return (
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
      );
    });
  }

  static removeUser({ userId, conversationId }) {
    const index = users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
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
    return users.filter((user) => user.userInfo.userId === userId);
  }

  static getNo_UsersInRoom(conversationId) {
    return users.filter((user) => user.conversationId === conversationId)
      .length;
  }

  static getUsersInRoom(conversationId, id) {
    return users.filter((user) => {
      return (
        user.conversationId === conversationId && user.userInfo.userId !== id
      );
    });
  }

  static getAllUsersInRoom(conversationId) {
    return users.filter((user) => {
      return user.conversationId === conversationId;
    });
  }

  static updateUserShowVideo({ userId, conversationId }) {
    const index = users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    console.log("dddddddddddddddddd ", index);
    users[index].userInfo.userShowVideo = !users[index].userInfo.userShowVideo;
    console.log(users[index]);
  }
}

module.exports = User_Socket;
