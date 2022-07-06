import { AiOutlineClose, AiOutlineStar } from "react-icons/ai";
import {
  Container,
  Content,
  Header,
  Body,
  BodyDetailIcons,
  BodyGroup,
  BodyDetail,
  BodyGroupContainer,
} from "./StyledChatInfo";
import { HiOutlineUserAdd } from "react-icons/hi";
import { BiBlock } from "react-icons/bi";
import { GiSelfLove } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import {
  BsChevronRight,
  BsImages,
  BsDownload,
  BsThreeDots,
  BsFillFileEarmarkTextFill,
  BsCardImage,
} from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";

const ChatInfo = () => {
  return (
    <Container>
      <Content>
        <Header>
          <div className="header-content">
            <h5 className="text-muted">Profile Details</h5>
            <div className="btn-close">
              <AiOutlineClose />
            </div>
          </div>
        </Header>
        <Body>
          <BodyDetail>
            <div className="avatar">
              <img src="/images/user-img.jpg" alt="" />
            </div>
            <h5>Catherine Richardson</h5>
            <div className="address-participant">
              <AiOutlineStar />
              <span>San Fransisco, CA</span>
            </div>
            <BodyDetailIcons>
              <div className="icon icon-add-friend">
                <HiOutlineUserAdd />
              </div>
              <div className="icon icon-love">
                <GiSelfLove />
              </div>
              <div className="icon icon-block">
                <BiBlock />
              </div>
            </BodyDetailIcons>
          </BodyDetail>

          <BodyGroupContainer>
            <BodyGroup>
              <div className="bodygroup-card">
                <div className="text-muted">
                  <FaUserAlt />
                  <span>About</span>
                </div>
                <div className="plus-icon">
                  <BsChevronRight />
                  {/* <BsChevronUp /> */}
                </div>
              </div>
              <div className="bodygroup-collapse">
                <div>
                  <p className="text-muted">Name</p>
                  <h5>CaoTuanKiet</h5>
                </div>
                <div>
                  <p className="text-muted">Email</p>
                  <h5>caotuankietc3a@gmail.com</h5>
                </div>
                <div>
                  <p className="text-muted">Time</p>
                  <h5>11:40am</h5>
                </div>
                <div>
                  <p className="text-muted">Location</p>
                  <h5 className="location">No Trang Long</h5>
                </div>
              </div>
            </BodyGroup>

            <BodyGroup>
              <div className="bodygroup-card">
                <div className="text-muted">
                  <BsImages />
                  <span>Images</span>
                </div>
                <div className="plus-icon">
                  <BsChevronRight />
                  {/* <BsChevronUp /> */}
                </div>
              </div>
              <div className="bodygroup-collapse">
                <div className="bodygroup-collapse-content">
                  <div className="file-icon">
                    <BsCardImage />
                  </div>
                  <div className="file-body">
                    <h5>Admin.zip</h5>
                    <p>12.5mb</p>
                  </div>
                  <div className="file-btn">
                    <div className="download">
                      <BsDownload />
                    </div>
                    <div className="drop-down">
                      <BsThreeDots />
                    </div>
                  </div>
                </div>
              </div>
            </BodyGroup>

            <BodyGroup>
              <div className="bodygroup-card">
                <div className="text-muted">
                  <CgAttachment />
                  <span>Attached Files</span>
                </div>
                <div className="plus-icon">
                  <BsChevronRight />
                  {/* <BsChevronDown /> */}
                </div>
              </div>
              <div className="bodygroup-collapse">
                <div className="bodygroup-collapse-content">
                  <div className="file-icon">
                    <BsFillFileEarmarkTextFill />
                  </div>
                  <div className="file-body">
                    <h5>Admin.zip</h5>
                    <p>12.5mb</p>
                  </div>
                  <div className="file-btn">
                    <div className="download">
                      <BsDownload />
                    </div>
                    <div className="drop-down">
                      <BsThreeDots />
                    </div>
                  </div>
                </div>
              </div>
            </BodyGroup>

            <BodyGroup>
              <div className="bodygroup-card">
                <div className="text-muted">
                  <FiUsers />
                  <span>Members</span>
                </div>
                <div className="plus-icon">
                  <BsChevronRight />
                  {/* <BsChevronDown /> */}
                </div>
              </div>
              <div className="bodygroup-collapse">
                <div class="group-member">
                  <div className="avatar">
                    <img src="/images/user-img.jpg" alt="" />
                  </div>
                  <div className="member-name">
                    <h5>
                      Sara Muller<span>Admin</span>
                    </h5>
                  </div>
                </div>
                <div class="group-member">
                  <div className="avatar">
                    <img src="/images/user-img.jpg" alt="" />
                  </div>
                  <div className="member-name">
                    <h5>
                      Sara Muller<span>Admin</span>
                    </h5>
                  </div>
                </div>
                <div class="group-member">
                  <div className="avatar">
                    <img src="/images/user-img.jpg" alt="" />
                  </div>
                  <div className="member-name">
                    <h5>
                      Sara Muller<span>Admin</span>
                    </h5>
                  </div>
                </div>
                <div class="group-member">
                  <div className="avatar">
                    <img src="/images/user-img.jpg" alt="" />
                  </div>
                  <div className="member-name">
                    <h5>
                      Sara Muller<span>Admin</span>
                    </h5>
                  </div>
                </div>
              </div>
            </BodyGroup>
          </BodyGroupContainer>
        </Body>
      </Content>
    </Container>
  );
};

export default ChatInfo;
