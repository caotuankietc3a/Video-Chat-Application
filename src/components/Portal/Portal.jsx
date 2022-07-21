import ReactDom from "react-dom";
const Portal = ({ children }) => {
  return ReactDom.createPortal(children, document.getElementById("portal"));
};

export default Portal;
