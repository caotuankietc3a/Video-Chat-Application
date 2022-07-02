import { signInWithPopup } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { friendActions } from "../slices/friend-slice";
import { socketActions } from "../slices/socket-slice";
import { userLoginActions } from "../slices/user-login-slice";
import Swal from "sweetalert2";
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

export const fetchSession = async (type) => {
  const data = await fetch(`${END_POINT_SERVER}/auth/session?type=${type}`, {
    credentials: "include",
  });
  return await data.json();
};

export const fetchUserLogin = (navigate, type = 0) => {
  return async (dispatch, getState) => {
    try {
      const { socket_notify, socket_video } = getState().socket;

      const { user, isLogin } = await fetchSession(type);
      if (!type) {
        if (isLogin) {
          setTimeout(() => {
            navigate("/home-chat");
          }, 500);
          socket_video.emit("join-video", { userId: user._id });
          socket_notify.emit("log-in");
        }
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

export const authOtherLoginHandler = (navigate, provider, type = "google") => {
  return async (dispatch, getState) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);
      const { socket_notify } = getState().socket;
      let data = null;
      if (type === "google") {
        data = await postData(
          {
            fullname: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            profilePhoto: {
              url: user.photoURL,
            },
          },
          // `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/login-with-google`
          `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/login-with-other?type=${type}`
        );
      } else if (type === "facebook") {
        data = await postData(
          {
            fullname: user.displayName,
            email: user.providerData[0].email,
            phone: user.phoneNumber,
            profilePhoto: {
              url: user.photoURL,
            },
          },
          // `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/login-with-google`
          `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/login-with-other?type=${type}`
        );
      } else if (type === "twitter") {
      }

      if (data.status === "success") {
        setTimeout(() => {
          socket_notify.emit("log-in");
          navigate("/home-chat");
          dispatch(userLoginActions.setIsFetching({ isFetching: false }));
        }, 500);
        console.log(data.user);

        dispatch(
          userLoginActions.setUserLogin({
            user: data.user,
            isFetching: true,
            error: null,
          })
        );
      } else if (data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          html: data.msg,
          showConfirmButton: "Continue",
          timer: 3000,
        });
      } else if (data.status === "enable2FA") {
        dispatch(verifyEnable2FA(navigate, data.userId));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: "Unable to login! Please try a gain!!!",
        showConfirmButton: "Continue",
        timer: 3000,
      });
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

        const resGroupConversations = await fetch(
          `${END_POINT_SERVER}/conversation/${
            user ? user._id : "error"
          }?isGroup=${1}`,
          {
            credentials: "include",
          }
        );

        let group_conversations = await resGroupConversations.json();
        group_conversations = group_conversations.map((el) => {
          return {
            status: true,
            fullname: el.name,
            profilePhoto: el.profilePhoto,
            isGroup: true,
            _id: el._id,
          };
        });
        console.log(group_conversations);

        return dispatch(
          friendActions.setFriends({
            friend: [...friends, ...group_conversations],
          })
        );
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
    socket_notify.emit("log-out");
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

export const verifyEnable2FA = (navigate, userId) => {
  return async (dispatch, getState) => {
    const { socket_notify } = getState().socket;
    Swal.fire({
      html: `Correct login information, will be redirected to <strong>2-factor authentication page</strong> after this message.`,
      showConfirmButton: false,
      icon: "success",
      timer: 3500,
    }).then(() => {
      Swal.fire({
        html: "Please enter your token complete <strong>2-factor authentication</strong>!!",
        input: "number",
        inputPlaceholder: "6-digits",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        backdrop: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async (otpToken) => {
          return postData(
            { otpToken },
            `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/verify-2FA/${userId}`
          )
            .then((response) => {
              if (response.status === "valid") {
                setTimeout(() => {
                  socket_notify.emit("log-in");
                  navigate("/home-chat");
                  dispatch(
                    userLoginActions.setIsFetching({ isFetching: false })
                  );
                }, 500);

                dispatch(
                  userLoginActions.setUserLogin({
                    user: response.user,
                    isFetching: true,
                    error: null,
                  })
                );
              } else if (response.status === "invalid") {
                return Promise.reject(response.msg);
              }
            })
            .catch((error) => {
              Swal.showValidationMessage(`Error: ${error}`);
            });
        },
      });
    });
  };
};
