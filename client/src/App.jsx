import "./App.css";
import Login from "./components/Login/Login";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import MeetingRoom from "./components/MeetingRoom/MeetingRoom";
import { Routes, Route, Navigate } from "react-router-dom";
import MeetingGroupRoom from "./components/MeetingRoom/MeetingGroupRoom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLogin } from "./store/actions/fetch-action";

function App() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserLogin(navigate));
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />}></Route>
      <Route
        path="/auth/login"
        element={<Login title="Sign Into Your Account" type="Login" />}
      ></Route>
      <Route
        path="/auth/register"
        element={<Login title="Create An Cccount" type="Register" />}
      ></Route>
      <Route
        path="/auth/reset-password"
        element={<Login title="Recover Your Password" type="Reset password" />}
      ></Route>

      <Route
        path="/auth/new-password"
        element={<Login title="Change your password" type="Change password" />}
      ></Route>
      <Route path="/home-chat/*" element={user && <ChatRoom />}></Route>
      <Route
        path="/meeting/:conversationId"
        element={user && <MeetingRoom />}
      ></Route>

      <Route
        path="/meeting-group/:conversationId"
        element={user && <MeetingGroupRoom />}
        // element={<MeetingGroupRoom />}
      ></Route>
    </Routes>
  );
}

export default App;
