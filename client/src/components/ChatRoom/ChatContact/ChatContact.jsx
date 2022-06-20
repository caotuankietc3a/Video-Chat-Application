import { useState, useRef, useEffect } from "react";
import {
  ChatContactContainer,
  SideBarHeader,
  LiTag,
  UlBarHeader,
  SideBarSubHeader,
  SideBarHeaderContent,
  DropDownChats,
  SearchUserChats,
  DropDownMenu,
  DropDownItem,
} from "./StyledChatContact";
import ChatContactLists from "./ChatContactLists";
import { BsBell, BsSearch } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
const ChatContact = ({ header, isClickedHandler, createGroupHandler }) => {
  const [searchContactItems, setSearchContactItems] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const menuShowHandler = (e) => {
    setShowMenu(true);
  };

  useEffect(() => {
    const checkIsClickOutside = (e) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", checkIsClickOutside);
    return () => {
      document.removeEventListener("click", checkIsClickOutside);
    };
  }, [showMenu]);

  return (
    <ChatContactContainer>
      <SideBarHeader>
        <SideBarHeaderContent>
          <h3>{header}</h3>
          <UlBarHeader>
            <div>
              <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
                <BsBell />
              </LiTag>
            </div>
            <div onClick={menuShowHandler}>
              <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
                <BiDotsVerticalRounded />

                {showMenu && (
                  <DropDownMenu>
                    <DropDownItem onClick={isClickedHandler}>
                      <span>New Chat</span>
                    </DropDownItem>
                    <DropDownItem onClick={createGroupHandler}>
                      <span>Create Group</span>
                    </DropDownItem>
                    <DropDownItem>
                      <span>Invite Others</span>
                    </DropDownItem>
                  </DropDownMenu>
                )}
              </LiTag>
            </div>
          </UlBarHeader>
        </SideBarHeaderContent>
        <SideBarSubHeader>
          {header !== "Friends" && (
            <DropDownChats>
              <button type="button">All {header}</button>
            </DropDownChats>
          )}
          <SearchUserChats header={header}>
            <input
              type="text"
              placeholder={
                header === "Chats" || header === "Calls"
                  ? "Search users..."
                  : "Search friends..."
              }
              onChange={(e) => {
                setSearchContactItems(e.target.value);
              }}
            />
            <div>
              <BsSearch />
            </div>
          </SearchUserChats>
        </SideBarSubHeader>
      </SideBarHeader>

      <ChatContactLists type={header} searchContactItems={searchContactItems} />
    </ChatContactContainer>
  );
};

export default ChatContact;
