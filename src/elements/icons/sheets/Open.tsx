import Svg, { Path } from "react-native-svg";

import { IconProps, theme } from "../themed";

export const ArrowUp = theme(({ fill }: IconProps) => {
  return (
    <Svg fill={fill} width={20} height={20} viewBox="0 0 512 512">
      <Path d="M414 321.94 274.22 158.82a24 24 0 0 0-36.44 0L98 321.94c-13.34 15.57-2.28 39.62 18.22 39.62h279.6c20.5 0 31.56-24.05 18.18-39.62z" />
    </Svg>
  );
});
