import { NowPlayingStatus } from "common/api";
import { HSLColorString, hslToHex } from "common/colors";
import { Constants } from "common/const";
import { fmtMSS, fmtTimestamp } from "common/timing";
import { useState } from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  Circle,
  Image,
  Paragraph,
  Square,
  Stack,
  XStack,
  YStack,
  ZStack,
  useTheme,
} from "tamagui";

import LinearGradient from "react-native-linear-gradient";
import { MusicBars } from "./MusicBars";
import { TruncatedText } from "./SmartText";

type SongProps = {
  song: NowPlayingStatus;
  noCover?: boolean;
  isPlaying?: boolean;

  showCover?: boolean;
  nowPlaying?: boolean;
};

export const Song = ({
  song,
  noCover = false,
  isPlaying = false,
}: SongProps) => {
  const [image, setImage] = useState<string>(song.cover);
  const theme = useTheme();

  const color3 = theme.color3.get();
  const color4 = theme.color4.get();

  return (
    <XStack gap="$3" userSelect="none">
      <ZStack w={52} h={52} br="$2">
        {noCover ? (
          <Square w={52} h={52} o={0} />
        ) : (
          <Image
            source={{ uri: image }}
            onError={(error) => {
              console.log(error);
              setImage(Constants.DefaultSongStatus.cover);
            }}
            br={8}
            w={52}
            h={52}
          />
        )}
        {isPlaying && (
          <>
            <LinearGradient
              colors={[
                "hsla(0, 0%, 0%, 0.0)",
                "hsla(0, 0%, 0%, 0.0)",
                "hsla(0, 0%, 0%, 0.35)",
                "hsla(0, 0%, 0%, 0.7)",
                "hsla(0, 0%, 0%, 0.85)",
              ]}
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
              }}
              useAngle
              angle={130}
            />
            <Stack pos="absolute" r="$2" b="$2">
              <MusicBars />
            </Stack>
          </>
        )}
      </ZStack>
      <YStack f={1}>
        <XStack jc="space-between" ai="center">
          <Stack f={1} mr="$4">
            <TruncatedText size="$4" fow="700" col={color3}>
              {song.track}
            </TruncatedText>
          </Stack>
          <Paragraph userSelect="none" color={color4} size="$1">
            {fmtTimestamp(song.timestamp)}
          </Paragraph>
        </XStack>
        <XStack gap="$2" ai="center">
          <Stack>
            <TruncatedText size="$2" color={color4}>
              {song.artist}
            </TruncatedText>
          </Stack>
          {/* {song.length !== 0 && (
            <XStack gap="$2" ai="center">
              <Circle mt="$1" size={3.25} bc={color4} />
              <Paragraph color={color4} size="$2" mt="$0.75">
                {fmtMSS(~~song.length)}
              </Paragraph>
            </XStack>
          )} */}
        </XStack>
      </YStack>
    </XStack>
  );
};

const Skeleton = () => {
  const theme = useTheme();

  const color1 = theme.color2.get() as HSLColorString;
  const color2 = theme.color4.get() as HSLColorString;

  return (
    <SkeletonPlaceholder
      backgroundColor={color1}
      highlightColor={hslToHex(color2)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ width: 52, height: 52, borderRadius: 10 }} />
        <View style={{ flex: 1, gap: 4 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: 145, height: 18, borderRadius: 10 }} />
            <View style={{ width: 50, height: 18, borderRadius: 10 }} />
          </View>
          <View
            style={{
              marginTop: 6,
              width: 80,
              height: 14,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

Song.Skeleton = Skeleton;
