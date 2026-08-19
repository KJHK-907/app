import type { ScheduleDay, ScheduleShow } from "common/api";
import { FlatList, RefreshControl } from "react-native";
import { Paragraph, YStack, useTheme } from "tamagui";

import { ShowCard } from "./ShowCard";

type ScheduleListProps = {
  day: ScheduleDay;
  shows: ScheduleShow[];
  refreshing: boolean;
  onRefresh: () => void;
  onSelectShow: (show: ScheduleShow) => void;
};

export const ScheduleList = ({
  day,
  shows,
  refreshing,
  onRefresh,
  onSelectShow,
}: ScheduleListProps) => {
  const theme = useTheme();

  return (
    <FlatList
      data={shows}
      keyExtractor={(show) => show.id}
      renderItem={({ item }) => <ShowCard show={item} onPress={onSelectShow} />}
      ItemSeparatorComponent={() => <YStack h="$3" />}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 40,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.color3.val}
        />
      }
      ListEmptyComponent={
        <YStack f={1} ai="center" jc="center" px="$5" gap="$2">
          <Paragraph size="$5" fontWeight="700" color={theme.color3.val}>
            No shows scheduled
          </Paragraph>
          <Paragraph ta="center" color={theme.color4.val}>
            There are currently no programs listed for {day}.
          </Paragraph>
        </YStack>
      }
    />
  );
};
