import styled from "styled-components";
export const ContactLists = styled.ul`
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  list-style: none;
  margin: 0;
  background-color: #2a2a2a;
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
`;
export const AvatarUser = styled.div`
  width: 48px;
  height: 48px;
  position: relative;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  &:before {
    content: "";
    background-color: #44a675;
    position: absolute;
    display: ${(props) => (props.type !== "Friends" ? "block" : "none")};
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
  }
`;
