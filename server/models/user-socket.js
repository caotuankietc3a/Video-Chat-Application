class User_Socket_Room {
  constructor() {
    this.users = [];
  }

  addUser({ conversationId, userInfo }) {
    this.users.push({ userInfo, conversationId });
  }

  findUser({ conversationId, userId }) {
    return this.users.find((user) => {
      return (
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
      );
    });
  }

  removeUser({ userId, conversationId }) {
    const index = this.users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    if (index !== -1) {
      return this.users.splice(index, 1);
    }
  }

  getRoomsOfUser({ userId }) {
    return this.users.filter((user) => user.userInfo.userId === userId);
  }

  getNo_UsersInRoom(conversationId) {
    return this.users.filter((user) => user.conversationId === conversationId)
      .length;
  }

  getUsersInRoom(conversationId, id) {
    return this.users.filter((user) => {
      return (
        user.conversationId === conversationId && user.userInfo.userId !== id
      );
    });
  }

  getAllUsersInRoom(conversationId) {
    return this.users.filter((user) => {
      return user.conversationId === conversationId;
    });
  }

  // Video Group Room
  updateUserShowVideo({ userId, conversationId }) {
    const index = this.users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    this.users[index].userInfo.userShowVideo =
      !this.users[index].userInfo.userShowVideo;
  }

  updateUserMuted({ userId, conversationId }) {
    const index = this.users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    this.users[index].userInfo.userMuted =
      !this.users[index].userInfo.userMuted;
  }

  updateUserShareScreen({ userId, conversationId }) {
    const index = this.users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    this.users[index].userInfo.userShareScreen =
      !this.users[index].userInfo.userShareScreen;
  }

  // Block User in A Group Conversation
  updateBlockUser({ userId, conversationId }) {
    const index = this.users.findIndex(
      (user) =>
        user.userInfo.userId === userId &&
        user.conversationId === conversationId
    );
    this.users[index].userInfo.isBlocked =
      !this.users[index].userInfo.isBlocked;
  }

  removeUsersInRoom({ socketId }) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userInfo.socketId === socketId) {
        this.users.splice(i, 1);
        i--;
      }
    }
  }
}

module.exports = User_Socket_Room;
