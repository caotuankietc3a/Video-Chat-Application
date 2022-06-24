import {
  VideoRemotePeer,
  VideoRemotePeerImg,
  VideoRemotePeerName,
  VideoRemotePeerStatus,
  PeerInfo,
} from "./StyledPeer";
const Peer = ({
  fontsize,
  padding,
  heightImg,
  margin,
  widthImg,
  userImg,
  type,
  width,
  height,
  name,
  isTurnOnAudio,
}) => {
  return type !== "main-screen-peer" ? (
    <PeerInfo className={type}>
      <VideoRemotePeer>
        <VideoRemotePeerName fontsize={fontsize} padding={padding}>
          {name}
        </VideoRemotePeerName>
        <VideoRemotePeerImg height={heightImg} width={widthImg}>
          <img src={userImg} alt="Unknown" />
        </VideoRemotePeerImg>
        <VideoRemotePeerStatus fontsize={fontsize} padding={padding}>
          {isTurnOnAudio ? "Audio only" : "Spectator"}
        </VideoRemotePeerStatus>
      </VideoRemotePeer>
    </PeerInfo>
  ) : (
    <VideoRemotePeer height={height} width={width} margin={margin}>
      <VideoRemotePeerName fontsize={fontsize} padding={padding}>
        {name}
      </VideoRemotePeerName>
      <VideoRemotePeerImg height={heightImg} width={widthImg}>
        <img src={userImg} alt="Unknown" />
      </VideoRemotePeerImg>
      <VideoRemotePeerStatus fontsize={fontsize} padding={padding}>
        {isTurnOnAudio ? "Audio only" : "Spectator"}
      </VideoRemotePeerStatus>
    </VideoRemotePeer>
  );
};

export default Peer;
