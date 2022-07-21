export const initialNavBar = {
  home_chat: "active",
  phone: "",
  friend: "",
  info: "",
};

export const reducerNavBar = (_state, action) => {
  switch (action.type) {
    case "info": {
      return {
        home_chat: "",
        phone: "",
        friend: "",
        info: "active",
      };
    }
    case "phone": {
      return {
        home_chat: "",
        phone: "active",
        friend: "",
        info: "",
      };
    }
    case "friend": {
      return {
        home_chat: "",
        phone: "",
        friend: "active",
        info: "",
      };
    }
    default: {
      return initialNavBar;
    }
  }
};
