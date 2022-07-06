import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

export const MainLayOut = styled.div`
  display: grid;
  grid-template-columns: 69px 419px auto;
  height: 100%;
  width: 100%;
  @media screen and (max-width: 1200px) {
    grid-template-columns: 0 0 auto;
  }
`;
export const ChatBodyContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #323232;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 21.875rem;
`;
