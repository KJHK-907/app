import { RefreshCw, X } from "@tamagui/lucide-icons";
import { SCHEDULE_DAYS, type ScheduleDay, type ScheduleShow } from "common/api";
import { useSchedule } from "common/hooks";
import { DaySelector, ScheduleList, ShowDetails } from "elements/schedule";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Paragraph, XStack, YStack, useTheme } from "tamagui";

type ScheduleProps = {
  visible: boolean;
  onClose: () => void;
};

const getStationDay = (): ScheduleDay => {
  try {
    const day = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "America/Chicago",
    }).format(new Date());

    return SCHEDULE_DAYS.includes(day as ScheduleDay)
      ? (day as ScheduleDay)
      : "Monday";
  } catch {
    const localDay = new Date().getDay();
    return SCHEDULE_DAYS[(localDay + 6) % 7];
  }
};

export const Schedule = ({ visible, onClose }: ScheduleProps) => {
  const theme = useTheme();
  const { schedule, loading, refreshing, stale, error, refresh } =
    useSchedule();
  const [selectedDay, setSelectedDay] = useState<ScheduleDay>(getStationDay);
  const [selectedShow, setSelectedShow] = useState<ScheduleShow | null>(null);

  const shows = useMemo(
    () => schedule?.shows.filter((show) => show.day === selectedDay) ?? [],
    [schedule, selectedDay],
  );

  const close = () => {
    setSelectedShow(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={close}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.color0.val }}
        edges={["top", "right", "bottom", "left"]}
      >
        <YStack f={1} bg={theme.color0.val}>
          <XStack ai="center" jc="space-between" px="$3" py="$2" gap="$2">
            <YStack f={1}>
              <Paragraph size="$8" fontWeight="700" color={theme.color3.val}>
                Air Schedule
              </Paragraph>
              <Paragraph size="$2" color={theme.color4.val}>
                KJHK 90.7 FM · Central Time
              </Paragraph>
            </YStack>
            <Button
              circular
              chromeless
              accessibilityLabel="Refresh schedule"
              disabled={refreshing}
              opacity={refreshing ? 0.5 : 1}
              onPress={refresh}
            >
              <RefreshCw color={theme.color3.val} size={20} />
            </Button>
            <Button
              circular
              chromeless
              accessibilityLabel="Close schedule"
              onPress={close}
            >
              <X color={theme.color3.val} size={24} />
            </Button>
          </XStack>

          <YStack py="$2">
            <DaySelector
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </YStack>

          {!!schedule && !!error && (
            <XStack
              mx="$3"
              mt="$1"
              px="$3"
              py="$2"
              br="$4"
              bg={theme.color5.val}
              ai="center"
              jc="space-between"
              gap="$2"
              accessibilityRole="alert"
            >
              <Paragraph f={1} size="$2" color={theme.color4.val}>
                {stale
                  ? "Showing the last saved schedule. Pull down to try again."
                  : error}
              </Paragraph>
            </XStack>
          )}

          {loading && !schedule ? (
            <YStack f={1} ai="center" jc="center" gap="$3" px="$5">
              <ActivityIndicator color={theme.color3.val} size="large" />
              <Paragraph color={theme.color4.val}>
                Loading the schedule…
              </Paragraph>
            </YStack>
          ) : !schedule && error ? (
            <YStack f={1} ai="center" jc="center" gap="$3" px="$5">
              <Paragraph size="$6" fontWeight="700" color={theme.color3.val}>
                Schedule unavailable
              </Paragraph>
              <Paragraph ta="center" color={theme.color4.val}>
                {error}
              </Paragraph>
              <Button
                bg={theme.color2.val}
                color={theme.color3.val}
                onPress={refresh}
              >
                Try again
              </Button>
            </YStack>
          ) : (
            <YStack f={1}>
              <ScheduleList
                day={selectedDay}
                shows={shows}
                refreshing={refreshing}
                onRefresh={refresh}
                onSelectShow={setSelectedShow}
              />
            </YStack>
          )}
        </YStack>
      </SafeAreaView>

      <ShowDetails show={selectedShow} onClose={() => setSelectedShow(null)} />
    </Modal>
  );
};
