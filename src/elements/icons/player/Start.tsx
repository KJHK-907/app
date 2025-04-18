import Svg, { Path } from "react-native-svg";

import { IconProps, theme } from "../themed";

export const Play = theme(({ fill }: IconProps) => {
  return (
    <Svg viewBox="0 0 512 512" fill={fill} width={30} height={30}>
      <Path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440z" />
    </Svg>
  );
});
