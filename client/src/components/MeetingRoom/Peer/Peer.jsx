import {
  VideoRemotePeer,
  VideoRemotePeerImg,
  VideoRemotePeerName,
  VideoRemotePeerStatus,
  PeerInfo,
} from "./StyledPeer";
const Peer = (props) => {
  const { fontsize, padding, heightImg, widthImg, userImg, type } = props;
  return type !== "main-screen-peer" ? (
    <PeerInfo className={type}>
      <VideoRemotePeer>
        <VideoRemotePeerName fontsize={fontsize} padding={padding}>
          sdfa
        </VideoRemotePeerName>
        <VideoRemotePeerImg height={heightImg} width={widthImg}>
          <img src={userImg} alt="Unknown" />
        </VideoRemotePeerImg>
        <VideoRemotePeerStatus fontsize={fontsize} padding={padding}>
          sdafgsdfa
        </VideoRemotePeerStatus>
      </VideoRemotePeer>
    </PeerInfo>
  ) : (
    <VideoRemotePeer>
      <VideoRemotePeerName fontsize={fontsize} padding={padding}>
        sdfa
      </VideoRemotePeerName>
      <VideoRemotePeerImg height={heightImg} width={widthImg}>
        <img src={userImg} alt="Unknown" />
      </VideoRemotePeerImg>
      <VideoRemotePeerStatus fontsize={fontsize} padding={padding}>
        sdafgsdfa
      </VideoRemotePeerStatus>
    </VideoRemotePeer>
  );
};

export default Peer;
