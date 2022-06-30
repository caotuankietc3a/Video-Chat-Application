import {
  SettingsContent,
  SideBarHeader,
  SettingsBody,
  SettingsWrapper,
  SettingsFooter,
  SettingsRows,
  SettingsRow,
} from "./StyledSettings";
import BouncyLoading from "../../UI/BouncyLoading/BouncyLoading";
import { postData } from "../../../store/actions/fetch-action";
import { userLoginActions } from "../../../store/slices/user-login-slice";
import { errorActions } from "../../../store/slices/error-slice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { TiTick } from "react-icons/ti";
const SettingsDisplay = ({ header, rows }) => {
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const { user } = useSelector((state) => state.user);
  const [isFetching, setIsFetching] = useState(false);
  const inputEl1 = useRef(null);
  const inputEl2 = useRef(null);
  const accountRef = useRef({});
  const socialNetRef = useRef({});
  const passwordRef = useRef({});
  const dispatch = useDispatch();
  console.log(isFetching);

  const submitHandler = async (e, h5) => {
    e.preventDefault();
    console.log(h5);
    switch (h5) {
      case "Account": {
        const { updatedUser } = await postData(
          accountRef.current,
          `${END_POINT_SERVER}/auth/update-profile-account/${user._id}`
        );
        dispatch(
          errorActions.setNotify({
            notify: "Your account profile has been updated!",
          })
        );
        setIsFetching(false);
        return dispatch(userLoginActions.setUser({ user: updatedUser }));
      }
      case "Social network profiles": {
        if (
          socialNetRef.current.facebook ||
          socialNetRef.current.twitter ||
          socialNetRef.current.instagram
        ) {
          const { updatedUser } = await postData(
            socialNetRef.current,
            `${END_POINT_SERVER}/auth/update-profile-social/${user._id}`
          );
          dispatch(
            errorActions.setNotify({
              notify: "Your social networking sites have been updated!",
            })
          );
          dispatch(userLoginActions.setUser({ user: updatedUser }));
        } else {
          dispatch(
            errorActions.setNotify({
              notify: "Please fill in at lease one site to update!",
            })
          );
        }
        return setIsFetching(false);
      }
      case "Password": {
        const res = await postData(
          passwordRef.current,
          `${END_POINT_SERVER}/auth/update-profile-password/${user._id}`
        );
        dispatch(
          errorActions.setNotify({
            notify: res.msg,
          })
        );
        return setIsFetching(false);
      }
    }
  };

  const accountHandler = (e, label) => {
    switch (label) {
      case "Full name": {
        return (accountRef.current.fullname = e.target.value);
      }
      case "Your profile": {
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onload = () => {
          accountRef.current.profilePhoto = {
            name: file.name,
            url: reader.result,
          };
        };
        reader.readAsDataURL(file);

        return;
      }
      case "Mobile number": {
        return (accountRef.current.phone = e.target.value);
      }
      case "Birth date": {
        return (accountRef.current.birthdate = e.target.value
          .split("-")
          .reverse()
          .join("/"));
      }
      case "Email Address": {
        return (accountRef.current.anotherEmail = e.target.value);
      }
      case "Website": {
        return (accountRef.current.website = e.target.value);
      }
      case "Address": {
        return (accountRef.current.address = e.target.value);
      }
    }
  };

  const socialNetHandler = (e, label) => {
    switch (label) {
      case "Facebook": {
        return (socialNetRef.current.facebook = e.target.value);
      }
      case "Instagram": {
        return (socialNetRef.current.instagram = e.target.value);
      }
      case "Twitter": {
        return (socialNetRef.current.twitter = e.target.value);
      }
    }
  };

  const passwordHandler = (e, label) => {
    switch (label) {
      case "Current Password": {
        return (passwordRef.current.oldPassword = e.target.value);
      }
      case "New Password": {
        return (passwordRef.current.newPassword = e.target.value);
      }
      case "Repeat Password": {
        return (passwordRef.current.repeatPassword = e.target.value);
      }
    }
  };

  return (
    <SettingsContent
      onSubmit={(e) => {
        setIsFetching(true);
        submitHandler(e, header.h5);
      }}
    >
      <SideBarHeader className="card-header">
        <h5>{header.h5}</h5>
        <p>{header.p}</p>
      </SideBarHeader>
      <SettingsWrapper>
        <SettingsBody
          padding={header.typeDisplay === "secure" ? "0rem" : "1.25rem"}
        >
          <SettingsRows>
            {rows.map(
              (
                {
                  label,
                  type,
                  placeholder,
                  width,
                  p1,
                  p2,
                  id,
                  accept,
                  pattern,
                  title,
                  name,
                },
                i
              ) => (
                <SettingsRow
                  key={i}
                  width={width ? width : "50%"}
                  secure={header.typeDisplay === "secure" ? true : false}
                >
                  {header.typeDisplay !== "secure" && (
                    <>
                      <label>{label}</label>
                      <input
                        type={type}
                        required={
                          header.h5 === "Social network profiles" ? false : true
                        }
                        placeholder={placeholder}
                        accept={accept}
                        pattern={pattern}
                        title={title}
                        name={name}
                        onChange={(e) => {
                          if (header.h5 === "Account") accountHandler(e, label);
                          else if (header.h5 === "Social network profiles")
                            socialNetHandler(e, label);
                          else if (header.h5 === "Password")
                            passwordHandler(e, label);
                          console.log(accountRef.current);
                          console.log(socialNetRef.current);
                          console.log(passwordRef.current);
                        }}
                      />
                    </>
                  )}
                  {header.typeDisplay === "secure" && (
                    <div>
                      <div className="text">
                        <p>{p1}</p>
                        <p>{p2}</p>
                      </div>
                      <div className="btn">
                        <label className={`switch-bg`} htmlFor={id}>
                          <TiTick />
                          <div className="switch-handle"></div>
                        </label>
                        <input
                          type="checkbox"
                          id={id}
                          ref={id === "two-factor" ? inputEl1 : inputEl2}
                          onChange={(e) => {
                            id === "two-factor"
                              ? inputEl1.current.previousElementSibling.classList.toggle(
                                  "active"
                                )
                              : inputEl2.current.previousElementSibling.classList.toggle(
                                  "active"
                                );
                          }}
                        />
                      </div>
                    </div>
                  )}
                </SettingsRow>
              )
            )}
          </SettingsRows>
        </SettingsBody>
        <SettingsFooter>
          <button className="reset">Reset</button>
          <button className="save-changes" type="submit">
            {isFetching ? (
              <BouncyLoading
                height="21px"
                width="100px"
                translateY1="2px"
                translateY2="-10px"
              />
            ) : (
              "Save Changes"
            )}
          </button>
        </SettingsFooter>
      </SettingsWrapper>
    </SettingsContent>
  );
};

export default SettingsDisplay;
