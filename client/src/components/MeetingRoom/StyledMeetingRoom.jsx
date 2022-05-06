import styled from "styled-components";

export const MeetingTopControls = styled.div`
  justify-content: ${({ showTop }) =>
    !showTop ? "flex-end" : "space-between"};
  z-index: 1000;
  width: 100%;
  display: flex;
  height: 0;
  &.transparent {
    height: 95px;
    min-height: 95px;
    background: #363e47;
    display: flex;
  }
`;

export const PannelControl = styled.div`
  position: relative;
  width: 60px;
  height: 95px;
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* display: none; */
  & svg {
    font-size: 20px;
    color: #ffffff;
  }
`;

export const Videos = styled.div`
  min-width: 140px;
  position: relative;
  flex-grow: 0;
  & video {
    object-fit: cover;
    background: black;
    width: 140px;
    min-width: 140px;
    height: ${({ showTop }) => (showTop ? "95px" : "105px")};
    min-height: ${({ showTop }) => (showTop ? "95px" : "105px")};
    cursor: pointer;
    margin: 0 1px;
  }
`;

export const Peers = styled.div`
  min-width: 138px;
  display: flex;
  /* Important */
  flex-grow: 1;
  justify-content: flex-start;
  /* Important */
`;

export const MeetingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  /* background-color: #333; */
`;

export const MeetingVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const MeetingBottomControls = styled.div`
  padding-bottom: 18px;
  position: absolute;
  bottom: 0;
  z-index: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FunctionControls = styled.div`
  min-width: 50px;
  width: 8vw;
  max-width: 80px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  background: #363e47;
  &:hover {
    background: #303841;
  }

  &.phone_off {
    background: #eb1819;
    height: 53px;
    &:hover {
      background: #d61314;
    }
  }
`;
