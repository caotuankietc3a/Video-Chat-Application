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
  console.log(date_array[0]);
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
        : `1 day ago`;
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
