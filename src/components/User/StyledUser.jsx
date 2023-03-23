import styled from "styled-components";
export const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UserContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & .avar-img img {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  & h5 {
    margin: 0;
    font-size: 1.09375rem;
    margin-bottom: 0.75rem;
    font-weight: 500;
    line-height: 1.2;
    color: #fff;
    margin-top: 1rem;
    margin-bottom: 0;
  }
  & p {
    margin-bottom: 1rem;
    color: #f8f9fa;
    white-space: nowrap;
  }
  & button {
    background: #665dfe;
    font-size: 0.875rem;
    border-color: #665dfe;
    padding: 0.4375rem 1.25rem;
    border-radius: 0.25rem;
    color: #fff;
    cursor: pointer;
    border-style: none;
    &:active {
      box-shadow: 0 0 0 0.2rem rgb(125 117 254 / 50%);
    }
    &:hover {
      background: #4237fe;
    }
  }
`;
