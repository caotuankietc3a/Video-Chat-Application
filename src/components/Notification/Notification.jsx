import { useEffect } from "react";
import {
  NotificationContainer,
  NotificationContent,
  NotificationIcon,
  NotificationWrapper,
  NotificationCountDown,
  NotificationCloseBtn,
  NotificationText,
} from "./StyledNotification";
import { IoClose } from "react-icons/io5";
import { BiError } from "react-icons/bi";

const Notification = ({ error, closeNotification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeNotification();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  return (
    <NotificationContainer className={error ? "active" : ""}>
      <NotificationContent>
        <NotificationWrapper>
          <NotificationIcon>
            <BiError />
          </NotificationIcon>
          <NotificationCountDown></NotificationCountDown>
        </NotificationWrapper>
        <NotificationText>{error}</NotificationText>
        <NotificationCloseBtn onClick={closeNotification}>
          <IoClose />
        </NotificationCloseBtn>
      </NotificationContent>
    </NotificationContainer>
  );
};

export default Notification;
