import styled from "styled-components";
export const ContactLists = styled.ul`
  width: 100%;
  height: 100vh;
  padding: 0.75rem;
  list-style-type: none;
  margin: 0;
  background-color: #2a2a2a;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ContactItems = styled.li`
  margin: 0.75rem 0;
  width: 100%;
  background: #2a2a2a;
  border-radius: 0.25rem;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    padding: 1rem 1.25rem;
    border: 1px solid #4b4b60;
    transition: all 0.3s ease;
    height: 82px;
    border-radius: 0.25rem;

    &.active {
      background: #665dfe;
      /* & > svg { */
      /*   color: #fff !important; */
      /* } */
    }
  }

  & a:hover {
    border-color: #665dfe;
  }

  & > p {
    width: 100%;
    margin: 0;
    color: #adb5bd;
    font-size: 80%;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  @media screen and (max-width: 1200px) {
    & a {
      display: none;
    }
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
    object-fit: cover;
  }
  &:before {
    content: "";
    background-color: #44a675;
    position: absolute;
    display: ${({ type, status }) =>
      type !== "Friends" ? (status ? "block" : "none") : "none"};
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    border: 3px solid #fff;
    z-index: 1;
  }
`;
export const ContactContents = styled.div`
  color: white;
  width: 100%;
  padding-left: 0.875rem;
  transition: all 0.4s;
  overflow: hidden;
`;
export const ContactInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 195px;
  min-height: 24px;
  margin-bottom: 0.375px;
  h6 {
    margin: 0 auto 0 0;
    font-size: 1rem;
  }
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div {
    color: #adb5bd;
    font-size: 0.875rem;

    /* Skeleton */
    /* span { */
    /*   position: relative; */
    /*   right: 0; */
    /*   top: 0; */
    /* } */
  }
`;
export const ContactTexts = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
  }
  p {
    margin: 0;
  }
  p.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    & .missed-call {
      color: #ff337c !important;
    }
    & .active {
      color: #fff;
    }
    & .inactive {
      color: #f8f9fa;
    }
  }
`;

export const ContactBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* & svg { */
  color: #f8f9fa;
  height: 20px;
  width: 20px;
  &.active {
    color: #fff;
  }
  /* } */
`;
