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
      if (type) dispatch(userLoginActions.setIsFetching({ isFetching: true }));
      const { socket_notify, socket_video } = getState().socket;

      const { user, isLogin, status, msg } = await fetchSession(type);
      if (!type) {
        if (!user) {
          dispatch(userLoginActions.setIsFetching({ isFetching: false }));
          return navigate("/");
        }
        if (isLogin) {
          socket_video.emit("join-video", { userId: user._id });
          socket_notify.emit("log-in");
          dispatch(
            userLoginActions.setUserLogin({
              user: user,
              isFetching: false,
              error: null,
            })
          );
          navigate("/home-chat");
        } else {
          dispatch(
            userLoginActions.setUserLogin({
              user: null,
              isFetching: false,
              error: null,
            })
          );
        }
      } else {
        if (status === "error") {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            html: msg,
            showConfirmButton: "Ok",
            allowOutsideClick: false,
          }).then(() => {
            navigate("/");
          });
        }
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
      dispatch(userLoginActions.setIsFetching({ isFetching: true }));
      const { user } = await signInWithPopup(auth, provider);
      const { socket_notify } = getState().socket;
      const email =
        type === "google"
          ? user.email
          : type === "facebook"
          ? user.providerData[0].email
          : type === "github"
          ? user.reloadUserInfo.screenName + "@gmail.com"
          : null;
      const data = await postData(
        {
          fullname: user.displayName,
          email,
          phone: user.phoneNumber,
          profilePhoto: {
            url: user.photoURL,
          },
        },
        `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/login-with-other?type=${type}`
      );

      if (data.status === "success") {
        socket_notify.emit("log-in");
        dispatch(userLoginActions.setIsFetching({ isFetching: false }));
        dispatch(userLoginActions.setUser({ user: data.user }));
        navigate("/home-chat");
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
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: "Unable to login! Please try a gain!!!",
        showConfirmButton: "Continue",
        timer: 3000,
      }).then(() => {
        dispatch(userLoginActions.setIsFetching({ isFetching: false }));
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

        return dispatch(
          friendActions.setFriends({
            friends: [...friends, ...group_conversations],
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
        html: "Please enter your token to complete <strong>2-factor authentication</strong>!!",
        input: "number",
        inputPlaceholder: "6-digits",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        backdrop: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: (otpToken) => {
          return postData(
            { otpToken },
            `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/verify-2FA/${userId}`
          )
            .then((response) => {
              console.log(response);
              if (response.status === "valid") {
                socket_notify.emit("log-in");
                dispatch(userLoginActions.setIsFetching({ isFetching: false }));
                dispatch(userLoginActions.setUser({ user: response.user }));
                navigate("/home-chat");
              } else if (response.status === "invalid") {
                return Promise.reject(response.msg);
              }
            })
            .catch((error) => {
              console.log(error);
              Swal.showValidationMessage(`Error: ${error}`);
            });
        },
      }).then((result) => {
        if (result.isDismissed) {
          dispatch(userLoginActions.setIsFetching({ isFetching: false }));
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: "Unable to login! Please try a gain!!!",
            showConfirmButton: "Ok",
          });
        }
      });
    });
  };
};

export const enable2FAFunction = (QRCodeUrl, userId, uniqueSecret) => {
  return async (dispatch, _getState) => {
    Swal.fire({
      html: "Please scan this <strong>QR code</strong> to verify <strong><i>2-factor authentication</i></strong>!!",
      imageUrl: QRCodeUrl,
      confirmButtonText: "Next",
    }).then(() => {
      // Swal.fire({
      //   html: `You will be redirected to <strong>2-factor authentication page</strong> after this message.`,
      //   showConfirmButton: false,
      //   icon: "success",
      //   timer: 3500,
      // }).then(() => {
      Swal.fire({
        html: "Please enter your token to complete <strong>2-factor authentication</strong>!!",
        input: "number",
        inputPlaceholder: "6-digits",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        backdrop: true,
        confirmButtonText: "Submit",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: (otpToken) => {
          return postData(
            { otpToken, secret: uniqueSecret },
            `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/verify-2FA/${userId}`
          )
            .then((response) => {
              console.log(response);
              if (response.status === "valid") {
                dispatch(userLoginActions.setUser({ user: response.user }));

                Swal.fire({
                  html: "Enable <strong><i>2-factor authentication</i></strong> completely!",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
              } else if (response.status === "invalid") {
                return Promise.reject(response.msg);
              }
            })
            .catch((error) => {
              Swal.showValidationMessage(`Error: ${error}`);
            });
        },
      });
      // .then((result) => {
      //   if (result.isDismissed) {
      //     return postData(
      //       { is2FAEnabled: false },
      //       `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/update-profile-security/${userId}`
      //     );
      //   }
      // })
      // .then((res) => {
      //   if (res.status === "cancel") {
      //     dispatch(userLoginActions.setUser({ user: res.user }));
      //     Swal.fire({
      //       icon: "error",
      //       title: "Oops...",
      //       html: "Can't activate <strong>2-factor authentication</strong>!!",
      //       showConfirmButton: "Ok",
      //     });
      //   }
      // });
    });
    // });
  };
};
