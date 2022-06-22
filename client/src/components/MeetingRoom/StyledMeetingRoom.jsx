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

export const UserVideo = styled.div`
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & video {
    height: 100%;
    width: ${({ isFullScreen }) => (isFullScreen ? "100%" : "90%")};
    object-fit: cover;
    z-index: -900;
    background-color: #333;
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
  /* position: relative; */
  /* background: #141414f0; */
  display: flex;
  flex-wrap: wrap;
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
  padding: 20px;
  display: flex;
  /* height: 100vh; */
  /* width: 90%; */
  margin: auto;
  flex-wrap: wrap;
`;

export const StyledVideo = styled.video`
  height: auto;
  width: auto;
  z-index: 1000;
`;
