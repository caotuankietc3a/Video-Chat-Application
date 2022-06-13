import {
  Container,
  Content,
  Header,
  Body,
  SearchBar,
  FriendCol,
} from "./StyledFriendList";
import { IoClose } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import FriendShow from "./FriendShow/FriendShow";
const FriendList = () => {
  return (
    <Container>
      <Content>
        <Header>
          <div>
            <h5>Cao Kiet</h5>
          </div>
          <div className="btn-close">
            <IoClose />
          </div>
        </Header>
        <Body>
          <SearchBar>
            <input type="text" placeholder="Search user....." />
            <div>
              <BsSearch />
            </div>
          </SearchBar>
          <FriendCol>
            {new Array(4).fill(null).map((_el, i) => {
              return <FriendShow key={i} />;
            })}
          </FriendCol>
        </Body>
      </Content>
    </Container>
  );
};

export default FriendList;
