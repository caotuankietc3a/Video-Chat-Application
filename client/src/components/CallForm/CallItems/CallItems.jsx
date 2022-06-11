import {
  CallItemsContainer,
  CallItemsContent,
  CallItemsMedia,
  CallItemsMediaAvatar,
  CallItemsMediaBody,
  CallItemsMediaOptions,
} from "./StyledCallItems";
import { HiPhoneIncoming, HiPhoneOutgoing } from "react-icons/hi";
import { BsTelephone } from "react-icons/bs";
const CallItems = () => {
  return (
    <CallItemsContainer>
      <CallItemsContent>
        <CallItemsMedia>
          <CallItemsMediaAvatar>
            <span>
              <HiPhoneIncoming />
            </span>
          </CallItemsMediaAvatar>
          <CallItemsMediaBody>
            {/* <h6 className="missed-call">Incomming Call</h6> */}
            <h6>Incomming Call</h6>
            <div>
              <p>Just Now</p>
              <span>•</span>
              <p>2m 35s</p>
            </div>
          </CallItemsMediaBody>
          <CallItemsMediaOptions>
            <button>
              <BsTelephone />
            </button>
          </CallItemsMediaOptions>
        </CallItemsMedia>
      </CallItemsContent>
    </CallItemsContainer>
  );
};

export default CallItems;
