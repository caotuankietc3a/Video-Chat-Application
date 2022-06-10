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
import { FiPhone } from "react-icons/fi";
const CallForm = () => {
  return (
    <CallFormContainer>
      <CallFormContent>
        <CallFormBody>
          <CallFormAvatar>
            {/* <img src={profilePhoto} alt="" /> */}
            <img src="/images/user-img.jpg" alt="" />
          </CallFormAvatar>
          <CallFormDetail>
            {/* <h5>{fullname}</h5> */}
            <h5>Cao Tuan Kiettttt</h5>
            <CallFormInfo_Btn>
              <div className="chat">sdfasdfasdfa</div>
            </CallFormInfo_Btn>
          </CallFormDetail>
          <CallFormOptions>
            <BiDotsVerticalRounded />
          </CallFormOptions>
        </CallFormBody>
        <CallFormGroupInfo>
          <CallItems />
        </CallFormGroupInfo>
      </CallFormContent>
    </CallFormContainer>
  );
};

export default CallForm;
