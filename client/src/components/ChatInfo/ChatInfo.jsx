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
  BsChevronDown,
} from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { BiBlock } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { useState } from "react";
import BlockMember from "./BlockMember";

const ChatInfo = ({
  toggleCloseChatInfo,
  closeChatInfo,
  messages,
  conversation,
  blockGroupConversation,
  checkGroupBlockHandler,
}) => {
  console.log("ChatInfo is running!!!");
  const [about, setAbout] = useState(false);
  const [image, setImage] = useState(false);
  const [attach, setAttach] = useState(false);
  const [member, setMember] = useState(false);
  console.log(conversation);
  const closeAllStates = () => {
    setAttach(false);
    setAbout(false);
    setImage(false);
    setMember(false);
  };
  const filterFilesHandler = (files, type = "images") => {
    return files.map((file, i) => {
      return (
        <div className="bodygroup-collapse-content" key={i}>
          <div className="file-icon">
            {type === "images" ? (
              <BsCardImage />
            ) : (
              <BsFillFileEarmarkTextFill />
            )}
          </div>
          <div className="file-body">
            <h5>{file.name}</h5>
            <p>{`${file.size}Mb`}</p>
          </div>
          <div className="file-btn">
            <div className="download">
              <a href={file.url} target="_blank">
                <BsDownload />
              </a>
            </div>
            <div className="drop-down">
              <BsThreeDots />
            </div>
          </div>
        </div>
      );
    });
  };
  const filterMembersHandler = () => {
    return conversation?.members.map((mem, i) => {
      return (
        <BlockMember
          key={i}
          url={mem.user.profilePhoto.url}
          fullname={mem.user.fullname}
          isAdmin={mem.isAdmin}
          blockGroupConversation={blockGroupConversation}
          checkGroupBlockHandler={checkGroupBlockHandler}
          userId={mem.user._id}
          isBlocked={mem.block.isBlocked}
        ></BlockMember>
      );
    });
  };

  return (
    <Container closeChatInfo={closeChatInfo}>
      <Content>
        <Header>
          <div className="header-content">
            <h5 className="text-muted">
              {conversation.no_mems ? "Group Details" : "Profile Details"}
            </h5>
            <div className="btn-close" onClick={toggleCloseChatInfo}>
              <AiOutlineClose />
            </div>
          </div>
        </Header>
        <Body>
          <BodyDetail>
            <div className="avatar">
              <img src={conversation.profilePhoto.url} alt="User" />
            </div>
            <h5>{conversation.name}</h5>
            <div className="address-participant">
              <AiOutlineStar />
              <span>
                {conversation.no_mems
                  ? `${conversation.no_mems} paticipants`
                  : conversation.address}
              </span>
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
            <BodyGroup isAbout={about}>
              <div
                className="bodygroup-card"
                onClick={() => {
                  closeAllStates();
                  setAbout(!about);
                }}
              >
                <div className="text-muted">
                  <FaUserAlt />
                  <span>About</span>
                </div>
                <div className="plus-icon">
                  {!about ? <BsChevronRight /> : <BsChevronDown />}
                </div>
              </div>
              <div className="bodygroup-collapse">
                <div>
                  <p className="text-muted">Name</p>
                  <h5>{conversation.name}</h5>
                </div>
                <div>
                  <p className="text-muted">Email</p>
                  <h5>{conversation.email}</h5>
                </div>
                <div>
                  <p className="text-muted">Time</p>
                  <h5>{conversation.time}</h5>
                </div>
                <div>
                  <p className="text-muted">Location</p>
                  <h5 className="location">{conversation.address}</h5>
                </div>
              </div>
            </BodyGroup>

            <BodyGroup image={image}>
              <div
                className="bodygroup-card"
                onClick={() => {
                  closeAllStates();
                  setImage(!image);
                }}
              >
                <div className="text-muted">
                  <BsImages />
                  <span>Images</span>
                </div>
                <div className="plus-icon">
                  {!image ? <BsChevronRight /> : <BsChevronDown />}
                </div>
              </div>
              <div className="bodygroup-collapse">
                {messages.map((mes) => {
                  return filterFilesHandler(mes.files.images, "images");
                })}
              </div>
            </BodyGroup>

            <BodyGroup attach={attach}>
              <div
                className="bodygroup-card"
                onClick={() => {
                  closeAllStates();
                  setAttach(!attach);
                }}
              >
                <div className="text-muted">
                  <CgAttachment />
                  <span>Attached Files</span>
                </div>
                <div className="plus-icon">
                  {!attach ? <BsChevronRight /> : <BsChevronDown />}
                </div>
              </div>
              <div className="bodygroup-collapse">
                {messages.map((mes) => {
                  return filterFilesHandler(
                    mes.files.attachments,
                    "attachments"
                  );
                })}
              </div>
            </BodyGroup>

            {conversation.no_mems && (
              <BodyGroup member={member}>
                <div
                  className="bodygroup-card"
                  onClick={() => {
                    closeAllStates();
                    setMember(!member);
                  }}
                >
                  <div className="text-muted">
                    <FiUsers />
                    <span>Members</span>
                  </div>
                  <div className="plus-icon">
                    {!member ? <BsChevronRight /> : <BsChevronDown />}
                  </div>
                </div>
                <div className="bodygroup-collapse">
                  {filterMembersHandler()}
                </div>
              </BodyGroup>
            )}
          </BodyGroupContainer>
        </Body>
      </Content>
    </Container>
  );
};

export default ChatInfo;
