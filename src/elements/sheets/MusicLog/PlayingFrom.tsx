import { Music } from "@tamagui/lucide-icons";
import { useNowPlaying } from "common/atoms";
import { TruncatedText } from "elements/visuals";
import { memo } from "react";
import { Button, Paragraph, useTheme, XStack, YStack } from "tamagui";

export const PlayingFrom = memo(() => {
  // * region: theme ---------------
  const theme = useTheme();

  const color2 = theme.color2.get();
  const color3 = theme.color3.get();
  // *------------------------------

  // * region: hooks ----------------
  const nowPlaying = useNowPlaying();
  // *-------------------------------

  // * region: variables

  // * region: styles

  // * region: render
  return (
    <XStack f={1} gap="$4" ai="center" jc="space-between" pt="$2" px="$3">
      <YStack f={1} gap="$0.75">
        <Paragraph size="$2" col={color4}>
          Playing from
        </Paragraph>
        <TruncatedText size="$3" col={color3}>
          {nowPlaying.album}
        </TruncatedText>
      </YStack>
      <Button
        onPress={onPressOpen}
        size="$3"
        br="$5"
        bc={color2}
        color={color3}
        pressStyle={{
          backgroundColor: rippleColor,
          borderColor: rippleColor,
        }}
      >
        <Music size={16} color={color3} />
        Open
      </Button>
    </XStack>
  );
});
