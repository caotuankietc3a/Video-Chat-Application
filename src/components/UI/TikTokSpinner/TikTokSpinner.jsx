import classes from "./TikTokSpinner.module.css";
const TikTokSpinner = () => {
  return (
    <div className={classes.container}>
      <div className={classes.loader}></div>
    </div>
  );
};

export default TikTokSpinner;
