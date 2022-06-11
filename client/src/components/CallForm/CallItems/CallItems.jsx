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
import { callComparedDate } from "../../../store/actions/common-function";
import { useSelector } from "react-redux";
const CallItems = ({ call }) => {
  const userState = useSelector((state) => state.user);
  return (
    <CallItemsContainer>
      <CallItemsContent>
        <CallItemsMedia>
          <CallItemsMediaAvatar>
            <span>
              {userState.user._id.toString() === call.caller._id.toString() ? (
                <HiPhoneOutgoing />
              ) : (
                <HiPhoneIncoming />
              )}
            </span>
          </CallItemsMediaAvatar>
          <CallItemsMediaBody>
            <h6 className={call.callAccepted ? "" : "missed-call"}>
              {!call.callAccepted
                ? "Missed Call"
                : userState.user._id.toString() === call.caller._id.toString()
                ? "Outgoing Call"
                : "Incomming Call"}
            </h6>
            <div>
              <p>{callComparedDate(call.date)}</p>
              {/* Do later */}
              <span>•</span>
              <p>{call.timeCall}</p>
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
