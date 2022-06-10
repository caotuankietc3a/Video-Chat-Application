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
      if (socket_video) socket_video.emit("join-video", { userId: user._id });
      if (isLogin) {
        setTimeout(() => {
          navigate("/home-chat");
        }, 1250);
        dispatch(
          userLoginActions.setUserLogin({
            user: user,
            isFetching: true,
            error: null,
          })
        );
      } else {
        dispatch(userLoginActions.setIsFetching({ isFetching: false }));
      }
    } catch (err) {
      console.error(err);
    }
  };
};
