import {
  LoginContainer,
  LoginComponent,
  LoginBox,
  FormSectionLogin,
  BtnSectionLogin,
  FormGroupLogin,
  ButtonLogin,
  EmailPassInput,
  RegisterAccount,
  InformationLogin,
  SocialList,
  FormCheckRegister,
} from "./StyledLogin";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "../UI/CircularProgress";
import { userLoginActions } from "../../store/slices/user-login-slice";
import { postData, fetchUserLogin } from "../../store/actions/fetch-action";
const urlServer = "http://localhost:5000/auth/";
const urlClient = "http://localhost:3000/auth/";

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { type } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [fullname, setFullName] = useState("");

  let typeUrl = urlServer;
  if (type === "Login") typeUrl += "login";
  else if (type === "Register") typeUrl += "register";
  else typeUrl += "forgot-password";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await postData(
        {
          fullname,
          email,
          password,
          confirmpassword,
          profilePhoto: "/images/user-img.jpg",
        },
        typeUrl
      );
      if (data.status === "error") {
        setTimeout(() => {
          dispatch(
            userLoginActions.setLoginFailed({
              error: { msg: data.msg },
              isFetching: false,
            })
          );
        }, 1500);
        return dispatch(userLoginActions.setIsFetching({ isFetching: true }));
      }
      setTimeout(() => {
        if (type === "Register") navigate("/auth/login");
        else if (type === "Login") navigate("/home-chat");
        dispatch(userLoginActions.setIsFetching({ isFetching: false }));
      }, 1500);
      dispatch(
        userLoginActions.setUserLogin({
          user: data,
          isFetching: true,
          error: null,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    dispatch(fetchUserLogin(navigate));
  }, []);

  return (
    <LoginComponent>
      <LoginContainer>
        <LoginBox type={type}>
          <FormSectionLogin>
            {userState.error && <div>{userState.error.msg}</div>}
            <h3>{props.title}</h3>
            <BtnSectionLogin>
              <Link to="/auth/login" className="btn-1 active-bg">
                Login
              </Link>
              <Link to="/auth/register" className="btn-2">
                Register
              </Link>
            </BtnSectionLogin>
            {
              <form action={typeUrl} method="POST" onSubmit={submitHandler}>
                {type === "Register" && (
                  <FormGroupLogin>
                    <EmailPassInput
                      type="text"
                      name="fullname"
                      required={true}
                      placeholder="Full Name"
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                    ></EmailPassInput>
                  </FormGroupLogin>
                )}
                <FormGroupLogin>
                  <EmailPassInput
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                  ></EmailPassInput>
                </FormGroupLogin>
                {(type === "Register" || type === "Login") && (
                  <FormGroupLogin>
                    <EmailPassInput
                      type="password"
                      name="password"
                      required={true}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></EmailPassInput>
                  </FormGroupLogin>
                )}
                {type === "Register" && (
                  <FormGroupLogin>
                    <EmailPassInput
                      type="password"
                      name="confirmpassword"
                      required={true}
                      placeholder="Confirm Password"
                      value={confirmpassword}
                      onChange={(e) => setConfirmpassword(e.target.value)}
                    ></EmailPassInput>
                  </FormGroupLogin>
                )}
                <FormGroupLogin>
                  <ButtonLogin type="submit">
                    {userState.isFetching ? (
                      <CircularProgress />
                    ) : (
                      <span>{type}</span>
                    )}
                  </ButtonLogin>

                  {type === "Login" && (
                    <Link
                      to="/auth/forgot-password"
                      className="forgot-password"
                    >
                      Forgot Password
                    </Link>
                  )}
                  {type === "Register" && (
                    <FormCheckRegister>
                      <input
                        type="checkbox"
                        name="checkRegister"
                        id="checkRegister"
                      />
                      <label>I agree to the terms of service</label>
                    </FormCheckRegister>
                  )}
                </FormGroupLogin>
                <RegisterAccount>
                  {type === "Login" ? (
                    <p>
                      Don't have an account?
                      <Link to="/auth/register">Register here</Link>
                    </p>
                  ) : (
                    <p>
                      Already a member?
                      <Link to="/auth/login">Login here</Link>
                    </p>
                  )}
                </RegisterAccount>
                <input type="hidden" name="urlClient" value={urlClient} />
              </form>
            }
          </FormSectionLogin>
          <InformationLogin>
            <div className="info">
              <h3>Or Login With</h3>
              <SocialList>
                <a href="" className="fb-bg">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="" className="tw-bg">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="" className="gg-bg">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </SocialList>
            </div>
          </InformationLogin>
        </LoginBox>
      </LoginContainer>
    </LoginComponent>
  );
};

export default Login;
