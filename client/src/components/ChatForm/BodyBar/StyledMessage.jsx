import styled from "styled-components";
export const MessageContainer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
`;

export const MessageDivider = styled.div`
  padding-bottom: 0.75rem;
  height: 34.5px;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  &:before {
    height: 26.5px;
    background-color: #424242;
    border-color: #2b2b2f;
    color: #b0b5b9;
    content: attr(data-label);
    display: inline-block;
    font-size: 0.6875rem;
    line-height: 1.8;
    padding: 0.125rem 0.5rem;
    border-radius: 0.1875rem;
    border: 1px solid transparent;
    font-weight: 500;
    letter-spacing: 0.0313rem;
  }
`;

export const MessageContent = styled.div`
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ type }) => (type === "right" ? "flex-end" : "flex-start")};
`;

export const Header = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  margin-bottom: ${({ isForwarded }) => (isForwarded ? "0rem" : "-0.5rem")};
  margin-top: 1.25rem;
  margin-left: ${({ type }) => (type === "left" ? "1.25rem" : "0")};
  margin-right: ${({ type }) => (type === "right" ? "1.25rem" : "0")};
  justify-content: ${({ type }) =>
    type === "right" ? "flex-end" : "flex-start"};
  & .text {
    font-size: 0.75rem;
    padding-left: 4px;
    line-height: ${({ isForwarded }) => (isForwarded ? "1" : "1.4")};
    color: #8a8d91;
  }
  & svg {
    height: 16px;
    width: 16px;
    color: #8a8d91;
  }
`;
export const Wrapper = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: ${({ type }) =>
    type === "right" ? "flex-end" : "flex-start"};
  margin-left: ${({ type }) => (type === "left" ? "1.25rem" : "0")};
  margin-right: ${({ type }) => (type === "right" ? "1.25rem" : "0")};
  & a {
    text-decoration: none;
  }

  & span {
    color: #adb5db;
    height: 100%;
    font-size: 0.875rem;
    padding: 1px;
  }

  & div.reply-wrapper {
    position: relative;
    bottom: -10px;
    right: -5px;
    height: auto;
    max-width: 40vw;
    background: #4e4f5030;
    padding: 1rem 2.25rem;
    margin-left: ${({ type }) => (type === "left" ? "1.25rem" : "0")};
    margin-right: ${({ type }) => (type === "right" ? "1.25rem" : "0")};
    border-radius: 1.25rem;
    color: #adb5db;
    overflow-wrap: break-word;
  }
`;

export const MessageWrapper = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  z-index: 1;
  justify-content: ${({ type }) =>
    type === "right" ? "flex-end" : "flex-start"};
  & > div {
    background-color: ${({ type }) =>
      type === "left" ? "#383f44" : "#665DFE"};
    color: ${({ type }) => (type === "left" ? "#b9b9b9" : "#FFFFFF")};
    padding: 1rem 2.25rem;
    margin-left: ${({ type }) => (type === "left" ? "1.25rem" : "0")};
    margin-right: ${({ type }) => (type === "right" ? "1.25rem" : "0")};
    border-radius: 1.25rem;
    text-align: left;
    max-width: 25rem;
    display: inline-block;
    font-size: 0.875rem;
    overflow-wrap: break-word;
    h6 {
      margin-bottom: 0.5rem;
    }

    & > div.attachments {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 5px 0;

      & div.attachments-btn {
        /* cursor: pointer; */
        display: flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        width: 38px;
        min-width: 38px;
        transition: background-color 0.2s ease-in-out;
        background-color: ${({ type }) =>
          type === "right" ? "#383f44" : "#665DFE"};
        border-radius: 50%;
        margin-right: 10px;
        svg {
          color: #fff;
          font-size: 1.175rem;
        }
        &:hover {
          background-color: ${({ type }) =>
            type === "right" ? "#2a2a2a" : "#362afe"};
        }
      }

      & div.attachments-body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        overflow-wrap: none;
        width: 13.5rem;
        h6 {
          margin-bottom: 4px;
          width: 100%;
          a {
            text-decoration: none;
            color: #fff;
          }
          &:hover {
            text-decoration: underline;
          }
        }
        div.payload-file {
          width: 100%;
          color: ${({ type }) => (type === "left" ? "#b9b9b9" : "#FFFFFF90")};
          font-size: 0.675rem;
          line-height: 1;
        }
      }
    }
  }

  & h6 {
    color: #f8f9fa;
    font-size: 0.875rem;
    margin: 0;
    margin-bottom: 0.75rem;
    font-weight: 500;
    line-height: 1.2;
  }

  & > div .images-row {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    & div {
      text-align: center;
    }

    & .image-row {
      cursor: pointer;
      padding: 0 5px;
      max-width: 100%;
      & img {
        width: 118px;
        height: 108px;
        border-radius: 10px;
        object-fit: cover;
      }
    }
  }
`;

export const MessageOptions = styled.div`
  display: flex;
  flex-direction: ${({ type }) => (type === "right" ? "row-reverse" : "row")};
  align-items: center;
  justify-content: center;
  margin-top: 0.3125rem;
  font-size: 0.75rem;
  width: 13.5rem;
  height: 26px;
  span {
    line-height: 1.125rem;
    height: 1.125rem;
    margin: 0 0.3125rem;
    color: #adb5bd;
    width: 10rem;
  }
  & > div:first-child {
    background-color: #323333;
    border-radius: 50%;
    width: 80px;
    height: 60px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: ${({ type }) =>
      type === "right" ? "flex-end" : "center"};
    justify-content: center;
    &:before {
      display: none;
    }
    img {
      width: 36px;
      height: 36px;
    }
  }
`;

export const MessageOptionsDropDown = styled.div`
  margin: 0 0.3125rem;
  height: 1.125rem;
  line-height: 1.125rem;
  color: #adb5bd;
  font-size: 18px;
  position: relative;
  & > svg {
    cursor: pointer;
    &:hover {
      color: #5d646b;
    }
  }
`;

export const DropDownMenu = styled.div`
  position: absolute;
  inset: 0px auto auto 0px;
  margin: 0;
  height: 12.75rem;
  width: 10rem;
  transform: translate(0px, 22.2222px);
  font-size: 0.875rem;
  background-color: #2b2b2b;
  padding: 0.5rem 0;
  min-width: 10rem;
  text-align: left;
  list-style: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  display: block;
  z-index: 10;
  &:hover {
    svg {
      color: #5d646b;
    }
  }
  & a:last-child {
    color: #ff337c;
    span {
      color: #ff337c;
    }
  }
`;

export const DropDownItem = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.25rem 1.25rem;
  font-weight: 400;
  font-size: 1rem;
  color: rgba(197, 201, 223, 0.8);
  white-space: nowrap;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #383f44;
  }
  svg {
    margin-right: 0.75rem;
    height: 1.85rem;
    width: 1.85rem;
  }
`;
