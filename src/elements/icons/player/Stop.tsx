import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps, theme } from "../themed";

export const Stop = theme(({ fill }: IconProps) => {
  return (
    <Svg viewBox="0 0 512 512" fill={fill} width={30} height={30}>
      <Path d="M392 432H120a40 40 0 0 1-40-40V120a40 40 0 0 1 40-40h272a40 40 0 0 1 40 40v272a40 40 0 0 1-40 40z" />
    </Svg>
  );
});
