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
import { useNavigate } from "react-router-dom";
import TikTokSpinner from "../UI/TikTokSpinner/TikTokSpinner";
import { postNewConversation } from "../../store/actions/conversation-function";
const FriendForm = (props) => {
  const { profilePhoto, fullname, birthdate, phone, email, website, address } =
    props.friendDetail;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { conversation } = useSelector((state) => state.conversation);
  console.log(conversation);
  const [isFetching, setIsFetching] = useState(true);

  const clickChatHandler = () => {
    dispatch(postNewConversation(user, props.friendDetail, navigate));
  };

  const clickPhoneHandler = async () => {
    dispatch(postNewConversation(user, props.friendDetail, navigate, true));
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsFetching(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <FriendFormContainer>
      {isFetching ? (
        <TikTokSpinner />
      ) : (
        <FriendFormContent>
          <FriendFormBody>
            <FriendFormAvatar>
              <img src={profilePhoto} alt="" />
            </FriendFormAvatar>
            <FriendFormDetail>
              <h5>{fullname}</h5>
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
                <p>{birthdate}</p>
              </div>
              <AiOutlineCalendar></AiOutlineCalendar>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Phone</p>
                <p>{phone}</p>
              </div>
              <FiPhone></FiPhone>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Email</p>
                <p>{email}</p>
              </div>
              <AiOutlineMail></AiOutlineMail>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Website</p>
                <p>{website}</p>
              </div>
              <IoEarthOutline></IoEarthOutline>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Address</p>
                <p>{address}</p>
              </div>
              <AiOutlineHome></AiOutlineHome>
            </ListGroupInfoItem>
          </ListGroupInfo>

          <ListGroupInfo>
            <ListGroupInfoItem>
              <div>
                <p className="small">Facebook</p>
                <a
                  href="https://www.facebook.com/kiet.cao.7587370/"
                  target="_blank"
                >
                  https://www.kietcao.facebook.com
                </a>
              </div>
              <FiFacebook></FiFacebook>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Instagram</p>
                <a
                  href="https://www.facebook.com/kiet.cao.7587370/"
                  target="_blank"
                >
                  https://www.kietcao.instagram.com
                </a>
              </div>
              <FiInstagram></FiInstagram>
            </ListGroupInfoItem>
            <ListGroupInfoItem>
              <div>
                <p className="small">Twitter</p>
                <a
                  href="https://www.facebook.com/kiet.cao.7587370/"
                  target="_blank"
                >
                  https://www.kietcao.twitter.com
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
