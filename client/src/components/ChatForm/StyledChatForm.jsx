import styled from "styled-components";

export const ChatFormContainer = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 80px ${({ showSearchBox }) =>
      showSearchBox ? "80px" : "auto"} auto 80px;
`;
