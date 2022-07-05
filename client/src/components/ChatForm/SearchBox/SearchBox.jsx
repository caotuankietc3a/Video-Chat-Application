import styled from "styled-components";
import { BsSearch } from "react-icons/bs";

const SearchBox = ({ searchMessageHandler }) => {
  return (
    <Container>
      <Content>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            searchMessageHandler(e);
          }}
        />
        <div>
          <BsSearch />
        </div>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  border-bottom: 1px solid #2b2b2f;
  padding-top: 1.2rem;
  display: block;
  width: 100%;
  overflow: hidden;
  animation: 0.75s show;
  @keyframes show {
    from {
      height: 0rem;
    }
    to {
      height: 4.5rem;
    }
  }
`;

const Content = styled.div`
  padding: 0 1.5rem;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  input {
    height: 2.5rem;
    background-color: #2a2a2a;
    border-color: #2a2a2a;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4;
    color: #495057;
    border: 1px solid transparent;
    border-radius: 0.25rem 0 0 0.25rem;
    outline: none;
    &:focus {
      color: #fff;
    }
    &::placeholder {
      color: #adb5bd;
    }
  }
  div {
    width: 45px;
    padding: 0rem 0.75rem;
    height: 2.5rem;
    border-radius: 0 6px 6px 0;
    background-color: #2a2a2a;
    cursor: pointer;
    svg {
      width: 20px;
      height: 20px;
      margin-top: 50%;
      color: #adb5bd;
    }
  }
`;

export default SearchBox;
