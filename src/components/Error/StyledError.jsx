import styled from "styled-components";
export const ErrorContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  place-items: center;
`;

export const ErrorContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  height: 15rem;
  width: 20rem;
  box-shadow: 0px 0px 25px 6px rgba(163, 1, 1, 1);
  border-radius: 4px;

  & .svg-btn {
    width: 50px;
    height: 50px;
    svg {
      width: 55px;
      height: 55px;
      color: red;
    }
  }

  & .error_name {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span {
      font-size: 25px;
      font-weight: 700;
    }
    p {
      font-size: 20px;
      color: #333333;
      text-align: center;
    }
  }

  & .btn button {
    width: 55px;
    border-style: none;
    height: 30px;
    background: #2f80ed;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    &:active {
      transform: scale(0.985);
    }
    &:hover {
      background: #4237fe;
    }
  }
`;
