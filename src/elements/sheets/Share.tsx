import { Heart } from "@tamagui/lucide-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import { Stack, useTheme } from "tamagui";

export const Share = () => {
  const theme = useTheme();

  const color3 = theme.color3.get();

  return (
    <BorderlessButton
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack role="button">
        <Heart color={color3} size={22} strokeWidth={2.5} />
      </Stack>
    </BorderlessButton>
  );
};
