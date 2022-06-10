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
  ChatBodyContainer,
} from "./StyledChatContact";
import ChatContactLists from "./ChatContactLists";
import { BsBell, BsSearch } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
const ChatContact = ({ header }) => {
  const [searchContactItems, setSearchContactItems] = useState("");
  return (
    <ChatContactContainer>
      <SideBarHeader>
        <SideBarHeaderContent>
          <h3>{header}</h3>
          <UlBarHeader>
            <a href="">
              <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
                <BsBell />
              </LiTag>
            </a>
            <a href="">
              <LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem">
                <BiDotsVerticalRounded />
              </LiTag>
            </a>
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
