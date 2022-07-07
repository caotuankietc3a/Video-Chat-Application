import styled from "styled-components";

export const FriendFormContainer = styled.main`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  width: 100%;
  background-color: #323232;
`;

export const FriendFormContent = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  max-width: 1320px;
  // max-height: 55rem;
  // important
  max-height: 90vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FriendFormBody = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #383f44;
  border: 1px solid #2b2b2f;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background-image: url("/images/friend-img.svg");
`;

export const FriendFormAvatar = styled.div`
  margin-bottom: 1rem;
  min-width: 5rem;
  min-height: 5rem;
  border-radius: 50%;
  img {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const FriendFormDetail = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  h5 {
    color: #fff;
    margin-bottom: 0.375rem;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
  }
`;
export const FriendFormInfo_Btn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
  div {
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    padding: 0;
    text-align: center;
    border: 1px solid transparent;
    margin: 0 0.75rem;
    border-radius: 50%;
    color: #fff;
    transition: all 0.15s ease-in-out;
    svg {
      margin-top: 0.65rem;
      width: 1.5rem;
      height: 1.5rem;
    }
    &.chat {
      color: #fff;
      background-color: #665dfe;
      border-color: #665dfe;
    }
    &.phone {
      color: #fff;
      background-color: #44a675;
      border-color: #44a675;
    }
    &:hover {
      &.phone {
        background-color: #398b62;
        border-color: #35825c;
      }
      &.chat {
        background-color: #4237fe;
        border-color: #362afe;
      }
    }
  }
`;

export const FriendFormOptions = styled.div`
  display: block;
  position: absolute;
  inset: 1rem 1rem auto auto;
  cursor: pointer;
  &:hover {
    svg {
      color: #5d646b;
    }
  }
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #adb5bd;
  }
`;

export const ListGroupInfo = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 0;
  background-color: #383f44;
  & li {
    border-bottom: 0;
    &:last-child {
      border-bottom: 1px solid #2b2b2f;
    }
  }
`;
export const ListGroupInfoItem = styled.li`
  list-style: none;
  padding: 0.75rem 1.25rem;
  border: 1px solid #2b2b2f;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    width: 100%;
    p.small {
      font-size: 0.75rem;
    }
    p {
      color: #f8f9fa;
      margin: 0;
    }
    a {
      color: #665dfe;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      &:hover {
        color: #1e11fe;
      }
    }
  }
  svg {
    height: 1.25rem;
    width: 1.25rem;
    color: #adb5bd;
  }
`;
