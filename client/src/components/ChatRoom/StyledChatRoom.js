import styled from 'styled-components';

export const Container = styled.div` 
   height: 100vh;
   width: 100vw;
   overflow: hidden;
`

export const MainLayOut = styled.div` 
   display: grid;
   grid-template-columns: 69px 419px auto;
   height: 100%;
   width: 100%;
`

export const NavBar = styled.div` 
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   width: 69px;
   height: 100vh;
   background-color: #665dfe;
   padding: 0.75rem 0;

   & > a{
      width: 42px;
      height: 42px;
      text-align: center;
      padding: 6px;
      background-color: #f8f9fa;
      border-radius: 4px;
      svg{
         width: 30px;
         height: 30px;
         color: #938cff;
      }
      &:hover{
         opacity: 0.8;
      }
   }
`

export const UlNav = styled.ul` 
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100%;
   width: 100%;
   list-style: none;
   padding-left: 0;
   margin: 0;
   & a:hover{
      transition: all .2s ease;
      color: #d6d5e3;
   }
   a.active{
      color: white;
   }
`
export const LiTag = styled.li` 
   list-style: none;
   padding: ${props => props.ptd} ${props => props.plr};
   height: 100%;
   svg{
      width: ${props => props.w} ;
      height: ${props => props.h} ;
      margin-top: 1.8px;
   }
   
`
export const ChatBodyContainer = styled.div` 
   height: 100%;
   width: 100%;
   background-color: #323232;
`
