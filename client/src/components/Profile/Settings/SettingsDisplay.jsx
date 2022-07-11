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
import {
  enable2FAFunction,
  postData,
} from "../../../store/actions/fetch-action";
import { userLoginActions } from "../../../store/slices/user-login-slice";
import { errorActions } from "../../../store/slices/error-slice";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import { TiTick } from "react-icons/ti";
const SettingsDisplay = ({ header, rows }) => {
  const END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER;
  const { user } = useSelector((state) => state.user);
  const [isFetching, setIsFetching] = useState(false);
  const accountRef = useRef({});
  const socialNetRef = useRef({});
  const passwordRef = useRef({});
  const securityRef = useRef({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      securityRef.current.is2FAEnabled = user.twoFA.is2FAEnabled;
    }
  }, [user]);

  const submitHandler = async (e, h5) => {
    e.preventDefault();
    switch (h5) {
      case "Account": {
        try {
          const { updatedUser } = await postData(
            accountRef.current,
            `${END_POINT_SERVER}/auth/update-profile-account/${user._id}`
          );
          Swal.fire({
            icon: "success",
            title: "Successfully!!!",
            html: "Your account profile has been updated!",
            showConfirmButton: "Continue",
            timer: 5000,
          });
          setIsFetching(false);
          return dispatch(userLoginActions.setUser({ user: updatedUser }));
        } catch (err) {
          return console.error(err);
        }
      }
      case "Social network profiles": {
        try {
          if (
            socialNetRef.current.facebook ||
            socialNetRef.current.twitter ||
            socialNetRef.current.instagram
          ) {
            const { updatedUser } = await postData(
              socialNetRef.current,
              `${END_POINT_SERVER}/auth/update-profile-social/${user._id}`
            );

            Swal.fire({
              icon: "success",
              title: "Successfully!!!",
              html: "Your social networking sites have been updated!",
              showConfirmButton: "Continue",
              timer: 5000,
            });
            dispatch(userLoginActions.setUser({ user: updatedUser }));
          } else {
            dispatch(
              errorActions.setNotify({
                notify: "Please fill in at lease one site to update!",
              })
            );
          }
          return setIsFetching(false);
        } catch (err) {
          return console.error(err);
        }
      }
      case "Password": {
        try {
          const res = await postData(
            passwordRef.current,
            `${END_POINT_SERVER}/auth/update-profile-password/${user._id}`
          );
          if (res.status === "error") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              html: res.msg,
              showConfirmButton: "Continue",
              timer: 5000,
            });
          } else if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Successfully!!!",
              html: res.msg,
              showConfirmButton: "Continue",
              timer: 5000,
            });
          }
          return setIsFetching(false);
        } catch (err) {
          return console.error(err);
        }
      }
      case "Security": {
        try {
          console.log(securityRef.current);
          console.log(user.twoFA.is2FAEnabled);
          if (!securityRef.current.is2FAEnabled) {
            if (user.twoFA.is2FAEnabled) {
              const res = await postData(
                securityRef.current,
                `${END_POINT_SERVER}/auth/update-profile-security/${user._id}`
              );
              if (res.status === "cancel") {
                Swal.fire({
                  html: "Disable <strong><i>2-factor authentication</i></strong> completely!",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                console.log(res.user);
                dispatch(userLoginActions.setUser({ user: res.user }));
              }
            } else {
              Swal.fire({
                html: "<strong><i>2-factor authentication</i></strong> has already been disable!!!",
                icon: "warning",
                confirmButtonText: "Ok",
              });
            }
          } else {
            if (user.twoFA.is2FAEnabled) {
              Swal.fire({
                html: "<strong><i>2-factor authentication</i></strong> has already been activated!!!",
                icon: "warning",
                confirmButtonText: "Ok",
              });
            } else {
              console.log("sssssssssssssssssssssssssssss");
              const res = await postData(
                securityRef.current,
                `${END_POINT_SERVER}/auth/update-profile-security/${user._id}`
              );
              console.log(res);
              if (res.status === "success") {
                // Swal.fire({
                //   html: "Please scan this <strong>QR code</strong> to complete <strong><i>2-factor authentication</i></strong>!!",
                //   imageUrl: res.QRCodeUrl,
                //   confirmButtonText: "Ok",
                // });
                //
                // console.log(res.user);
                // dispatch(userLoginActions.setUser({ user: res.user }));
                dispatch(
                  enable2FAFunction(res.QRCodeUrl, user._id, res.uniqueSecret)
                );
              }
            }
          }
          // } else {
          // }
          return setIsFetching(false);
        } catch (err) {
          return console.error(err);
        }
        // if (securityRef.current.is2FAEnabled !== undefined) {
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

  const securityHandler = (e, id) => {
    const isChecked =
      e.target.previousElementSibling.classList.contains("active");
    switch (id) {
      case "two-factor": {
        return (securityRef.current.is2FAEnabled = isChecked);
      }
      case "unrecognised-logins": {
        return (securityRef.current.unrecognisedLogins = isChecked);
      }
    }
    e.target.previousElementSibling.classList.toggle("active");
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
                        {/* <label className={`switch-bg`} htmlFor={id}> */}
                        <label
                          className={
                            user?.twoFA.is2FAEnabled && id === "two-factor"
                              ? "switch-bg active"
                              : "switch-bg"
                          }
                          htmlFor={id}
                        >
                          <TiTick />
                          <div className="switch-handle"></div>
                        </label>
                        <input
                          type="checkbox"
                          id={id}
                          onChange={(e) => {
                            e.target.previousElementSibling.classList.toggle(
                              "active"
                            );
                            securityHandler(e, id);
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
          <div className="reset">Reset</div>
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
