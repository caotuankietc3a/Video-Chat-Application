import styled from "styled-components";

export const ChatFormContainer = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: ${({ showSearchBox }) =>
    showSearchBox ? "80px 80px auto 80px" : "80px auto 80px"};
`;

export const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  background-color: #323333;
  height: 5rem;
  z-index: 10;
  width: 100%;
  font-size: 1.5rem;
  font-weight: 550;
  border-top: 1px solid #343a40;
`;
