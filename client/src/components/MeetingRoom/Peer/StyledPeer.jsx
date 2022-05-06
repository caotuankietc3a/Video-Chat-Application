import styled from "styled-components";

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
