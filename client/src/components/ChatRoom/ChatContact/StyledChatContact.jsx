import styled from "styled-components";
export const LiTag = styled.li`
  list-style: none;
  padding: ${(props) => props.ptd} ${(props) => props.plr};
  height: 100%;
  position: relative;
  cursor: pointer;
  svg {
    width: ${(props) => props.w};
    height: ${(props) => props.h};
    margin-top: 1.8px;
  }
  @media screen and (max-width: 1200px) {
    z-index: -1;
  }
`;

export const SideBarHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #383f44;
  padding: 12px;
`;

export const SideBarHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  h3 {
    margin: 0;
    color: #ffffff;
    font-weight: bold;
  }
`;

export const UlBarHeader = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding-left: 0;
  height: 40px;
  width: 58px;
  svg {
    color: #adb5bd;
  }
  & div:hover {
    svg {
      color: #5d646b;
    }
  }
`;

export const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0px auto auto 0px;
  transform: translate(-140px, 35px);
  font-size: 0.875rem;
  background-color: #2b2b2b;
  padding: 0.5rem 0;
  min-width: 11rem;
  text-align: center;
  list-style: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
`;

export const DropDownItem = styled.a`
  width: 100%;
  font-weight: 400;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  color: rgba(197, 201, 223, 0.8);
  white-space: nowrap;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #383f44;
  }
`;

export const SideBarSubHeader = styled(SideBarHeaderContent)`
  padding: 0.25rem 0;
  height: 44px;
`;

export const DropDownChats = styled.div`
  height: 100%;
  width: 30%;
  text-align: left;
  button {
    border-color: #2a2a2a;
    background: #2a2a2a;
    color: #adb5bd;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    padding: 7px 15px;
    font-size: 0.875rem;
    height: 100%;
    &:after {
      display: inline-block;
      margin-left: 0.255em;
      vertical-align: 0.255em;
      content: "";
      border-top: 0.3em solid;
      border-right: 0.3em solid transparent;
      border-bottom: 0;
      border-left: 0.3em solid transparent;
    }
  }
`;

export const SearchUserChats = styled(SideBarHeaderContent)`
  display: flex;
  width: ${(props) => (props.header !== "Friends" ? "70%" : "100%")};
  input {
    background-color: #2a2a2a;
    border-color: #2a2a2a;
    width: 100%;
    height: 90%;
    padding: 0.375rem 0.75rem;
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
    height: 90%;
    width: 45px;
    padding: 0rem 0.75rem;
    border-radius: 0 6px 6px 0;
    background-color: #2a2a2a;
    cursor: pointer;
  }
  svg {
    width: 20px;
    height: 20px;
    margin-top: 40%;
    color: #adb5bd;
  }
`;

export const ChatContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;
