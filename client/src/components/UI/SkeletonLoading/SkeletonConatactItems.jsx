const SkeletonConatactItems = () => {
  return (
    <ContactItems onClick={clickHandler}>
      {props.displayChar && <p>{friend.fullname[0].toUpperCase()}</p>}
      <Link to={linkTo + `/detail/${props.id}`}>
        <AvatarUser type={props.type}>
          <img
            src={
              type === "Friends"
                ? friend.profilePhoto
                : conversation.profilePhoto
            }
            alt=""
          />
        </AvatarUser>
        <ContactContents>
          <ContactInfo>
            <h6 className="text-truncate">
              {type === "Friends" ? friend.fullname : conversation.name}
            </h6>
            {type !== "Friends" && (
              <div>
                {conversation.messages.length - 1 !== -1
                  ? formatDate(
                      conversation.messages[conversation.messages.length - 1]
                        .date
                    )
                  : formatDate(new Date(Date.now()))}
              </div>
            )}
          </ContactInfo>
          <ContactTexts>
            {type === "Friends" && <BsPinMapFill />}
            <p className="text-truncate">
              {type === "Friends"
                ? friend.address
                : conversation.messages.length - 1 !== -1
                ? conversation.messages[conversation.messages.length - 1].text
                : "......."}
            </p>
          </ContactTexts>
        </ContactContents>
      </Link>
    </ContactItems>
  );
};

export default SkeletonConatactItems;
