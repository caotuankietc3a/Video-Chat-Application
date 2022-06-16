import { useRef } from "react";
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
const Settings = () => {
  const inputEl1 = useRef(null);
  const inputEl2 = useRef(null);
  return (
    <SettingsContainer>
      <SideBarHeader>
        <h5>Settings</h5>
        <p>Update Personal Information & Settings</p>
      </SideBarHeader>
      <SettingsContentWrapper>
        {arrayDisplay.map(({ header, rows }, i) => (
          <SettingsContent key={i}>
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
                    ({ label, type, placeholder, width, p1, p2, id }, i) => (
                      <SettingsRow
                        key={i}
                        width={width ? width : "50%"}
                        secure={header.typeDisplay === "secure" ? true : false}
                      >
                        {header.typeDisplay !== "secure" && (
                          <>
                            <label>{label}</label>
                            <input type={type} placeholder={placeholder} />
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
                <button className="save-changes">Save Changes</button>
              </SettingsFooter>
            </SettingsWrapper>
          </SettingsContent>
        ))}
      </SettingsContentWrapper>
    </SettingsContainer>
  );
};

export default Settings;
