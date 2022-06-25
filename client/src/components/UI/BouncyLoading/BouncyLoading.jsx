import React from "react";
import styled from "styled-components";

const BouncyLoading = ({ height, width, translateY1, translateY2 }) => {
  return (
    <Loader height={height} width={width}>
      <Ball translateY1={translateY1} translateY2={translateY2}></Ball>
      <Ball translateY1={translateY1} translateY2={translateY2}></Ball>
      <Ball translateY1={translateY1} translateY2={translateY2}></Ball>
    </Loader>
  );
};

export default BouncyLoading;

const Loader = styled.div`
  /* width: 80px; */
  /* height: 55px; */
  width: ${({ width }) => (width ? width : "80px")};
  height: ${({ height }) => (height ? height : "55px")};

  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-evenly;
`;

const Ball = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  transform: translateY(-15px);
  animation: bounce 0.5s alternate infinite;
  &:nth-child(2) {
    animation-delay: 0.16s;
  }
  &:nth-child(3) {
    animation-delay: 0.32s;
  }
  @keyframes bounce {
    from {
      /* transform: translateY(-12px) scaleX(1.15); */
      /* transform: translateY(-2px) scaleX(1.15); */
      transform: translateY(
          ${({ translateY1 }) => (translateY1 ? translateY1 : "-12px")}
        )
        scaleX(1.15);
    }
    to {
      /* transform: translateY(-35px) scaleX(1); */
      /* transform: translateY(-15px) scaleX(1); */

      transform: translateY(
          ${({ translateY2 }) => (translateY2 ? translateY2 : "-35px")}
        )
        scaleX(1);
    }
  }
`;
