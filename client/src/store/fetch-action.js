import { userLoginActions } from "./user-login-slice";
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

export const formatDate = (date) => {
  date = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const newdate = day + " " + monthNames[month] + " " + year;
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  if (parseInt(h.slice(-2)) >= 13) {
    return `${newdate}, ${h.slice(-2)}:${m.slice(-2)}`;
  }
  return `${newdate}, ${h.slice(-2)}:${m.slice(-2)}`;
};

export const compareString = (friends) => {
  for (let i = 0; i < friends.length; i++) {
    for (let j = i + 1; j < friends.length; j++) {
      if (
        friends[i].fullname.toLowerCase()[0] >=
        friends[j].fullname.toLowerCase()[0]
      ) {
        const x = friends[i];
        friends[i] = friends[j];
        friends[j] = x;
      }
    }
  }
  return friends;
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
