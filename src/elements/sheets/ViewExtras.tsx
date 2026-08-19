import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  AlarmClock,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  HeartPulse,
  Moon,
  Radio,
  Sun,
} from "@tamagui/lucide-icons";
import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { useNowPlaying } from "common/atoms";
import { themeAtom } from "common/const";
import { useAtom } from "jotai";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type FC,
  type ForwardedRef,
} from "react";
import { Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ListItem,
  Separator,
  Square,
  Switch,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

import { Song } from "../visuals/Song";

type ViewExtraProps = {
  onOpenSchedule: () => void;
};

const links = [
  // {
  //   name: "Request Line",
  //   icon: PhoneCall,
  //   url: "tel:7858644747",
  // },
  {
    name: "Donate",
    icon: HeartPulse,
    url: "https://kjhk.org/donate",
  },
  {
    name: "Website",
    icon: Radio,
    url: "https://kjhk.org",
  },
];

const ViewExtraContent = (
  { onOpenSchedule }: ViewExtraProps,
  ref: ForwardedRef<BottomSheetModal>,
) => {
  const sleepTimerSheetRef = useRef<BottomSheetModal>(null);

  const [isDarkMode, setIsDarkMode] = useAtom(themeAtom);

  const animationValue = useSharedValue(-1);

  const song = useNowPlaying();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const color0 = theme.color0.get();
  const color2 = theme.color2.get();
  const color3 = theme.color3.get();
  const color4 = theme.color4.get();

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="collapse"
        />
      </>
    );
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
  };

  const songComponent = useMemo(() => {
    return (
      <YStack gap="$4" p="$3" pb="$1">
        <Song key={song.cover} song={song} isPlaying />
        <Separator borderColor={color2} />
      </YStack>
    );
  }, [song.cover, song.timestamp, theme]);

  const toast = useToastController();

  const CurrentToast = () => {
    const currentToast = useToastState();

    if (!currentToast || currentToast.isHandledNatively) return null;
    return (
      <Toast
        key={currentToast.id}
        duration={currentToast.duration}
        enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        y={0}
        opacity={1}
        scale={1}
        animation="fast"
        bc="white"
        viewportName={currentToast.viewportName}
      >
        <YStack>
          {/* <Toast.Title>{currentToast.title}</Toast.Title> */}
          {!!currentToast.message && (
            <XStack gap="$1">
              <Toast.Description>{currentToast.message}</Toast.Description>
            </XStack>
          )}
        </YStack>
      </Toast>
    );
  };

  const rippleColor = color3.replace("hsl", "hsla").replace(")", `, ${0.75})`);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        enablePanDownToClose
        topInset={insets.top}
        backgroundStyle={{
          backgroundColor: color0,
        }}
        backdropComponent={renderBackdrop}
        animatedIndex={animationValue}
        handleComponent={SheetHandle}
      >
        <BottomSheetView style={{ flex: 1, paddingBottom: insets.bottom }}>
          {songComponent}
          <YStack gap="$1.5">
            {/* Theme Toggle */}
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={isDarkMode ? Sun : Moon}
            >
              {`Toggle ${isDarkMode ? "Light" : "Dark"} Mode`}
              <Switch
                size="$2"
                checked={!!isDarkMode}
                onCheckedChange={toggleDarkMode}
                bc={color2}
                borderColor={color2}
              >
                <Switch.Thumb animation="fast" bc={color3} />
              </Switch>
            </ListItem>
            {/* Sleep Timer */}
            <RectButton
              rippleColor="rgba(255, 255, 255, 0.15)"
              underlayColor={color4}
              activeOpacity={0.1}
              onPress={() => sleepTimerSheetRef.current?.present()}
            >
              <ListItem
                transparent
                scaleIcon={1.125}
                color={color3}
                icon={AlarmClock}
                iconAfter={<ChevronRight color={color4} />}
              >
                Sleep Timer
              </ListItem>
            </RectButton>

            {/* Air Schedule */}
            <RectButton
              rippleColor={rippleColor}
              underlayColor={color4}
              activeOpacity={0.1}
              onPress={onOpenSchedule}
            >
              <ListItem
                color={color3}
                transparent
                scaleIcon={1.125}
                icon={Calendar}
                iconAfter={<ChevronRight color={color4} />}
              >
                Air Schedule
              </ListItem>
            </RectButton>

            {/* Links */}
            {links.map(({ name, icon, url }) => (
              <RectButton
                key={name}
                rippleColor={rippleColor}
                underlayColor={color4}
                activeOpacity={0.1}
                onPress={() => Linking.openURL(url)}
              >
                <ListItem
                  color={color3}
                  transparent
                  scaleIcon={1.125}
                  icon={icon}
                  iconAfter={<ExternalLink color={color4} />}
                >
                  {name}
                </ListItem>
              </RectButton>
            ))}
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>

      <CurrentToast />

      {/* Sleep Timer Modal */}
      <BottomSheetModal
        ref={sleepTimerSheetRef}
        enablePanDownToClose
        topInset={insets.top}
        backgroundStyle={{
          backgroundColor: color0,
        }}
        backdropComponent={renderBackdrop}
        animatedIndex={animationValue}
        handleComponent={SheetHandle}
      >
        <BottomSheetView style={{ flex: 1, paddingBottom: insets.bottom }}>
          <YStack gap="$1.5">
            <RectButton
              rippleColor="rgba(255, 255, 255, 0.15)"
              underlayColor={color4}
              onPress={() => {
                toast.show("Success", {
                  message: "Sleep Timer turned off",
                  duration: 2000,
                });
              }}
            >
              <ListItem
                transparent
                scaleIcon={1.125}
                color={color3}
                icon={Check}
              >
                Off
              </ListItem>
            </RectButton>

            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              10 Minutes
            </ListItem>
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              15 Minutes
            </ListItem>
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              30 Minutes
            </ListItem>
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              45 Minutes
            </ListItem>
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              1 Hour
            </ListItem>
            <ListItem
              transparent
              scaleIcon={1.125}
              color={color3}
              icon={Square}
            >
              End of song
            </ListItem>
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export const ViewExtra = forwardRef(ViewExtraContent);

const SheetHandle: FC<BottomSheetHandleProps> = ({ animatedIndex }) => {
  const theme = useTheme();

  const handleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [-1, -0.75],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scaleX: interpolate(
            animatedIndex.value,
            [-1, -0.5],
            [0, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          backgroundColor: theme.color3.val,
          height: 4,
          width: 45,
          borderRadius: 3,
          alignSelf: "center",
          top: -10,
        },
        handleAnimatedStyle,
      ]}
    />
  );
};
