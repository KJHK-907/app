import { SCHEDULE_DAYS, type ScheduleDay } from "common/api";
import { ScrollView } from "react-native";
import { Button, useTheme } from "tamagui";

type DaySelectorProps = {
  selectedDay: ScheduleDay;
  onSelectDay: (day: ScheduleDay) => void;
};

export const DaySelector = ({ selectedDay, onSelectDay }: DaySelectorProps) => {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      accessibilityRole="tablist"
    >
      {SCHEDULE_DAYS.map((day) => {
        const selected = day === selectedDay;

        return (
          <Button
            key={day}
            size="$3"
            br="$8"
            px="$3"
            bg={selected ? theme.color3.val : theme.color5.val}
            borderColor={selected ? theme.color3.val : theme.color2.val}
            color={selected ? theme.color0.val : theme.color3.val}
            pressStyle={{ opacity: 0.75 }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Show ${day}'s schedule`}
            onPress={() => onSelectDay(day)}
          >
            {day.slice(0, 3)}
          </Button>
        );
      })}
    </ScrollView>
  );
};
