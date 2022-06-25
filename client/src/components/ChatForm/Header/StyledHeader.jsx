import styled from "styled-components";
import { ContactInfo } from "../../ChatRoom/ChatContact/StyledContacts";
import { UlBarHeader } from "../../ChatRoom/ChatContact/StyledChatContact";
export const ChatHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #343a40;
  color: #666;
  padding: 0.75rem 2.25rem;
  background-color: #323333;
  height: 5rem;
`;

export const ChatHeaderAvatar = styled.header`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const Media = styled(ContactInfo)`
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;
  h6 {
    color: #fff;
  }
  small {
    text-align: left;
    font-weight: 400;
    font-size: 80%;
    color: #adb5bd;
    margin: 0 auto 0 0;
  }
`;

export const UlChatHeaderOptions = styled(UlBarHeader)`
  width: 96px;
  li {
    margin-left: 6px;
  }
  & a svg:hover {
    color: #5d646b;
  }
`;
