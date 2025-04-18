import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Stack, useTheme } from "tamagui";

const AnimatedStack = Animated.createAnimatedComponent(Stack);

type Props = BottomSheetBackgroundProps;

export const SheetBackground = ({ style, animatedIndex }: Props) => {
  // * region: theme
  const theme = useTheme();

  const color0 = theme.color0.get();
  const color1 = theme.color1.get();

  // * region: styles
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animatedIndex.value,
        [0, 1],
        [color1, color0],
      ),
    };
  });

  const backgroundStyle = useMemo(() => {
    return [style, backgroundAnimatedStyle];
  }, [backgroundAnimatedStyle]);

  // * region: render
  return <AnimatedStack f={1} btlr="$7" btrr="$7" style={backgroundStyle} />;
};
