import styled from 'styled-components';

export const MeetingFormContainer = styled.div`
   display: flex;
   justify-content: center;
   flex-direction: column;
   align-items: center;
   width: 100%;
   height: 100%;
`

export const MeetingFormContent = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 460px;
   background-color: #EAECEE;
   max-width: calc(100% - 80px);
   padding: 20px;
   border: 1px solid  #707B7C ;
   border-radius: 4px;
   & .title{
      font-size: 18px;
      text-transform: uppercase;
      margin-bottom: 0;
      font-weight: 700;
      margin-top: 25px;
      color: #666666;
   }
   & .name{
      font-size: 14px;
      margin-bottom: 0;
      margin-top: 5px;
      color: #666666;
   }
`

export const MeetingImgLogo = styled.div` 
   height: 50px;
   width: 50px;
   margin-bottom: -30px;
   display: flex;
   justify-content: center;
   align-items: center;
   svg{
      font-size: 40px;
      color: #34495E;
   }
`

export const MeetingPicture = styled.div` 
   width: 150px;
   cursor: pointer;
   margin: 10px 0;
`

export const MeetingImgWrapper = styled.div` 
   width: 150px;
   height: 150px;
   border-radius: 75px;
   animation: ring infinite 2.8s;
   animation-fill-mode: both;
   animation-timing-function: ease-out;
   box-sizing: border-box;
   img{
      width: 100%;
      height: 100%;
      border-radius: 75px;
      border: 1px solid #da7d02;
   }
   @keyframes ring {
      0% {
         width: 150px;
         height: 150px;
         border: 10px double #da7d02;
         padding: 4px; 
      }
      50% {
         width: 150px;
         height: 150px;
         border: 0 solid #ffffff;
         padding: 0; 
      }
      100% {
         width: 150px;
         height: 150px;
         border: 10px double #da7d02;
         padding: 4px; 
      } 
   }
`


export const MeetingBtns = styled.div` 
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
`

export const MeetingRoundedBtn = styled.div` 
   width: 60px;
   height: 60px;
   border-radius: 30px;
   cursor: pointer;
   margin: 8px;
   display: flex;
   justify-content: center;
   align-items: center;
   svg{
      font-size: 24px;
      color: #fff;
   }
   &.close{
      background-color: #F22A0F;
   }
   &.open{
      background-color: #1BC139;
   }
   &.video{
      background-color: #319CF0;
   }
   &:hover{
      opacity: .6;
   }
`

