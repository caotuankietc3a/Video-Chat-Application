import styled from "styled-components";

export const PeerInfo = styled.div`
  width: 135px;
  min-width: 135px;
  height: 95px;
  min-height: 95px;
  cursor: pointer;
  box-sizing: border-box;
  margin-right: 5px;
  &.main-peer {
    border: 3px solid #da7d02;
    border-radius: 8px;
  }
`;

export const VideoRemotePeer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  margin: ${({ margin }) => margin};
  margin-right: 9px;
  width: ${({ width }) => (width ? width : "100%")};
  height: ${({ height }) => (height ? height : "100%")};
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
