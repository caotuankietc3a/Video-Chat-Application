import styled from "styled-components";
export const Container = styled.div`
  width: 26.875rem;
  border-left: 1px solid #2b2b2f;
  z-index: 100;
  background: #383f44;
  height: 100%;

  /* @media screen and (max-width: 1200px) { */
  /*   position: fixed; */
  /*   right: 0; */
  /*   top: 0; */
  /*   height: 90%; */
  /* } */
`;
export const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2b2b2f;
  padding: 0 0.75rem;
  min-height: 5rem;
  height: 5rem;
  width: 100%;
  & .header-content {
    width: 100%;
    padding: 0 15px;
    min-height: 5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & h5 {
      color: #ffffff;
      font-size: 1.09375rem;
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
    }
    & .btn-close {
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        svg {
          color: #5d646b;
        }
      }

      svg {
        cursor: pointer;
        height: 1.1rem;
        width: 1.1rem;
        color: #adb5bd;
      }
    }
  }
`;
export const Body = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;
export const BodyDetail = styled.div`
  padding: 1.5rem;
  & .avatar {
    height: 7.5rem;
    width: 7.5rem;
    min-width: 7.5rem;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    border-radius: 50%;
    img {
      height: 100%;
      border-radius: 50%;
      width: 100%;
      object-fit: cover;
    }
  }

  & .address-participant {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #fff;
      margin-right: 0.75rem;
    }
    span {
      font-size: 0.875rem;
      color: #f8f9fa;
    }
  }

  h5,
  p {
    color: #ffffff;
    font-size: 1.09375rem;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 0.375rem;
    margin-top: 0;
  }
`;
export const BodyDetailIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & .icon {
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 0.375rem;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
    &.icon-add-friend {
      background: #2a2a2a;
      border: 1px solid #2a2a2a;
      svg {
        color: #adb5bd;
      }
      &:hover {
        background-color: #495057;
      }
    }
    &.icon-love {
      border: 1px solid #362afe;
      background-color: #665dfe;
      svg {
        color: #fff;
      }
      &:hover {
        background-color: #4237fe;
      }
    }

    &.icon-block {
      border: 1px solid #ff337c;
      background-color: #ff337c;
      svg {
        color: #fff;
      }
      &:hover {
        background-color: #ff0d63;
      }
    }
  }
`;
export const BodyGroupContainer = styled.div`
  padding: 24px;
  height: 100%;
  width: 100%;
  background-color: #2a2a2a;
  max-height: 350px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const BodyGroup = styled.div`
  margin: 0.5rem 0;
  border: 1px solid #4b4b60;
  border-radius: 5px;
  & .bodygroup-card {
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    background-color: #364043;
    border-radius: 5px 5px 0 0;
    color: #e1e9f1;
    & .text-muted {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
      span {
        font-weight: 500;
        font-size: 14px;
      }
      svg {
        margin-right: 8px;
      }
    }
    & .plus-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  & .bodygroup-collapse {
    padding: ${({ about, image, attach, member }) =>
        about || image || attach || member ? "1.25rem" : "0"}
      1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    transition: all 0.5s ease-in-out;
    height: ${({ about, image, attach, member }) =>
      about || image || attach || member ? "300px" : "0"};
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    h5,
    p {
      margin: 0;
      text-align: left;
    }
    h5 {
      color: #e1e9f1;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    h5.location {
      margin-bottom: 0;
    }

    p.text-muted {
      margin-bottom: 0.25rem;
      font-size: 16px;
      color: #9aa1b9;
    }

    & .bodygroup-collapse-content {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      width: 100%;
      border: 1px solid #4b4b60;
      display: flex;
      align-items: center;
      justify-content: center;
      & .file-icon {
        height: 2.5rem;
        min-width: 2.5rem;
        min-height: 2.5rem;
        width: 2.5rem;
        margin-right: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #7269ef40;
        border-radius: 0.25rem;
        svg {
          font-size: 20px;
          font-weight: 500;
          color: #7269ef;
        }
      }
    }
    & .file-body {
      width: 100%;
      margin-right: 10px;
      overflow: hidden;

      h5 {
        margin-bottom: 0.25rem;
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: 600;
        color: #e1e9f1;
        line-height: 1.2;
      }
      p {
        color: #9aa1b9;
        font-size: 13px;
      }
    }

    & .file-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      & .download,
      & .drop-down {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
          font-size: 18px;
          color: #9aa1b9;
        }
        &:hover {
          svg {
            color: #fff;
          }
        }
      }
      & .download {
        margin-right: 0.75rem;
      }

      & .drop-down {
        margin-right: 0.25rem;
      }
    }

    & .group-member {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      & .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        img {
          border-radius: 50%;
          width: 2.2rem;
          height: 2.2rem;
          object-fit: cover;
        }
      }
      & .member-name {
        width: 100%;
        h5 {
          text-align: left;
          font-size: 14px;
          margin-bottom: 0.25rem;
          font-weight: 600;
          color: #e1e9f1;
          position: relative;
          span {
            border-radius: 0.25rem;
            position: absolute;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.15rem 0.5rem;
            text-align: center;
            color: #ef476f;
            background-color: #ef476f2e;
            top: -10px;
          }
        }
      }
    }
  }
`;
