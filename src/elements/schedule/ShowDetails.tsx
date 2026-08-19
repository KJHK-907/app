import { ExternalLink, X } from "@tamagui/lucide-icons";
import type { ScheduleShow } from "common/api";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Paragraph, XStack, YStack, useTheme } from "tamagui";

import { formatScheduleTime } from "./ShowCard";

type ShowDetailsProps = {
  show: ScheduleShow | null;
  onClose: () => void;
};

export const ShowDetails = ({ show, onClose }: ShowDetailsProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={!!show}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <YStack f={1} jc="flex-end" accessibilityViewIsModal>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close show details"
        />
        {!!show && (
          <YStack
            maxHeight="82%"
            bg={theme.color0.val}
            borderColor={theme.color2.val}
            borderTopWidth={1}
            btlr="$8"
            btrr="$8"
            px="$4"
            pt="$4"
            pb={Math.max(insets.bottom, 16)}
            gap="$3"
          >
            <XStack ai="center" jc="space-between" gap="$3">
              <Paragraph
                f={1}
                size="$7"
                fontWeight="700"
                color={theme.color3.val}
              >
                {show.showName}
              </Paragraph>
              <Button
                circular
                chromeless
                accessibilityLabel="Close show details"
                onPress={onClose}
              >
                <X color={theme.color3.val} />
              </Button>
            </XStack>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$3" pb="$2">
                <YStack gap="$1">
                  <Paragraph size="$3" color={theme.color4.val}>
                    {show.day}
                  </Paragraph>
                  <Paragraph size="$5" color={theme.color3.val}>
                    {formatScheduleTime(show.startTime)} –{" "}
                    {formatScheduleTime(show.endTime)}
                  </Paragraph>
                </YStack>
                {!!show.djName && (
                  <YStack gap="$1">
                    <Paragraph size="$2" color={theme.color4.val}>
                      DJ / Host
                    </Paragraph>
                    <Paragraph size="$5" color={theme.color3.val}>
                      {show.djName}
                    </Paragraph>
                  </YStack>
                )}
                {!!show.genre && (
                  <YStack gap="$1">
                    <Paragraph size="$2" color={theme.color4.val}>
                      Genre
                    </Paragraph>
                    <Paragraph size="$4" color={theme.color3.val}>
                      {show.genre}
                    </Paragraph>
                  </YStack>
                )}
                {!!show.description && (
                  <YStack gap="$1">
                    <Paragraph size="$2" color={theme.color4.val}>
                      About the show
                    </Paragraph>
                    <Paragraph size="$4" color={theme.color3.val}>
                      {show.description}
                    </Paragraph>
                  </YStack>
                )}
                {!!show.linkUrl && (
                  <Button
                    mt="$2"
                    bg={theme.color2.val}
                    color={theme.color3.val}
                    icon={<ExternalLink color={theme.color3.val} size={18} />}
                    onPress={() => Linking.openURL(show.linkUrl)}
                  >
                    Show page
                  </Button>
                )}
              </YStack>
            </ScrollView>
          </YStack>
        )}
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
});
