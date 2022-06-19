import { friendActions } from "../slices/friend-slice";
import { socketActions } from "../slices/socket-slice";
import { userLoginActions } from "../slices/user-login-slice";
const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
export const postData = async (data, typeUrl) => {
  const res = await fetch(typeUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...data }),
  });
  return res.json();
};

export const fetchUserLogin = (navigate, type = 0) => {
  return async (dispatch, getState) => {
    try {
      const { socket_notify, socket_video } = getState().socket;
      const data = await fetch(
        `${END_POINT_SERVER}/auth/session?type=${type}`,
        {
          credentials: "include",
        }
      );
      const { user, isLogin } = await data.json();
      console.log(user);
      if (!type) {
        if (isLogin) {
          setTimeout(() => {
            navigate("/home-chat");
          }, 500);
          socket_video.emit("join-video", { userId: user._id });
          socket_notify.emit("log-in");
        }
        socket_notify.emit("log-out");
        return dispatch(
          userLoginActions.setUserLogin({
            user: isLogin ? user : null,
            isFetching: isLogin ? true : false,
            error: null,
          })
        );
      } else {
        socket_video.emit("join-video", { userId: user._id });
        socket_notify.emit("log-in");
        dispatch(
          userLoginActions.setUserLogin({
            user: user,
            isFetching: false,
            error: null,
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const fetchFriends = () => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState().user;
      if (user) {
        const resFriends = await fetch(
          `${END_POINT_SERVER}/friend/${user ? user._id : "error"}`,
          {
            credentials: "include",
          }
        );
        const friends = await resFriends.json();
        dispatch(friendActions.setFriends({ friend: friends }));
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const logoutHandler = (navigate) => {
  return async (dispatch, getState) => {
    const { user } = getState().user;
    const { socket_video, socket_notify, socket_chat } = getState().socket;
    await postData({ user }, `${END_POINT_SERVER}/auth/logout`);
    socket_video.disconnect();
    socket_chat.disconnect();
    socket_notify.disconnect();
    dispatch(userLoginActions.setUserLogout());
    setTimeout(() => {
      dispatch(socketActions.setSocket_Video());
      dispatch(socketActions.setSocket_Chat());
      dispatch(socketActions.setSocket_Notify());
      navigate("/");
    }, 50);
  };
};
