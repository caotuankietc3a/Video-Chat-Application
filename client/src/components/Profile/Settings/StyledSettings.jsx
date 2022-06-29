import styled from "styled-components";

export const SettingsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const SettingsContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0rem 1.5rem 1.5rem 1.5rem;
  height: 90vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SettingsContent = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1.5rem 1.5rem 0 1.5rem;
  max-width: 1140px;
`;

export const SideBarHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background: #383f44;
  border-bottom: 1px solid #2b2b2f;
  border-left: 1px solid #2b2b2f;
  padding: 0.75rem;
  p,
  h5 {
    align-self: flex-start;
    padding: 0;
    margin: 0;
    width: 100%;
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
  &.card-header {
    background-color: #2a2a2a;
    h5 {
      font-size: 0.875rem;
      line-height: 1.2;
      font-weight: 500;
      margin-bottom: 0.375rem;
    }
    p {
      font-size: 0.75rem;
      font-weight: 400;
    }
  }
`;

export const SettingsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export const SettingsBody = styled.div`
  padding: ${({ padding }) => padding};
  width: 100%;
  height: height;
  background-color: #383f44;
  border: 2px solid #2b2b2f;
`;

export const SettingsRows = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #383f44;
`;

export const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 0.5px solid ${({ secure }) => (secure ? "#2a2a2a" : "transparent")};
  padding: ${({ secure }) => (secure ? "15px 15px" : "0px 15px")};
  max-width: ${({ width }) => width};
  width: ${({ width }) => width};
  margin: ${({ secure }) => (secure ? "0" : "0.7rem 0")};
  label {
    align-self: flex-start;
    font-size: 0.875rem;
    color: #fff;
    margin-bottom: 0.5rem;
  }
  input {
    background-color: #2a2a2a;
    // cursor: pointer;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    width: 100%;
    border: none;
    outline: none;
    border: 1px solid #2a2a2a;
    border-radius: 0.25rem;
    color: #adb5bd;

    &:focus {
      color: #fff;
    }
    &::placeholder {
      color: #adb5bd;
    }
  }

  & div {
    width: 100%;
    display: flex;
    div.text {
      min-width: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      p {
        margin: 0;
        align-self: flex-start;
        color: #f8f9fa;
        font-size: 0.875rem;
      }
    }

    div.btn {
      display: flex;
      align-items: center;
      justify-content: center;
      & label {
        margin: 0;
        align-self: center;
      }
      & .switch-bg {
        height: 20px;
        position: relative;
        width: 40px;
        border-radius: 10px;
        background: rgb(136, 136, 136);
        cursor: pointer;
        &.active {
          background: #008800;

          & .switch-handle {
            transform: translateX(21px);
            box-shadow: rgb(51, 187, 255) 0px 0px 2px 3px;
          }
        }
        svg {
          height: 20px;
          width: 20px;
          color: #fff;
        }
      }

      & .switch-handle {
        height: 18px;
        width: 18px;
        background: #fff;
        cursor: pointer;
        border-radius: 50%;
        position: absolute;
        transform: translateX(1px);
        top: 1px;
        outline: 0px;
        border: 0px;
        transition: all 0.2s ease-in-out;
      }
      & input {
        display: none;
      }
    }
  }
`;

export const SettingsFooter = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: #2a2a2a;
  border-top: 1px solid #2b2b2f;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & button {
    font-size: 0.875rem;
    cursor: pointer;
    margin: 0 0.375rem;
    font-weight: 400;
    padding: 0.4375rem 1.25rem;
    line-height: 1.5;
    border: none;

    &.reset {
      color: #adb5bd;
      background-color: transparent;
      &:hover {
        text-decoration: underline;
      }
    }
    &.save-changes {
      color: #fff;
      background-color: #665dfe;
      border-radius: 0.25rem;
      &:hover {
        background-color: #4237fe;
      }
    }
  }
`;
