import { ErrorContainer, ErrorContent } from "./StyledError.jsx";
import { VscError } from "react-icons/vsc";
const Error = ({ error_msg, isClickedHandle }) => {
  return (
    <ErrorContainer>
      <ErrorContent>
        <div className="svg-btn">
          <VscError></VscError>
        </div>
        <div className="error_name">
          <span>Opps...</span>
          <p>{error_msg}</p>
        </div>
        <div className="btn" onClick={isClickedHandle}>
          <button>Ok</button>
        </div>
      </ErrorContent>
    </ErrorContainer>
  );
};

export default Error;
