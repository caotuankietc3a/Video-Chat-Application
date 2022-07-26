import React, { useEffect, useState } from "react";
import {
  FriendFormContainer,
  FriendFormContent,
  FriendFormBody,
  FriendFormDetail,
  FriendFormAvatar,
  FriendFormInfo_Btn,
  FriendFormOptions,
  ListGroupInfo,
  ListGroupInfoItem,
} from "./StyledFriendForm";
import { BsChatDots } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import {
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineHome,
} from "react-icons/ai";
import { FiPhone, FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { IoEarthOutline } from "react-icons/io5";
import { formatDate } from "../../store/actions/common-function";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import { postNewConversation } from "../../store/actions/conversation-function";
import { friendActions } from "../../store/slices/friend-slice";
const FriendForm = ({ friendDetail }) => {
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const { friendId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isFetching, setIsFetching] = useState(true);

  const clickChatHandler = () => {
    dispatch(postNewConversation(user, friendDetail, navigate));
  };

  const clickPhoneHandler = async () => {
    dispatch(postNewConversation(user, friendDetail, navigate, true));
  };

  useEffect(() => {
    try {
      setIsFetching(true);
      (async () => {
        const res = await fetch(
          `${END_POINT_SERVER}/friend/detail/` + friendId
        );
        const { friend } = await res.json();
        dispatch(friendActions.setFriend({ friend: friend }));
        setIsFetching(false);
      })();
    } catch (err) {
      setIsFetching(false);
      console.error(err);
    }
  }, [friendId]);

  return (
    <FriendFormContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <FriendFormContent>
          <FriendFormBody>
            <FriendFormAvatar>
              <img src={friendDetail?.profilePhoto?.url} alt="" />
            </FriendFormAvatar>
            <FriendFormDetail>
              <h5>{friendDetail?.fullname}</h5>
              <FriendFormInfo_Btn>
                <div className="chat" onClick={clickChatHandler}>
                  <BsChatDots />
                </div>
                <div className="phone" onClick={clickPhoneHandler}>
                  <FiPhone />
                </div>
              </FriendFormInfo_Btn>
            </FriendFormDetail>
            <FriendFormOptions>
              <BiDotsVerticalRounded />
            </FriendFormOptions>
          </FriendFormBody>
          <ListGroupInfo>
            <ListGroupInfoItem>
              <div>
                <p className="small">Local Time</p>
                <p>{formatDate(new Date(Date.now()))}</p>
              </div>
              <MdAccessTime></MdAccessTime>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Birthdate</p>
                <p>{friendDetail?.birthdate}</p>
              </div>
              <AiOutlineCalendar></AiOutlineCalendar>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Phone</p>
                <p>{friendDetail?.phone}</p>
              </div>
              <FiPhone></FiPhone>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Email</p>
                <p>{friendDetail?.email}</p>
              </div>
              <AiOutlineMail></AiOutlineMail>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Website</p>
                <p>{friendDetail?.website}</p>
              </div>
              <IoEarthOutline></IoEarthOutline>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Address</p>
                <p>{friendDetail?.address}</p>
              </div>
              <AiOutlineHome></AiOutlineHome>
            </ListGroupInfoItem>
          </ListGroupInfo>

          <ListGroupInfo>
            <ListGroupInfoItem>
              <div>
                <p className="small">Facebook</p>
                <a href={friendDetail?.facebook} target="_blank">
                  https://www.{friendDetail?.fullname}.facebook.com
                </a>
              </div>
              <FiFacebook></FiFacebook>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Instagram</p>
                <a href={friendDetail?.instagram} target="_blank">
                  https://www.{friendDetail?.fullname}.instagram.com
                </a>
              </div>
              <FiInstagram></FiInstagram>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Twitter</p>
                <a href={friendDetail?.twitter} target="_blank">
                  https://www.{friendDetail?.fullname}.twitter.com
                </a>
              </div>
              <FiTwitter></FiTwitter>
            </ListGroupInfoItem>
          </ListGroupInfo>
        </FriendFormContent>
      )}
    </FriendFormContainer>
  );
};

export default FriendForm;
