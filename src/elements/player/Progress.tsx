import { ProgressType, useNowPlaying, useProgressType } from "common/atoms";
import { fmtMSS } from "common/timing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Paragraph, Progress, Stack, XStack, styled, useTheme } from "tamagui";

const DELAY_FIX = 8;
const { min, max } = Math;

export const ProgressBar = () => {
  // * region: theme ---------------
  const theme = useTheme();

  const color1 = theme.color1.get();
  const color3 = theme.color3.get();
  const color4 = theme.color4.get();

  // * region: state --------------------------
  const interval = useRef<NodeJS.Timeout>();
  const [position, setPosition] = useState(0);

  // * region: hooks ---------------------------------------
  const { length, endedAt, timestamp } = useNowPlaying();
  const [progressType, setProgressType] = useProgressType();

  // * region: effects -----------------------------------------
  useEffect(() => {
    const updatePosition = () => {
      if (endedAt === 0 || length === 0) {
        return setPosition((value) => ~~(value + 1));
      }

      const duration = length * 1000;
      const progress = (Date.now() - endedAt + duration) / 1000;

      return setPosition(max(~~progress - DELAY_FIX, 0));
    };

    updatePosition();
    interval.current = setInterval(updatePosition, 100);

    return () => clearInterval(interval.current);
  }, [timestamp]);

  // * region: computed ----------------------------------
  const width = min((position / length) * 100, 100);

  const progress = fmtMSS(min(position, length));
  const duration = useMemo(() => {
    return progressType === ProgressType.ShowTimeRemaining
      ? `–${fmtMSS(max(length - position, 0))}`
      : fmtMSS(length);
  }, [progressType, length, position]);

  // * region: handlers ------------------------
  const updateProgressType = useCallback(() => {
    setProgressType((type) =>
      type === ProgressType.ShowTimeRemaining
        ? ProgressType.ShowTotalDuration
        : ProgressType.ShowTimeRemaining,
    );
  }, []);

  // * region: render
  return (
    <Stack key={timestamp} gap="$2">
      {/* progress bar */}
      <Progress value={length === 0 ? 1 : width} bc={color1} size="$2">
        <Progress.Indicator bc={color3} animation="slow" />
      </Progress>
      {/* current time and duration */}
      <XStack jc="space-between">
        <Timestamp col={color4} onPress={updateProgressType}>
          {length == 0 ? "--:--" : progress}
        </Timestamp>
        <Timestamp col={color4} onPress={updateProgressType}>
          {length == 0 ? "--:--" : duration}
        </Timestamp>
      </XStack>
    </Stack>
  );
};

const Timestamp = styled(Paragraph, {
  fontWeight: "$6",
  size: "$1",
});
