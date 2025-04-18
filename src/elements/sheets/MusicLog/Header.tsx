import { memo } from "react";
import Animated from "react-native-reanimated";
import { Separator, Stack, useTheme } from "tamagui";

export const Header = memo(() => {
  // * region: theme
  const theme = useTheme();

  const color2 = theme.color2.get();
  const color3 = theme.color3.get();

  // * region: hooks

  // * region: styles

  // * region: render
  return (
    <Stack>
      <Animated.View
        pointerEvents={modal ? "none" : "auto"}
        style={[
          {
            position: "absolute",
            width: "100%",
            zIndex: 1,
          },
          headerAnimation,
        ]}
      >
        <Stack btlr={15} btrr={15} ov="hidden">
          <RectButton
            style={{
              height: bottomSheetHeightWithPadding,
            }}
            onPress={openSheet}
            rippleColor={rippleColor}
          >
            <Container h={bottomSheetHeight}>
              <Circle size="$4" />
              <Circle size="$4">
                <ArrowUp />
              </Circle>
              <BorderlessButton
                rippleColor={rippleColor}
                onPress={() => {
                  extraRef.current.present();
                }}
                rippleRadius={28}
              >
                <Button
                  chromeless
                  pressStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                  }}
                  hoverStyle={{
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                  }}
                  circular
                  w="$4"
                  h="$4"
                >
                  <MoreHorizontal color={color3} size={20} />
                </Button>
              </BorderlessButton>
            </Container>
          </RectButton>
        </Stack>
      </Animated.View>

      <Animated.View style={[headerBackAnimation]}>
        <Stack gap="$4" p="$3" pb="$-0.5">
          <Song song={nowPlaying} noCover />
          <Separator borderColor={color2} />
        </Stack>
      </Animated.View>
    </Stack>
  );
});
