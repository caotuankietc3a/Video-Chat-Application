import styled from "styled-components";

export const NotificationContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;

  /* top: -100px; */
  /* right: -100px; */
  overflow: hidden;
  /* padding: 8px; */
  height: 56px;
  width: auto;
  min-width: 450px;
  /* width: 300px; */
  background-color: #fff;
  border-radius: 5px;
  z-index: 1000;
  background-color: rgb(255, 250, 230);
  transform: scale(0%);
  transition: transform 120ms ease 100ms;
  &.active {
    transform: scale(100%);
  }
`;

export const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* background-color: rgb(255, 250, 230); */
  box-shadow: rgb(0 0 0 / 18%) 0px 3px 8px;
`;
export const NotificationWrapper = styled.div`
  padding-bottom: 16px;
  display: flex;
  background-color: rgb(255, 171, 0);
  border-radius: 5px 0px 0px 5px;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
export const NotificationIcon = styled.div`
  min-width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    color: #fffae6;
    height: 25px;
    width: 25px;
  }
`;
export const NotificationCountDown = styled.div``;

export const NotificationText = styled.div`
  font-size: 17px;
  font-style: italic;
  display: flex;
  align-items: center;
  min-height: 56px;
  color: #ff8b00;
  font-weight: 500;
  margin: 0 5px;
  padding-bottom: 20px;
  padding-left: 10px;
  width: 100%;
`;
export const NotificationCloseBtn = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  padding-bottom: 16px;
  & svg {
    &:hover {
      color: #ff8b0050;
    }
    color: #ff8b00;
    height: 25px;
    width: 25px;
  }
`;
