import type { ScheduleShow } from "common/api";
import { Pressable } from "react-native";
import { Paragraph, XStack, YStack, useTheme } from "tamagui";

export const formatScheduleTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

type ShowCardProps = {
  show: ScheduleShow;
  onPress: (show: ScheduleShow) => void;
};

export const ShowCard = ({ show, onPress }: ShowCardProps) => {
  const theme = useTheme();
  const timeRange = `${formatScheduleTime(show.startTime)} to ${formatScheduleTime(show.endTime)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${show.showName}, ${timeRange}${show.djName ? `, hosted by ${show.djName}` : ""}`}
      accessibilityHint="Opens show details"
      onPress={() => onPress(show)}
      style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
    >
      <XStack
        bg={theme.color5.val}
        borderColor={theme.color2.val}
        borderWidth={1}
        br="$5"
        ov="hidden"
        minHeight={92}
      >
        <YStack w={6} bg={theme.color3.val} />
        <YStack w={98} px="$3" py="$3" jc="center">
          <Paragraph size="$3" fontWeight="700" color={theme.color3.val}>
            {formatScheduleTime(show.startTime)}
          </Paragraph>
          <Paragraph size="$2" color={theme.color4.val}>
            {formatScheduleTime(show.endTime)}
          </Paragraph>
        </YStack>
        <YStack f={1} py="$3" pr="$3" jc="center" gap="$1">
          <Paragraph
            size="$5"
            fontWeight="700"
            color={theme.color3.val}
            numberOfLines={2}
          >
            {show.showName}
          </Paragraph>
          {!!show.djName && (
            <Paragraph size="$3" color={theme.color4.val} numberOfLines={1}>
              {show.djName}
            </Paragraph>
          )}
          {!!show.genre && (
            <Paragraph size="$2" color={theme.color4.val} numberOfLines={1}>
              {show.genre}
            </Paragraph>
          )}
        </YStack>
      </XStack>
    </Pressable>
  );
};
