import styled from "styled-components";

export const CallFormContainer = styled.main`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background-color: #323232;
`;

export const CallFormContent = styled.div`
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

export const CallFormBody = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #383f44;
  border: 1px solid #2b2b2f;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background-image: url("/images/friend-img.svg");
`;

export const CallFormAvatar = styled.div`
  margin-bottom: 1rem;
  min-width: 5rem;
  min-height: 5rem;
  border-radius: 50%;
  img {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
  }
`;

export const CallFormDetail = styled.div`
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
export const CallFormInfo_Btn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
  div {
    cursor: pointer;
    padding: 0;
    text-align: center;
    border: 1px solid transparent;
    margin: 0 0.5rem;
    color: #fff;
    transition: all 0.15s ease-in-out;
    svg {
      margin-top: 0.65rem;
      width: 1.5rem;
      height: 1.5rem;
    }
    &.chat {
      color: #f8f9fa;
      background-color: #665dfe;
      width: 144px;
      height: 30px;
      border-color: #665dfe;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.875rem;
    }
    &:hover {
      &.chat {
        background-color: #4237fe;
        border-color: #362afe;
      }
    }
  }
`;

export const CallFormOptions = styled.div`
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

export const CallFormGroupInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 0;
  background-color: #383f44;
`;
