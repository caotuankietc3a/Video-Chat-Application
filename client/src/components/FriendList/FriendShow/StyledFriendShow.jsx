import styled from "styled-components";

export const FriendColBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #2b2b2f;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  & h6,
  & p {
    margin: 0;
    line-height: 1.2;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & h6 {
    margin-bottom: ${({ type }) =>
      type === "forward-message" ? "0.25rem" : "0px"};
    font-weight: 700;
  }

  & p {
    color: #f8f9fa;
    margin-top: 0.25rem;
    font-weight: 500;
  }
  &.forward-message:hover {
    background-color: #665dfe;
  }
`;

export const AvatarUser = styled.div`
  width: 48px;
  height: 48px;
  position: relative;
  z-index: 1;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  &:before {
    content: "";
    background-color: #44a675;
    position: absolute;
    /* display: ${({ type }) => (type !== "Friends" ? "block" : "none")}; */
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    border: 3px solid #fff;
    z-index: 1;
  }
`;

export const FriendName = styled.div`
  color: white;
  width: 100%;
  padding-left: 0.875rem;
  transition: all 0.4s;
  overflow: hidden;
  & .sendBtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SendBtn = styled.div`
  padding: 0 12px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d88ff33;
  border-radius: 0.5rem;
  &.un-send {
    background-color: #14141450;
    cursor: not-allowed;
    div,
    button {
      cursor: not-allowed;
      color: #ffffff4d;
    }
  }
  & div,
  & button {
    font-size: 0.9375rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    color: #2d88ff;
  }
  & button {
    line-height: 1.5;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }
  & div svg {
    height: 16px;
    width: 16px;
    margin-right: 10px;
  }
  &:hover {
    background-color: #14141450;
  }
  &:not(.un-send):active {
    transform: scale(0.95);
  }
`;
