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
  & a {
    position: relative;
  }
`;

export const DropDownMenu = styled.div`
  position: absolute;
  top: 20px;
  right: 14px;
  margin: 0;
  width: 13rem;
  transform: translate(0px, 22.2222px);
  background-color: #2b2b2b;
  padding: 0.5rem 0;
  min-width: 10rem;
  text-align: left;
  list-style: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  display: block;
  z-index: 100;
  &:hover {
    & a svg {
      color: #5d646b;
    }
  }
  & a:last-child {
    svg {
      color: #ff337c;
    }
    span {
      color: #ff337c;
    }
  }
`;

export const DropDownItem = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.25rem 1.25rem;
  font-weight: 400;
  font-size: 1rem;
  color: rgba(197, 201, 223, 0.8);
  white-space: nowrap;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #383f44;
  }
  svg {
    margin-right: 0.75rem;
    height: 1.05rem;
    width: 1.05rem;
  }
`;
