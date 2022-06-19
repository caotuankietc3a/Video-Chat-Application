import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #00000050;

  z-index: 1000;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  border-radius: 0.3rem;
  background-color: #383f44;
  border-color: #2b2b2f;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom-width: 0;
`;

export const Header = styled.div`
  border-color: #2b2b2f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #2b2b2f;
  border-radius: 4px 0 0 4px;
  width: 100%;
  height: 100%;
  & h5 {
    margin-top: 0;
    margin-bottom: 12px;
    font-weight: 700;
    line-height: 1.2;
    font-size: 1.25rem;
    color: #fff;
  }
  & .btn-close {
    cursor: pointer;
    padding: 0.5rem 0 0.5rem 0.5rem;
    color: #00000090;
    & svg {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
      height: 25px;
      width: 25px;
      &:hover {
        color: #000000;
      }
    }
  }
`;

export const Body = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
`;

export const GroupName = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 0.75rem;
  & input {
    background-color: #2a2a2a;
    width: 100%;
    height: 90%;
    padding: 0.75rem;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4;
    color: #495057;
    border: 1px solid #2a2a2a;
    border-radius: 0.25rem;
    outline: none;
    &::placeholder {
      color: #adb5bd;
    }

    &:focus {
      color: #fff;
    }
  }
  & > div {
    width: 100%;
    & > label.label {
      position: relative;
      bottom: 9px;
    }
  }

  & div.custom-file {
    position: relative;
    width: 100%;
    height: 44px;
    & label.choose-file {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 0.25rem;
      background-color: #2a2a2a;
      cursor: pointer;
      width: 100%;
      height: 100%;
      padding: 0.75rem;
      &::after {
        content: "Browser";
        background-color: #383f44;
        color: #fff;
        border-radius: 0 0.25rem 0.25rem 0;
        position: absolute;
        top: 2px;
        line-height: 1.5;
        display: block;
        right: 2px;
        height: 90%;
        padding: 0.375rem 0.75rem;
        display: flex;
        align-items: center;
      }
    }
  }
  /* & input#upload-file { */
  /*   height: 0; */
  /*   padding: 0; */
  /*   border: 0; */
  /* } */
  & label {
    color: #fff;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  border-bottom: 1px solid #2b2b2f;

  input {
    background-color: #2a2a2a;
    border-color: #2a2a2a;
    width: 100%;
    height: 90%;
    padding: 0.75rem;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4;
    color: #495057;
    border: 1px solid transparent;
    border-radius: 0.25rem 0 0 0.25rem;
    outline: none;
    &:focus {
      color: #fff;
    }
    &::placeholder {
      color: #adb5bd;
    }
  }
  div {
    width: 45px;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #2a2a2a;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  svg {
    width: 20px;
    height: 20px;
    color: #adb5bd;
  }
`;

export const FriendCol = styled.ul`
  flex: 1;
  flex-direction: column;
  list-style-type: none;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  max-height: 19rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-top: 1px solid #2a2a2a;
  width: 100%;
  height: 70px;
  & button {
    font-size: 0.875rem;
    color: #adb5bd;
    border-radius: 0.25rem;
    line-height: 1.5;
    padding: 0.4375rem 1.25rem;
    outline: none;
    cursor: pointer;
  }
  & button.cancel {
    background-color: transparent;
    text-decoration: underline;
    border: 1px solid transparent;
  }
  & button.create-group {
    background-color: #44a675;
    cursor: pointer;
    border: 1px solid #44a675;
    color: #fff;
    &:hover {
      background-color: #398b62;
    }
  }
`;
