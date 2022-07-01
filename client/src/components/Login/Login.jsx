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
  // FormCheckRegister,
} from "./StyledLogin";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "../UI/CircularProgress/CircularProgress";
import { userLoginActions } from "../../store/slices/user-login-slice";
import { postData, fetchUserLogin } from "../../store/actions/fetch-action";
import Error from "../Error/Error";
import Swal from "sweetalert2";

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, error, user } = useSelector((state) => state.user);
  const { type } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  // const inputEl = useRef(null);
  const { socket_notify } = useSelector((state) => state.socket);
  let END_POINT_SERVER = process.env.REACT_APP_ENDPOINT_SERVER + "/auth";
  if (type === "Login") END_POINT_SERVER += "/login";
  else if (type === "Register") END_POINT_SERVER += "/register";
  else END_POINT_SERVER += "/forgot-password";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await postData(
        {
          fullname,
          email,
          password,
          confirmpassword,
          profilePhoto: {
            url: "/images/user-img.jpg",
          },
          // isChecked: type === "Login" ? inputEl?.current.checked : null,
        },
        END_POINT_SERVER
      );
      if (data.status === "error") {
        setTimeout(() => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            html: data.msg,
            showConfirmButton: "Continue",
            timer: 7000,
          });
          dispatch(userLoginActions.setIsFetching({ isFetching: false }));
          setIsClicked(false);
        }, 500);
        dispatch(userLoginActions.setIsFetching({ isFetching: true }));
      } else if (data.status === "success") {
        setTimeout(() => {
          if (type === "Register") navigate("/auth/login");
          else if (type === "Login") {
            socket_notify.emit("log-in");
            navigate("/home-chat");
          }
          dispatch(userLoginActions.setIsFetching({ isFetching: false }));
        }, 500);

        dispatch(
          userLoginActions.setUserLogin({
            user: data.user,
            isFetching: true,
            error: null,
          })
        );
      } else if (data.status === "enable2FA") {
        console.log(data);
        Swal.fire({
          html: `Correct login information, will be redirected to <strong>2-factor authentication page</strong> after this message.`,
          showConfirmButton: false,
          icon: "success",
          timer: 3500,
        }).then(() => {
          Swal.fire({
            html: "Please enter your token complete <strong>2-factor authentication</strong>!!",
            input: "number",
            inputPlaceholder: "6-digits",
            inputAttributes: {
              autocapitalize: "off",
            },
            showCancelButton: true,
            backdrop: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async (otpToken) => {
              return postData(
                { otpToken },
                `${process.env.REACT_APP_ENDPOINT_SERVER}/auth/verify-2FA/${data.userId}`
              )
                .then((response) => {
                  if (response.status === "valid") {
                    setTimeout(() => {
                      socket_notify.emit("log-in");
                      navigate("/home-chat");
                      dispatch(
                        userLoginActions.setIsFetching({ isFetching: false })
                      );
                    }, 500);

                    dispatch(
                      userLoginActions.setUserLogin({
                        user: response.user,
                        isFetching: true,
                        error: null,
                      })
                    );
                  } else if (response.status === "invalid") {
                    return Promise.reject(response.msg);
                  }
                })
                .catch((error) => {
                  Swal.showValidationMessage(`Error: ${error}`);
                });
            },
          });
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isClickedHandle = (e) => {
    setIsClicked(true);
  };

  useEffect(() => {
    dispatch(fetchUserLogin(navigate));
  }, []);

  return (
    <LoginComponent>
      {error && !isClicked && (
        <Error error_msg={error.msg} isClickedHandle={isClickedHandle}></Error>
      )}
      <LoginContainer>
        <LoginBox type={type}>
          <FormSectionLogin>
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
              <form
                action={END_POINT_SERVER}
                method="POST"
                onSubmit={submitHandler}
              >
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
                {/* {type === "Login" && ( */}
                {/*   <FormGroupLogin type={"Login"}> */}
                {/*     {type === "Login" && ( */}
                {/*       <FormCheckRegister> */}
                {/*         <input */}
                {/*           type="checkbox" */}
                {/*           name="keep_login" */}
                {/*           id="keep_login" */}
                {/*           ref={inputEl} */}
                {/*           onChange={(e) => { */}
                {/*             console.log(inputEl?.current.checked); */}
                {/*             inputEl.current.checked = e.target.checked; */}
                {/*           }} */}
                {/*         /> */}
                {/*         <label>Keep me login</label> */}
                {/*       </FormCheckRegister> */}
                {/*     )} */}
                {/*   </FormGroupLogin> */}
                {/* )} */}
                <FormGroupLogin>
                  <ButtonLogin type="submit">
                    {isFetching ? <CircularProgress /> : <span>{type}</span>}
                  </ButtonLogin>

                  {type === "Login" && (
                    <Link
                      to="/auth/forgot-password"
                      className="forgot-password"
                    >
                      Forgot password?
                    </Link>
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

                {/* <input type="hidden" name="urlClient" value={urlClient} /> */}
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
