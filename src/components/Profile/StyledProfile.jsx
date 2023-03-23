import styled from "styled-components";

export const SideBarHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background: #383f44;
  border-bottom: 1px solid #2b2b2f;
  padding: 0.75rem;
  /* margin-bottom: 1.5rem; */
  p,
  h5 {
    align-self: flex-start;
    padding: 0;
    margin: 0;
  }
  h5 {
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  p {
    color: #f8f9fa;
    font-size: 0.875rem;
  }
`;

export const ProfileContainer = styled.main`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #2a2a2a;
  overflow: hidden;
`;

export const ProfileContent = styled.div`
  height: 100%;
  width: 100%;
  padding: 15px 15px 0 15px;
  margin: 0 auto;
  max-width: 1320px;
  // important
  max-height: 88vh;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ProfileBody = styled.div`
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

export const ProfileAvatar = styled.div`
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

export const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  h5 {
    color: #fff;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
  }
`;
export const ProfileInfo_Btn = styled.div`
  margin-top: 0.75rem;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 2.5rem;
    width: 7rem;
    border: 1px solid transparent;
    margin: 0 0.75rem;
    border-radius: 4px;
    color: #fff;
    transition: all 0.15s ease-in-out;
    color: #adb5bd;
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
    span {
      margin: 0 0.5rem;
    }
    &.log-out {
      border-color: #2a2a2a;
      background-color: #2a2a2a;
      font-size: 0.875rem;
    }
    &:hover {
      &.log-out {
        background-color: #495057;
        /* border-color: #35825c; */
      }
    }
  }
`;

export const ProfileOptions = styled.div`
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
