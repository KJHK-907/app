import { useNowPlaying } from "common/atoms";
import { TruncatedText } from "elements/visuals";
import TextTicker from "react-native-text-ticker";
import { H3, useTheme, YStack } from "tamagui";

export const NowPlaying = () => {
  // * region: theme -----------------------
  const theme = useTheme();

  const color3 = theme.color3.get();
  const color4 = theme.color4.get();

  // * region: hooks -----------------------
  const { track, artist } = useNowPlaying();

  // * region: render
  return (
    <YStack f={1}>
      <TextTicker bounce={false} scrollSpeed={45} scroll={false}>
        <H3 fow="$12" col={color3}>
          {track}
        </H3>
      </TextTicker>
      <TruncatedText col={color4}>{artist}</TruncatedText>
    </YStack>
  );
};
