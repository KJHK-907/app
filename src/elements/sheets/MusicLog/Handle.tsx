import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Square, useTheme } from "tamagui";

const AnimatedSquare = Animated.createAnimatedComponent(Square);

export const SheetHandle = ({ animatedIndex }: BottomSheetHandleProps) => {
  // * region: theme
  const theme = useTheme();

  const color3 = theme.color3.get();

  // * region: styles
  const handleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 0.75],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scaleX: interpolate(
          animatedIndex.value,
          [0, 0.5],
          [1, 0.5],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const handleStyle = useMemo(() => {
    return [handleAnimatedStyle];
  }, [handleAnimatedStyle]);

  // * region: render
  return (
    <AnimatedSquare
      bc={color3}
      pos="absolute"
      als="center"
      h="$0.5"
      w="$4.5"
      radiused
      top={-12}
      style={handleStyle}
    />
  );
};
