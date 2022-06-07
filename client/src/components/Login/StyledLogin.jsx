import styled from "styled-components";

export const LoginComponent = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 0;
  background: linear-gradient(to bottom right, #0300b7e8 0%, #ffffff 100%);
  background-size: cover;
  width: 100vw;
`;

export const LoginContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 12px 0 12px;
`;

export const LoginBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: ${(props) => {
    if (props.type === "Login") return "560px";
    else if (props.type === "Register") return "690px";
    else return "430px";
  }};
  border-radius: 20px;
  box-shadow: 0 0 15px rgb(0 0 0 / 10%);
  background: url("/images/backgroundImg.jpg") top left repeat;
  position: relative;
  max-width: 1140px;
  background-size: cover;

  @media only screen and (max-width: 960px) {
    width: 936px;
  }
  @media only screen and (max-width: 793px) {
    width: 500px;
  }
`;

export const FormSectionLogin = styled.div`
  height: 100%;
  width: 50%;
  text-align: center;
  padding: 60px 70px;
  background-color: #fff;
  border-radius: 10px 0 0 10px;
  z-index: 99;
  align-self: center;
  h3 {
    margin-bottom: 25px;
    font-size: 25px;
    font-weight: 400;
    color: #040404;
  }

  form {
    width: auto;
    height: 215px;
  }

  & > div {
    color: red;
  }
  @media only screen and (max-width: 793px) {
    border-radius: 10px;
    width: 100%;
  }

  @media only screen and (max-width: 614px) {
    padding: 50px 30px;
    border-radius: 10px;
  }
`;

export const BtnSectionLogin = styled.div`
  width: 100%;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #535353;
  a {
    font-size: 15px;
    float: left;
    background: #f5f5f5;
    font-weight: 400;
    text-align: center;
    line-height: 40px;
    font-family: "Jost", sans-serif;
    text-transform: uppercase;
    text-decoration: none;
    width: 110px;
    height: 40px;
  }
  a.btn-1 {
    border-right: 1px solid #e6e6e6;
  }
  a.active-bg {
    color: #0060ff;
  }
  a:hover {
    color: #0060ff;
  }
  &::after {
    display: block;
    clear: both;
    content: "";
  }
`;

export const FormGroupLogin = styled.div`
  height: ${({ type }) => (type === "Login" ? "20px" : "55px")};
  margin-bottom: 25px;
  position: relative;
  width: 100%;
  a.forgot-password {
    font-size: 16px;
    color: #535353;
    line-height: 50px;
    float: right;
    text-decoration: none;
  }
`;

export const FormCheckRegister = styled.div`
  float: left;
  margin-top: 0px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    font-size: 16px;
    margin-bottom: 0;
    color: #535353;
  }

  input {
    width: 20px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid #f5f5f5;
    margin-right: 5px;
  }

  input:checked {
    background-color: #0060ff;
  }
`;

export const EmailPassInput = styled.input`
  width: 100%;
  padding: 10px 25px;
  position: absolute;
  left: 0;
  outline: none;
  font-size: 16px;
  height: 55px;
  color: #535353;
  border-radius: 0;
  border: 1px solid transparent;
  background: #f5f5f5;
`;

export const ButtonLogin = styled.button`
  position: relative;
  float: left;
  overflow: hidden;
  cursor: pointer;
  border: 0;
  font-size: 17px;
  font-weight: 400;
  border-radius: 3px;
  font-family: "Jost", sans-serif;
  padding: 0 50px;
  line-height: 55px;
  background: #0060ff;
  color: #fff;
  span {
    z-index: 1;
    position: relative;
  }
  &:hover:before {
    left: 0;
    transform: scale(1, 1);
  }
  &:before {
    position: absolute;
    content: "";
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: #0254dc;
    left: 90%;
    transition: all 0.3s ease-in;
    transform: skewX(-25deg);
  }
`;

export const RegisterAccount = styled.div`
  position: absolute;
  bottom: 5%;
  left: 13.5%;
  p {
    margin: 0;
    line-height: 50px;

    a {
      margin-left: 5px;
      text-decoration: none;
    }
    a:active {
      color: #0060ff;
    }
  }
`;

export const InformationLogin = styled.div`
  width: 50%;
  height: 201px;
  align-self: center;
  & .info {
    padding: 30px;
    text-align: center;
    max-width: 300px;
    width: 240;
    margin: 0 auto;
    transition: all 0.5s ease-in;

    &:hover {
      transform: scale(1.1);
      z-index: 99;
    }

    .extra-login {
      height: 50px;
      margin: 25px 0 25px;
      width: 100%;
      margin-bottom: 20px;
      position: relative;
    }

    h3 {
      font-size: 25px;
      font-weight: 500px;
      color: #fff;
      margin-bottom: 20px;
      letter-spacing: 1.5px;
      text-align: center;
    }
  }

  @media only screen and (max-width: 793px) {
    display: none;
  }
`;

export const SocialList = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  a {
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    border-radius: 5%;
    margin: 2px;
    background: #fff;
    box-shadow: 0 0 35px rgb(0 0 0 / 10%);
    position: relative;
    &.fb-bg {
      color: #4867aa;
    }
    &.tw-bg {
      color: #33ccff;
    }
    &.gg-bg {
      color: #db4437;
    }

    &:hover {
      color: #fff;
      &.fb-bg {
        background-color: #4867aa;
        box-shadow: 0px 12px 16px -6px rgba(0, 0, 0, 0.91);
      }
      &.tw-bg {
        background-color: #33ccff;
        box-shadow: 0px 12px 16px -6px rgba(0, 0, 0, 0.91);
      }
      &.gg-bg {
        background-color: #db4437;
        box-shadow: 0px 12px 16px -6px rgba(0, 0, 0, 0.91);
      }
    }
  }
`;
