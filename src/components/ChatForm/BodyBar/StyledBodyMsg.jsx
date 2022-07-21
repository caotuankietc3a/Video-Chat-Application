import styled from "styled-components";
import ScrollToBottom from "react-scroll-to-bottom";

export const MessagesBodyContainer = styled(ScrollToBottom)`
  flex: 1;
  width: 100%;
  padding: 0.75rem;
  overflow-y: scroll;
  height: 100%;
  & > div {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MessagesBodyContent = styled.div`
  max-width: 1320px;
  width: 100%;
  margin: 0 auto 1rem auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 60vh;

  mark {
    color: black;
  }

  & > div {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
