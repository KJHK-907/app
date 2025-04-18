import { useNowPlaying, useStreamStatus } from "common/atoms";
import { Play, Stop } from "elements/icons";
import { memo, useCallback, useMemo } from "react";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import { Button, Circle, Spinner, Stack, useTheme, YStack } from "tamagui";

const Icon = memo(({ state }: { state: State }) => {
  // * region: theme ---------------
  const theme = useTheme();

  const color3 = theme.color3.get();

  if (state === State.Playing) {
    return <Stop />;
  } else if (!state || state === State.Paused || state === State.Ready) {
    return (
      <Stack ml={3}>
        <Play />
      </Stack>
    );
  } else return <Spinner size="small" color={color3} />;
});

export const Controller = () => {
  // * region: theme ---------------
  const theme = useTheme();

  const color1 = theme.color1.get();
  const color2 = theme.color2.get();

  // * region: hooks -------------------
  const { timestamp } = useNowPlaying();
  const { state } = usePlaybackState();
  const streamIsLive = useStreamStatus();

  const isLoading = useMemo(() => state !== State.Playing, [state]);
  const isPlaying = useMemo(() => state === State.Playing, [state]);

  // * region: handlers -------------------
  const onPress = useCallback(async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.stop();
      await TrackPlayer.play();
    }
  }, [isPlaying]);

  // * region: render
  return (
    <YStack ai="center">
      <Circle
        key={timestamp}
        w="$6"
        h="$6"
        br={isPlaying ? "$10" : isLoading ? "$7" : "$6"}
        animation="fast"
        pressStyle={{ backgroundColor: color2, scale: 0.95 }}
        hoverStyle={{ backgroundColor: color2 }}
        onPress={onPress}
        bc={color1}
        disabled={!streamIsLive}
        disabledStyle={{ opacity: 0.5 }}
      >
        <Icon state={state} />
      </Circle>
    </YStack>
  );
};
