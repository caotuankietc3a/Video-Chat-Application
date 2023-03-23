import { useEffect } from "react";
import { formatDate } from "../../store/actions/common-function";
import { fetchUserLogin } from "../../store/actions/fetch-action";
import {
  SideBarHeader,
  ProfileContainer,
  ProfileContent,
  ProfileBody,
  ProfileDetail,
  ProfileAvatar,
  ProfileInfo_Btn,
  ProfileOptions,
  ListGroupInfo,
  ListGroupInfoItem,
} from "./StyledProfile";
import { BiDotsVerticalRounded, BiLogOut } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { FiPhone, FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import { IoEarthOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineHome,
} from "react-icons/ai";
import { logoutHandler } from "../../store/actions/fetch-action.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  useEffect(() => {
    fetchUserLogin(navigate, 1);
  }, [userState.user]);
  return (
    <ProfileContainer>
      <SideBarHeader>
        <h5>Profile</h5>
        <p>Personal Information & Settings</p>
      </SideBarHeader>
      <ProfileContent>
        <ProfileBody>
          <ProfileAvatar>
            <img src={userState?.user?.profilePhoto.url} alt="User" />
          </ProfileAvatar>
          <ProfileDetail>
            <h5>{userState?.user?.fullname}</h5>
            <ProfileInfo_Btn
              onClick={() => {
                dispatch(logoutHandler(navigate));
              }}
            >
              <div className="log-out">
                <BiLogOut />
                <span>Log Out</span>
              </div>
            </ProfileInfo_Btn>
          </ProfileDetail>
          <ProfileOptions>
            <BiDotsVerticalRounded />
          </ProfileOptions>
        </ProfileBody>
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
              <p>{userState?.user?.birthdate}</p>
            </div>
            <AiOutlineCalendar></AiOutlineCalendar>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Phone</p>
              <p>{userState?.user?.phone}</p>
            </div>
            <FiPhone></FiPhone>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Email</p>
              <p>{userState?.user?.email}</p>
            </div>
            <AiOutlineMail></AiOutlineMail>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Website</p>
              <p>{userState?.user?.website}</p>
            </div>
            <IoEarthOutline></IoEarthOutline>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Address</p>
              <p>{userState?.user?.address}</p>
            </div>
            <AiOutlineHome></AiOutlineHome>
          </ListGroupInfoItem>
        </ListGroupInfo>

        <ListGroupInfo>
          <ListGroupInfoItem>
            <div>
              <p className="small">Facebook</p>
              <a href={userState?.user?.facebook} target="_blank">
                https://www.{userState?.user?.fullname}.facebook.com
              </a>
            </div>
            <FiFacebook></FiFacebook>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Instagram</p>
              <a href={userState?.user?.instagram} target="_blank">
                https://www.{userState?.user?.fullname}.instagram.com
              </a>
            </div>
            <FiInstagram></FiInstagram>
          </ListGroupInfoItem>
          <ListGroupInfoItem>
            <div>
              <p className="small">Twitter</p>
              <a href={userState?.user?.twitter} target="_blank">
                https://www.{userState?.user?.fullname}.twitter.com
              </a>
            </div>
            <FiTwitter></FiTwitter>
          </ListGroupInfoItem>
        </ListGroupInfo>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
