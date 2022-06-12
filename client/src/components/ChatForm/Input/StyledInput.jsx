import styled from "styled-components";
export const ChatFooter = styled.form`
  display: flex;
  position: fixed;
  bottom: 0;
  width: calc(100% - 69px - 419px);
  height: 5rem;
  padding: 0.75rem 2.25rem;
  background-color: #323333;
  border-top: 1px solid #343a40;
  button {
    width: 5rem;
    cursor: pointer;
    border-style: none;
    height: 100%;
    padding: 0.1rem;
    margin-left: 0.5rem;
    background-color: #665dfe;
    border-radius: 4px;
    &:hover {
      background-color: #4237fe;
    }
    &:active {
      transform: scale(0.965);
    }
  }

  svg {
    font-size: 1.5rem;
    color: white;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  input {
    width: 100%;
    padding: 6px 12px;
    background-color: #2a2a2a;
    border: 0;
    font-size: 0.875rem;
    color: white;
    &:focus {
      outline: none;
    }
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.75rem;
  }
`;

export const ReplyMessageContainer = styled.div`
  padding: 10px 15px 3px 15px;
  display: flex;
  position: fixed;
  right: 0;
  bottom: 5rem;
  width: calc(100% - 69px - 419px);
  height: 5rem;
  padding: 0.75rem 2.25rem;
  background-color: #323333;
  border-top: 1px solid #343a40;
`;

export const ReplyMessageContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 2.25rem;
  justify-content: center;
  width: 100%;
  overflow: hidden;
`;
export const ReplyMessageInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
  width: 100%;
`;
export const ReplyMessageHeader = styled.div`
  margin: 5px 0;
  align-self: flex-start;
  color: #fff;
  font-size: 18px;
`;
export const ReplyMessageText = styled.div`
  align-self: flex-start;
  color: #b0b3b8;
  max-width: 100%;
  width: 100%;
  & .text {
    color: #b9b9b9;
    display: inline-block;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
export const ReplyMessageBtn = styled.div`
  position: relative;
  height: 100%;
  cursor: pointer;
  & svg {
    position: absolute;
    top: -15px;
    color: #e4e6ed;
    border-radius: 50%;
    width: 35px;
    height: 35px;
  }
  & svg:hover {
    color: #b0b3b8;
  }
`;
