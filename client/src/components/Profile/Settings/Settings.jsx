import {
  SideBarHeader,
  SettingsContentWrapper,
  SettingsContainer,
} from "./StyledSettings";
import { arrayDisplay } from "../../../store/actions/common-function";
import SettingsDisplay from "./SettingsDisplay";
import Notification from "../../Notification/Notification";
import { useSelector, useDispatch } from "react-redux";
import { closeNotification } from "../../../store/actions/error-function";
const Settings = () => {
  const { notify } = useSelector((state) => state.error);
  const dispatch = useDispatch();
  return (
    <SettingsContainer>
      <SideBarHeader>
        <h5>Settings</h5>
        <p>Update Personal Information & Settings</p>
      </SideBarHeader>
      <SettingsContentWrapper>
        {arrayDisplay.map(({ header, rows }, i) => (
          <SettingsDisplay header={header} rows={rows} key={i} />
        ))}
      </SettingsContentWrapper>

      <Notification
        error={notify}
        closeNotification={() => {
          dispatch(closeNotification());
        }}
      />
    </SettingsContainer>
  );
};

export default Settings;
