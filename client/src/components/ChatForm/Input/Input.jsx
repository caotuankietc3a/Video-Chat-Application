import React from "react";
import {RiMailSendLine} from 'react-icons/ri';
import {ChatFooter, InputGroup} from "./StyledInput";
import {IoIosAddCircleOutline} from 'react-icons/io';
import {MdOutlineInsertEmoticon} from 'react-icons/md';

const Input = (props) => {

   return (
      <ChatFooter>
         <InputGroup>
            <div><IoIosAddCircleOutline /></div>
            <input type="text" placeholder="Enter your message..." onChange={props.changeHandler} value={props.message}></input>
            <div><MdOutlineInsertEmoticon /></div>
         </InputGroup>
         <button type="submit" onClick={props.clickHandler}><RiMailSendLine /></button>
      </ChatFooter>
   );
}

export default Input;
