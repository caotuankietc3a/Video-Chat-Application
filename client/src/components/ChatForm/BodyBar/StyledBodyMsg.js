import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';

export const MessagesBodyContainer = styled.div` 
   flex: 1;
   width: 100%;
   background-color: #323333;
   padding: 0.75rem;
`

export const MessagesBodyContent = styled(ScrollToBottom)` 
   max-width: 1320px;
   width: 100%;
   margin: 0 auto 100rem auto; 
   padding: 0 15px;
   overflow-y: scroll;
   height: 70vh;
   & > div{
      &::-webkit-scrollbar{
         display: none;
      }
   }

   &::-webkit-scrollbar{
      display: none;
   }
`
