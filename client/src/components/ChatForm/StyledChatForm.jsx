import styled from "styled-components";

export const ChatFormContainer = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: ${({ showSearchBox }) =>
    showSearchBox ? "80px 80px auto 80px" : "80px auto 80px"};
`;
