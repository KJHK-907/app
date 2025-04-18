import { useNowPlaying } from "common/atoms";
import { TruncatedText } from "elements/visuals";
import { useTheme, YStack } from "tamagui";

export const Album = () => {
  // * region: theme ---------------
  const theme = useTheme();

  const color4 = theme.color4.get();
  const color3 = theme.color3.get();

  // * region: hooks ---------------
  const { album } = useNowPlaying();

  // * region: render
  return (
    <YStack f={0.95}>
      <TruncatedText size="$1" col={color4}>
        KJHK 90.7 FM
      </TruncatedText>
      <TruncatedText col={color3}>{album}</TruncatedText>
    </YStack>
  );
};
