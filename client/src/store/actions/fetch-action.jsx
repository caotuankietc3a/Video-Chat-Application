import { friendActions } from "../slices/friend-slice";
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

export const fetchUserLogin = (navigate, socket_video) => {
  return async (dispatch) => {
    try {
      const data = await fetch(`${END_POINT_SERVER}/auth/session`, {
        credentials: "include",
      });
      const { user, isLogin } = await data.json();
      if (socket_video && user)
        socket_video.emit("join-video", { userId: user._id });
      if (isLogin && user) {
        setTimeout(() => {
          navigate("/home-chat");
        }, 500);
        return dispatch(
          userLoginActions.setUserLogin({
            user: user,
            isFetching: true,
            error: null,
          })
        );
      }

      dispatch(
        userLoginActions.setUserLogin({
          user: user,
          isFetching: false,
          error: null,
        })
      );
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
  return async (dispatch) => {
    console.log("Destroy");
    dispatch(userLoginActions.setUserLogout());
    await postData({ msg: "logout" }, `${END_POINT_SERVER}/auth/logout`);
    setTimeout(() => {
      navigate("/");
    }, 50);
  };
};
