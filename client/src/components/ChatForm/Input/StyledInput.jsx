import styled from "styled-components";
export const ChatFooter = styled.form`
  display: flex;
  width: 100%;
  z-index: 10;
  height: 5rem;
  padding: 0.75rem 1.25rem;
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

  @media screen and (max-width: 1200px) {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  & div.enter-text {
    width: 100%;
    min-height: 35px;
    input {
      width: 100%;
      padding: 6px 12px;
      background-color: #2a2a2a;
      border: 0;
      font-size: 1.15rem;
      color: white;
      &:focus {
        outline: none;
      }
    }
  }
  & div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.75rem;
    position: relative;
    & > div {
      position: absolute;
      bottom: 30px;
      right: 0;
    }
    &:hover {
      svg {
        color: #5d646b;
        cursor: pointer;
      }
    }
  }
  & div.images,
  & div.attachment {
    & svg {
      font-size: 1.2rem;
    }
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
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
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

export const FilesContainer = styled(ReplyMessageContainer)`
  padding-top: 0;
  padding-bottom: 0;
  min-height: 100px;
`;

export const FilesContent = styled(ReplyMessageContent)`
  justify-content: flex-start;
`;

export const FilesInfo = styled(ReplyMessageInfo)`
  flex-direction: row;
  justify-content: flex-start;
  width: auto;
  height: 100%;
`;

export const Files = styled.div`
  height: 68px;
  width: 68px;
  position: relative;
  background-color: red;
  border-radius: 10px;
  /* z-index: 1000; */
  margin-right: 15px;
  & img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

export const Attachments = styled.div`
  position: relative;
  height: 68px;
  width: 208px;
  border-radius: 10px;
  background-color: #383f44;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  & div.attachments-content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    & div.attachments-btn {
      background-color: #242526;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-right: 7px;
      margin-left: 10px;
      width: 32px;
      height: 32px;
      min-width: 32px;
      min-height: 32px;
      svg {
        font-size: 1.205rem;
      }
    }
    & div.attachments-info {
      width: 90%;
      position: relative;
      line-height: 1em;
      max-height: 3em;
      justify-self: flex-start;
      text-overflow: ellipsis;
      overflow: hidden;
      word-wrap: break-word;
      padding-right: auto;
      margin-right: 5px;
      font-weight: 300;
      font-size: 0.9rem;
      color: #b0b3b8;
    }
  }
`;

export const FilesBtn = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #3e4042;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  & svg {
    color: #b0b3b8;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #8a8d91;
    }
  }
`;
export const AnotherFilesBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  min-width: 48px;
  cursor: pointer;
  border-radius: 10px;
  & svg {
    color: #b0b3b8;
    width: 24px;
    height: 24px;
  }
  &:hover {
    background-color: #8a8d91;
    & svg {
      color: #fff;
    }
  }
  background-color: rgba(134, 142, 153, 0.25);
`;
