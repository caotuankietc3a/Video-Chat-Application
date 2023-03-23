import { convertString } from "./common-function";
import Swal from "sweetalert2";
import { postData } from "./fetch-action";
const { REACT_APP_ENDPOINT_SERVER } = process.env;
export const postInvitationMessage = async (
  { receiverEmail, textArea, senderEmail },
  cb
) => {
  try {
    const convertedTextArea = convertString(textArea);
    const data = await postData(
      {
        receiverEmail,
        textArea: convertedTextArea,
        senderEmail,
      },
      `${REACT_APP_ENDPOINT_SERVER}/conversation/new-invitation-message`
    );
    if (data.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Successfully!!!",
        html: data.msg,
        showConfirmButton: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        cb();
      });
    } else if (data.status === "error") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: data.msg,
        showConfirmButton: "Ok",
        allowOutsideClick: false,
      }).then(() => {
        cb();
      });
    }
  } catch (err) {
    console.error(err);
  }
};
