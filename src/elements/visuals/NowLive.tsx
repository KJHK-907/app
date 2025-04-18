import { useStreamStatus } from "common/atoms";
import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Circle, Paragraph, useTheme, XStack } from "tamagui";

export const NowLive = () => {
  // * region: theme ---------------
  const theme = useTheme();

  const color3 = theme.color3.get();
  const color5 = theme.color5.get();

  // * region: hooks --------------
  const isLive = useStreamStatus();

  // * region: render
  return (
    <XStack px="$2.5" py="$1.5" gap="$2" ai="center" br="$10" bc={color5}>
      <PulsingCircle />
      <Paragraph size="$1" col={color3}>
        {isLive ? "ON AIR" : "OFF AIR"}
      </Paragraph>
    </XStack>
  );
};

const PulsingCircle = () => {
  // * region: hooks ----------------
  const animated = useSharedValue(0);

  // * region: effects ----------------------
  useEffect(() => {
    animated.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 1500 }),
        withTiming(0.95, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, []);

  // * region: styles ---------------------------------
  const circleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animated.value,
  }));

  const circleStyle = useMemo(() => {
    return [styles.circle, circleAnimatedStyle];
  }, [circleAnimatedStyle]);

  // * region: render ------------------------
  return <Animated.View style={circleStyle} />;
};

const styles = StyleSheet.create({
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
});
