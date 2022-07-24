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
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { callActions } from "../../store/slices/call-slice.jsx";

const CallForm = ({ calls, callee, id }) => {
  const [searchParams] = useSearchParams();
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const userId = searchParams.get("userId");
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const res = await fetch(
        `${END_POINT_SERVER}/meeting/detail/${id}?userId=${userId}`
      );
      // const { calls_detail, callee } = await res.json();
      const { calls_detail, callee, status } = await res.json();
      if (status === "error") {
        navigate("/home-chat/calls");
      } else if (status == "success") {
        dispatch(callActions.setCalls({ calls: calls_detail }));
        dispatch(
          callActions.setMeeting({ meeting: { meetingId: id, callee } })
        );
      }
      setIsFetching(false);
    })();
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
