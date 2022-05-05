import styled from "styled-components";

export const MeetingTopControls = styled.div`
  display: flex;
  justify-content: space-between;
  z-index: 1000;
  width: 100%;
  height: 0;
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

export const Videos = styled.div`
  min-width: 0;
  position: relative;
  & video {
    object-fit: cover;
    background: black;
    width: 140px;
    height: 105px;
    cursor: pointer;
    margin: 0 1px;
  }
`;

export const MeetingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-color: #f7f7f7;
`;

export const VideoRemotePeer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const VideoRemotePeerName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #666;
  padding: 5px 0;
  height: 30px;
`;

export const VideoRemotePeerImg = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  & img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
`;

export const VideoRemotePeerStatus = styled.div``;

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
  width: 7vw;
  max-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  background: #363e47;
`;
