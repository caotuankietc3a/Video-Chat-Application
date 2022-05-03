import { userLoginActions } from "../slices/user-login-slice";
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
      const data = await fetch("http://localhost:5000/auth/session", {
        credentials: "include",
      });
      const { user, isLogin } = await data.json();
      if (socket_video) socket_video.emit("join-video", { userId: user._id });
      if (isLogin) {
        setTimeout(() => {
          navigate("/home-chat");
        }, 1500);
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
