import styled from "styled-components";
import { BiBlock } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { useEffect, useState } from "react";
const BlockMember = ({
  url,
  fullname,
  isAdmin,
  blockGroupConversation,
  checkGroupBlockHandler,
  userId,
  isBlocked,
}) => {
  const [groupBlock, setGroupBlock] = useState(false);
  useEffect(() => {
    setGroupBlock(isBlocked);
  }, []);
  return (
    <BlockMemberContainer className="group-member">
      <div className="avatar">
        <img src={url} alt="Member" />
      </div>
      <div className="member-name">
        <h5>
          {fullname}
          {isAdmin && <span>Admin</span>}
        </h5>
      </div>
      {!isAdmin && checkGroupBlockHandler() && (
        <div
          className="block-member"
          onClick={() => {
            blockGroupConversation(groupBlock, userId, () => {
              setGroupBlock(!groupBlock);
            });
          }}
        >
          {!groupBlock ? <BiBlock /> : <CgUnblock />}
        </div>
      )}
    </BlockMemberContainer>
  );
};

export default BlockMember;

const BlockMemberContainer = styled.div`
  /* & .group-member { */
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  & .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    img {
      border-radius: 50%;
      width: 2.2rem;
      height: 2.2rem;
      object-fit: cover;
    }
  }
  & .member-name {
    width: 100%;
    h5 {
      text-align: left;
      font-size: 14px;
      margin-bottom: 0.25rem;
      font-weight: 600;
      color: #e1e9f1;
      position: relative;
      span {
        border-radius: 0.25rem;
        position: absolute;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.15rem 0.5rem;
        text-align: center;
        color: #ef476f;
        background-color: #ef476f2e;
        top: -10px;
      }
    }
  }
  & .block-member {
    cursor: pointer;
    border-radius: 0.25rem;
    width: 75px;
    height: 25px;
    background: #364043;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      border-radius: 50%;
      width: 18px;
      height: 18px;
      color: #fff;
    }
    &:hover {
      background: #36404370;
    }
  }
  /* } */
`;
