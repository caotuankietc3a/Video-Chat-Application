import styled from "styled-components";

export const MeetingTopControls = styled.div`
  display: flex;
  justify-content: space-between;
  z-index: 1000;
  width: 100%;
  height: 0;
  &.transparent {
    height: 95px;
    min-height: 95px;
    background: #363e47;
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

export const Videos = styled.div`
  min-width: 140px;
  position: relative;
  flex-grow: 0;
  & video {
    object-fit: cover;
    background: black;
    width: 140px;
    min-width: 140px;
    height: 95px;
    min-height: 95px;
    cursor: pointer;
    margin: 0 1px;
  }
`;

export const Peers = styled.div`
  min-width: 138px;
  display: flex;
  /* Important */
  flex-grow: 1;
  /* width: 100%; */
  justify-content: flex-start;
  /* Important */
`;

export const PeerInfo = styled.div`
  width: 135px;
  min-width: 135px;
  height: 95px;
  min-height: 95px;
  cursor: pointer;
  box-sizing: border-box;
  &.main-peer {
    border: 3px solid #da7d02;
  }
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

export const VideoRemotePeer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
`;

export const VideoRemotePeerName = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-weight: 700;
  color: #666;
  font-size: ${(props) => props.fontsize};
  padding: ${(props) => props.padding};
  height: 30px;
`;

export const VideoRemotePeerImg = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 50%;
  & img {
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    border-radius: 50%;
  }
`;

export const VideoRemotePeerStatus = styled(VideoRemotePeerName)`
  align-items: flex-end;
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
