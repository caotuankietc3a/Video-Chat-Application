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
`;

export const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  list-style-type: none;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
`;
