import { errorActions } from "../slices/error-slice";

export const closeNotification = () => {
  return (dispatch) => {
    dispatch(errorActions.setErrorNotify());
  };
};
