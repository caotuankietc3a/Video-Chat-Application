import styled from "styled-components";
export const CallItemsContainer = styled.div`
  margin-bottom: 1rem;
  background: #383f44;
  border: 1px solid #2b2b2f;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 4px;
`;

export const CallItemsContent = styled.div`
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const CallItemsMedia = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CallItemsMediaAvatar = styled.div`
  height: 48px;
  width: 48px;
  min-height: 48px;
  min-width: 48px;

  & span {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background: #665dfe;
    border-radius: 50%;
    svg {
      height: 24px;
      width: 24px;
      color: #fff;
    }
  }
`;

export const CallItemsMediaBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-left: 0.85rem;
  & h6,
  & div,
  & div p {
    align-self: flex-start;
    margin: 0;
    font-size: 0.875rem;
  }
  & h6 {
    margin-bottom: 4px;
    color: #fff;
    &.missed-call {
      color: #ff337c;
    }
  }
  & div {
    display: flex;
    justify-content: center;
    align-items: center;
    & span {
      color: #adb5bd;
      margin: 0 0.875rem;
    }
    & p {
      color: #f8f9fa;
    }
  }
`;

export const CallItemsMediaOptions = styled.div`
  margin-left: 0.375rem;
  & button {
    background: transparent;
    border: none;
    cursor: pointer;
    & svg {
      height: 1.25rem;
      width: 1.25rem;
      color: #adb5bd;
    }
    &:hover {
      svg {
        color: #5d646b;
      }
    }
  }
`;
