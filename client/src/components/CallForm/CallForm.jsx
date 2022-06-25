import { BsChatDots } from "react-icons/bs";
import { useState, useEffect } from "react";
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
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import CallItems from "./CallItems/CallItems";
import { BiDotsVerticalRounded } from "react-icons/bi";

const CallForm = ({ calls, callee: { profilePhoto, fullname, phone } }) => {
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <CallFormContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
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
            {calls.map((call, i) => (
              <CallItems key={i} call={call} />
            ))}
          </CallFormGroupInfo>
        </CallFormContent>
      )}
    </CallFormContainer>
  );
};

export default CallForm;
