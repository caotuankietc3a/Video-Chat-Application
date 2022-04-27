import styled from 'styled-components';
export const ChatFooter = styled.form` 
   display: flex;
   position: fixed;
   bottom: 0;
   width: calc(100% - 69px - 419px);
   height: 5rem;
   padding: 0.75rem 2.25rem;
   background-color: #323333;
   border-top: 1px solid #343a40;
   button{
      width: 5rem;
      cursor: pointer;
      outline: none;
      height: 100%;
      padding: .1rem;
      margin-left: .5rem;
      background-color: #665dfe;
      border-radius: 4px;
      &:hover{
         background-color: #4237fe;
      }
   }

   svg{
      font-size: 1.5rem;
      color: white;
   }
`

export const InputGroup = styled.div` 
   display: flex;
   align-items: center;
   padding: 0 5px;
   width: 100%;
   input{
      width: 100%;
      padding: 6px 12px;
      background-color: #2a2a2a;
      border: 0;
      font-size: .875rem;
      color: white;
      &:focus{
         outline: none;
      }
   }
   div{
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .75rem;
   }
`
