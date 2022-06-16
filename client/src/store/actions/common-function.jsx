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
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  const newdate = day + " " + monthNames[month] + " " + year;

  if (parseInt(h.slice(-2)) >= 13) {
    return `${newdate}, ${h.slice(-2)}:${m.slice(-2)}`;
  }
  return `${newdate}, ${h.slice(-2)}:${m.slice(-2)}`;
};

export const callComparedDate = (date) => {
  date = new Date(date);
  let date_array = [new Date(date), new Date(Date.now())];
  date_array = date_array.map((el, _i) => {
    return {
      s: el.getSeconds(),
      m: el.getMinutes(),
      h: el.getHours(),
      day: el.getUTCDate(),
      month: el.getUTCMonth(),
      year: el.getUTCFullYear(),
    };
  });
  const {
    s: cur_s,
    m: cur_m,
    h: cur_h,
    day: cur_day,
    month: cur_month,
    year: cur_year,
  } = date_array[1];
  const { s, m, h, day, month, year } = date_array[0];

  if (year === cur_year) {
    if (month === cur_month) {
      if (day === cur_day) {
        if (h === cur_h) {
          if (m === cur_m) {
            return "Just now";
          }

          return Math.abs(cur_m - m) !== 1
            ? `${Math.abs(cur_m - m)} minutes ago`
            : `1 minute ago`;
        }
        return Math.abs(cur_h - h) !== 1
          ? `${Math.abs(cur_h - h)} hours ago`
          : `1 hour ago`;
      }
      return Math.abs(cur_day - day) !== 1
        ? `${Math.abs(cur_day - day)} days ago`
        : `Yesterday`;
    }
    return Math.abs(cur_month - month) !== 1
      ? `${Math.abs(cur_month - month)} months ago`
      : `1 month ago`;
  }
  return Math.abs(cur_year - year) !== 1
    ? `${Math.abs(cur_year - year)} years ago`
    : `1 year ago`;
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

export const arrayDisplay = [
  {
    header: {
      h5: "Account",
      p: "Update personal & contact information",
    },
    rows: [
      {
        label: "First name",
        type: "text",
        placeholder: "Type your first name",
      },
      {
        label: "Last name",
        type: "text",
        placeholder: "Type your last name",
      },
      {
        label: "Mobile number",
        type: "tel",
        placeholder: "Type your mobile phone",
      },
      { label: "Birth date", type: "date", placeholder: "mm/dd/yyyy" },
      {
        label: "Email Address",
        type: "email",
        placeholder: "Type your email address",
      },
      { label: "Website", type: "text", placeholder: "Type your website" },
      {
        label: "Address",
        type: "text",
        placeholder: "Type your address",
        width: "100%",
      },
    ],
  },

  {
    header: {
      h5: "Social network profiles",
      p: "Update social network information",
    },
    rows: [
      {
        label: "Facebook",
        type: "text",
        placeholder: "Type your facebook site",
      },
      {
        label: "Instagram",
        type: "text",
        placeholder: "Type your instagram site",
      },
      {
        label: "Twitter",
        type: "text",
        placeholder: "Type your twitter site",
      },
      {
        label: "Linkedin",
        type: "text",
        placeholder: "Type your linkedin site",
      },
    ],
  },

  {
    header: {
      h5: "Password",
      p: "Update password information",
    },
    rows: [
      {
        label: "Current Password",
        type: "password",
        placeholder: "Current password",
        width: "100%",
      },
      {
        label: "New Password",
        type: "password",
        placeholder: "New password",
      },
      {
        label: "Repeat Password",
        type: "password",
        placeholder: "Repeat password",
      },
    ],
  },

  {
    header: {
      h5: "Security",
      p: "Update secure information",
      typeDisplay: "secure",
    },
    rows: [
      {
        p1: "Use two-factor authentication",
        p2: "Ask for a code if attempted login from an unrecognised device or browser",
        width: "100%",
        id: "two-factor",
      },
      {
        p1: "Get alerts about unrecognised logins",
        p2: "You will be notified if anyone logs in from a device or browser you don't usually use",
        width: "100%",
        id: "unrecognised-logins",
      },
    ],
  },
];
