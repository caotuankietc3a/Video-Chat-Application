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

const CallForm = ({ calls, callee }) => {
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    setIsFetching(false);
  }, []);
  return (
    <CallFormContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <CallFormContent>
          <CallFormBody>
            <CallFormAvatar>
              <img src={callee?.profilePhoto.url} alt="" />
            </CallFormAvatar>
            <CallFormDetail>
              <h5>{callee?.fullname}</h5>
              <CallFormInfo_Btn>
                <div className="chat">{callee?.phone}</div>
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
