import { NavBar, UlNav, LiTag } from "./StyledNavBarContact";
import { RiMessengerLine } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";
import {
  initialNavBar,
  reducerNavBar,
} from "../../store/actions/navbar-function";
import { useReducer } from "react";
const NavBarContact = (props) => {
  const [stateNavBar, dispatchNavBar] = useReducer(
    reducerNavBar,
    initialNavBar
  );
  return (
    <NavBar>
      <a href="">
        <RiMessengerLine />
      </a>
      <UlNav>
        <Link
          to="/home-chat/"
          className={stateNavBar.home_chat}
          onClick={() => {
            dispatchNavBar({ type: "home_chat" });
          }}
        >
          <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
            <TiMessages />
          </LiTag>
        </Link>
        <Link
          to="/home-chat/calls/"
          className={stateNavBar.phone}
          onClick={() => {
            dispatchNavBar({ type: "phone" });
          }}
        >
          <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
            <BsTelephone />
          </LiTag>
        </Link>
        <Link
          to="/home-chat/friends"
          className={stateNavBar.friend}
          onClick={() => {
            dispatchNavBar({ type: "friend" });
          }}
        >
          <LiTag
            ptd="24px"
            plr="0px"
            w="1.5rem"
            h="1.5rem"
            className={stateNavBar.home_chat}
          >
            <HiOutlineUsers />
          </LiTag>
        </Link>
        <Link
          to="/home-chat/profile"
          className={stateNavBar.info}
          onClick={() => {
            dispatchNavBar({ type: "info" });
          }}
        >
          <LiTag ptd="24px" plr="0px" w="1.5rem" h="1.5rem">
            <BiUserCircle />
          </LiTag>
        </Link>
      </UlNav>
    </NavBar>
  );
};

export default NavBarContact;
