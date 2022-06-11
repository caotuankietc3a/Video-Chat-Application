import { BsChatDots } from "react-icons/bs";
import {
  CallFormContainer,
  CallFormContent,
  CallFormBody,
  CallFormAvatar,
  CallFormDetail,
  CallFormOptions,
  CallFormInfo_Btn,
  CallFormGroupInfo,
} from "./StyledCallForm.jsx";
// import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import CallItems from "./CallItems/CallItems";
import { BiDotsVerticalRounded } from "react-icons/bi";

const CallForm = ({ calls, callee: { profilePhoto, fullname, phone } }) => {
  return (
    <CallFormContainer>
      <CallFormContent>
        <CallFormBody>
          <CallFormAvatar>
            <img src={profilePhoto} alt="" />
          </CallFormAvatar>
          <CallFormDetail>
            <h5>{fullname}</h5>
            <CallFormInfo_Btn>
              <div className="chat">{phone}</div>
            </CallFormInfo_Btn>
          </CallFormDetail>
          <CallFormOptions>
            <BiDotsVerticalRounded />
          </CallFormOptions>
        </CallFormBody>
        <CallFormGroupInfo>
          {calls.map((call) => (
            <CallItems />
          ))}
        </CallFormGroupInfo>
      </CallFormContent>
    </CallFormContainer>
  );
};

export default CallForm;
