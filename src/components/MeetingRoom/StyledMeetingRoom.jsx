import styled from "styled-components";

export const MeetingTopControls = styled.div`
  justify-content: ${({ showTop }) =>
    !showTop ? "flex-end" : "space-between"};
  z-index: 1000;
  width: 100%;
  display: flex;
  height: 0;
  position: fixed;
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
  & svg {
    font-size: 20px;
    color: #ffffff;
  }
`;

export const MyVideo = styled.div`
  min-width: 140px;
  width: 140px;
  position: relative;
  flex-grow: 0;
  /* margin: 0 5px; */
  margin-right: 5px;
  & video {
    object-fit: cover;
    background: black;
    border-radius: 8px;
    width: 100%;
    min-width: 140px;
    height: ${({ showTop }) => (showTop ? "95px" : "105px")};
    min-height: ${({ showTop }) => (showTop ? "95px" : "105px")};
    cursor: pointer;
    margin: 0px;
  }
`;

export const UserVideo = styled.div`
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & video {
    border-radius: 8px;
    width: ${({ isFullScreen }) => (isFullScreen ? "100%" : "90%")};
    height: ${({ isFullScreen }) => (isFullScreen ? "100%" : "90%")};
    object-fit: cover;
    z-index: -900;
    background-color: #3c4043;
    overflow: scroll;
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
  background: #202124;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const MeetingBottomControls = styled.div`
  padding-bottom: 18px;
  position: fixed;
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

export const Container = styled.div`
  padding-top: ${({ showTop }) => (showTop ? "95px" : "0px")};
  display: flex;
  margin: 20px 0;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledVideo = styled.div`
  width: 719px;
  height: 405px;
  /* z-index: 1000; */
  background-color: #3c4043;
  border-radius: 8px;
  border: 0;
  margin: 20px;
  /* position: absolute; */
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;
