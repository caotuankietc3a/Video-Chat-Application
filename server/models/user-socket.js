// const users = [];
// class User_Socket {
//   static addUser({ conversationId, userInfo }) {
//     users.push({ userInfo, conversationId });
//   }
//
//   static findUser({ conversationId, userId }) {
//     return users.find((user) => {
//       return (
//         user.userInfo.userId === userId &&
//         user.conversationId === conversationId
//       );
//     });
//   }
//
//   static removeUser({ userId, conversationId }) {
//     const index = users.findIndex(
//       (user) =>
//         user.userInfo.userId === userId &&
//         user.conversationId === conversationId
//     );
//     if (index !== -1) {
//       return users.splice(index, 1);
//     }
//   }
//
//   static removeUsersInRoom(conversationId) {
//     for (let i = 0; i < users.length; i++) {
//       if (users[i].conversationId.toString() === conversationId.toString()) {
//         users.splice(i, 1);
//         i--;
//       }
//     }
//   }
//
//   static getRoomsOfUser({ userId }) {
//     return users.filter((user) => user.userInfo.userId === userId);
//   }
//
//   static getNo_UsersInRoom(conversationId) {
//     return users.filter((user) => user.conversationId === conversationId)
//       .length;
//   }
//
//   static getUsersInRoom(conversationId, id) {
//     return users.filter((user) => {
//       return (
//         user.conversationId === conversationId && user.userInfo.userId !== id
//       );
//     });
//   }
//
//   static getAllUsersInRoom(conversationId) {
//     return users.filter((user) => {
//       return user.conversationId === conversationId;
//     });
//   }
//
//   static updateUserShowVideo({ userId, conversationId }) {
//     const index = users.findIndex(
//       (user) =>
//         user.userInfo.userId === userId &&
//         user.conversationId === conversationId
//     );
//     users[index].userInfo.userShowVideo = !users[index].userInfo.userShowVideo;
//   }
//
//   static updateUserMuted({ userId, conversationId }) {
//     const index = users.findIndex(
//       (user) =>
//         user.userInfo.userId === userId &&
//         user.conversationId === conversationId
//     );
//     users[index].userInfo.userMuted = !users[index].userInfo.userMuted;
//   }
//
//   static updateUserShareScreen({ userId, conversationId }) {
//     const index = users.findIndex(
//       (user) =>
//         user.userInfo.userId === userId &&
//         user.conversationId === conversationId
//     );
//     users[index].userInfo.userShareScreen =
//       !users[index].userInfo.userShareScreen;
//   }
// }
//
// module.exports = User_Socket;
//

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
        console.log(this.users.splice(i, 1));
        // this.users.splice(i, 1);
        i--;
      }
    }
  }

  displayAllUsers() {
    console.log(this.users);
  }
}

module.exports = User_Socket_Room;
