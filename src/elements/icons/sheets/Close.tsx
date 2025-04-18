import Svg, { Path } from "react-native-svg";

import { IconProps, theme } from "../themed";

export const ArrowDown = theme(({ fill }: IconProps) => {
  return (
    <Svg fill={fill} width={20} height={20} viewBox="0 0 512 512">
      <Path d="m98 190.06 139.78 163.12a24 24 0 0 0 36.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" />
    </Svg>
  );
});
