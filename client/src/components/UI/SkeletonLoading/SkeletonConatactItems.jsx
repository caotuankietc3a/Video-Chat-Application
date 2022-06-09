import Skeleton from "react-loading-skeleton";
import {
  ContactItems,
  AvatarUser,
  ContactContents,
  ContactInfo,
  ContactTexts,
} from "../../ChatRoom/ChatContact/StyledContacts";
import { BsPinMapFill } from "react-icons/bs";
import "react-loading-skeleton/dist/skeleton.css";
const SkeletonConatactItems = () => {
  return (
    <ContactItems>
      <a>
        <AvatarUser type="Friends">
          <Skeleton
            height={"48px"}
            width={"48px"}
            highlightColor={"#4b4b6050"}
            duration={`1`}
            circle={true}
          />
        </AvatarUser>
        <ContactContents>
          <ContactInfo>
            <h6 className="text-truncate">
              <Skeleton
                height={`24px`}
                width={`195px`}
                duration={`1`}
                highlightColor={"#4b4b6050"}
              />
            </h6>
            <div>
              <Skeleton
                height={`24px`}
                width={`80px`}
                duration={`1`}
                highlightColor={"#4b4b6050"}
              />
            </div>
          </ContactInfo>
          <ContactTexts>
            <p className="text-truncate">
              <Skeleton
                height={`24px`}
                width={`292px`}
                duration={`1`}
                highlightColor={"#4b4b6050"}
              />
            </p>
          </ContactTexts>
        </ContactContents>
      </a>
    </ContactItems>
  );
};

export default SkeletonConatactItems;
