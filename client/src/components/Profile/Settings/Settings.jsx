import { useRef, useState } from "react";
import {
  SideBarHeader,
  SettingsContent,
  SettingsContentWrapper,
  SettingsContainer,
  SettingsBody,
  SettingsWrapper,
  SettingsFooter,
  SettingsRows,
  SettingsRow,
} from "./StyledSettings";
import { arrayDisplay } from "../../../store/actions/common-function";
import { TiTick } from "react-icons/ti";
import { postData } from "../../../store/actions/fetch-action";
import { useSelector } from "react-redux";
const Settings = () => {
  const inputEl1 = useRef(null);
  const inputEl2 = useRef(null);
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const accountRef = useRef({});
  const { user } = useSelector((state) => state.user);
  const [socialNetwork, setSocialNetwork] = useState({});
  const [password, setPassword] = useState({});
  const [security, setSecurity] = useState({});
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

      default:
        break;
    }
  };

  const submitHandler = (e, h5) => {
    e.preventDefault();
    switch (h5) {
      case "Account": {
        console.log(user);
        postData(
          accountRef.current,
          `${END_POINT_SERVER}/auth/update-profile/${user._id}`
        );
        return;
      }
      default:
        break;
    }
  };
  return (
    <SettingsContainer>
      <SideBarHeader>
        <h5>Settings</h5>
        <p>Update Personal Information & Settings</p>
      </SideBarHeader>
      <SettingsContentWrapper>
        {arrayDisplay.map(({ header, rows }, i) => (
          <SettingsContent
            key={i}
            onSubmit={(e) => {
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
                              required={true}
                              placeholder={placeholder}
                              accept={accept}
                              pattern={pattern}
                              title={title}
                              onChange={(e) => {
                                accountHandler(e, label);
                                console.log(accountRef.current);
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
                  Save Changes
                </button>
              </SettingsFooter>
            </SettingsWrapper>
          </SettingsContent>
        ))}
      </SettingsContentWrapper>
    </SettingsContainer>
  );
};

export default Settings;
