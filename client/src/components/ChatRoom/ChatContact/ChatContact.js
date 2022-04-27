import {ChatContactContainer, SideBarHeader, LiTag, UlBarHeader, SideBarSubHeader, SideBarHeaderContent, DropDownChats, SearchUserChats, ChatBodyContainer} from "./StyledChatContact";
import ChatContactLists from './ChatContactLists';
import {BsBell, BsSearch} from 'react-icons/bs';
import {BiDotsVerticalRounded} from 'react-icons/bi';
const ChatContact = (props) => {

   return (
      <ChatContactContainer>
         <SideBarHeader>
            <SideBarHeaderContent>
               <h3>{props.header}</h3>
               <UlBarHeader>
                  <a href=""><LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem"><BsBell /></LiTag></a>
                  <a href=""><LiTag ptd="8px" plr="6px" w="1.25rem" h="1.25rem"><BiDotsVerticalRounded /></LiTag></a>
               </UlBarHeader>
            </SideBarHeaderContent>
            <SideBarSubHeader>
               {
                  props.header !== "Friends" && <DropDownChats>
                     <button type="button">All Chats</button>
                  </DropDownChats>
               }
               <SearchUserChats header={props.header}>
                  <input type="text" placeholder={props.header === "Chats" ? "Search users..." : "Search friends..."} />
                  <div>
                     <BsSearch />
                  </div>
               </SearchUserChats>
            </SideBarSubHeader>
         </SideBarHeader>
         <ChatContactLists type={props.header} />
      </ChatContactContainer>
   );
}

export default ChatContact;
