import {
  CallItemsContainer,
  CallItemsContent,
  CallItemsMedia,
  CallItemsMediaAvatar,
  CallItemsMediaBody,
  CallItemsMediaOptions,
} from "./StyledCallItems";

import {
  BsFillTelephoneInboundFill,
  BsFillTelephoneOutboundFill,
} from "react-icons/bs";

import { BsTelephone } from "react-icons/bs";
const CallItems = () => {
  return (
    <CallItemsContainer>
      <CallItemsContent>
        <CallItemsMedia>
          <CallItemsMediaAvatar>
            <span>
              <BsFillTelephoneInboundFill />
            </span>
          </CallItemsMediaAvatar>
          <CallItemsMediaBody>
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
