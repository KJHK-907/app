import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { HSLColorObject, composePalette } from "./colors";

export const Constants = {
  NowPlayingAPI: "https://kjhk.org/api/now-playing.php?q=",
  StreamURI: "https://edge.mixlr.com/channel/ofifl",
  StreamStatusAPI: "https://api.mixlr.com/users/kjhk",
  BottomSheetHeight: 67.5,
  DefaultSongStatus: {
    cover: "https://i.imgur.com/wX8S3kW.jpg",
    track: "The Sound Alternative",
    album: "The Sound Alternative",
    artist: "KJHK 90.7 FM",
  },
  StreamOfflineStatus: {
    cover: "https://i.imgur.com/wX8S3kW.jpg",
    track: "Stream Offline",
    album: "The Sound Alternative",
    artist: "KJHK 90.7 FM",
    length: 0,
  },

  DefaultAppTheme: {
    ...composePalette({ h: 255, s: 255, l: 255 }, false),
  },
  DefaultColor: {
    h: 0,
    s: 0,
    l: 0,
  },
} as const;

enum BorderRadius {
  None,
  Light,
  Medium,
  Heavy,
}

const storage = createJSONStorage(() => AsyncStorage);

export const themeAtom = atomWithStorage("theme", true, storage);
export const shapeAtom = atomWithStorage("shape", BorderRadius.Medium, storage);
export const colorAtom = atomWithStorage<HSLColorObject>(
  "color",
  Constants.DefaultColor,
  createJSONStorage<HSLColorObject>(() => AsyncStorage),
);
