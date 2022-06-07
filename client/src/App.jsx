import "./App.css";
import Login from "./components/Login/Login";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import MeetingRoom from "./components/MeetingRoom/MeetingRoom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const userState = useSelector((state) => state.user);

  return (
    <BrowserRouter>
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
          path="/auth/forgot-password"
          element={
            <Login title="Recover Your Password" type="Change password" />
          }
        ></Route>
        {/* <Route */}
        {/*   path="/home-chat/*" */}
        {/*   element={ */}
        {/*     !userState.isLogin ? <ChatRoom /> : <Navigate to="/auth/login" /> */}
        {/*   } */}
        {/* ></Route> */}
        <Route
          path="/home-chat/*"
          element={<Navigate to="/auth/login" />}
        ></Route>

        <Route
          path="/meeting/:conversationId"
          element={<MeetingRoom />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
