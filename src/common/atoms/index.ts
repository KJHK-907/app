import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { NowPlayingStatus, request, transformStatus } from "common/api";
import { getDominantColor } from "common/colors";
import { Constants, colorAtom } from "common/const";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomEffect } from "jotai-effect";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

export enum ProgressType {
  ShowTotalDuration,
  ShowTimeRemaining,
}

const storage = createJSONStorage<ProgressType>(() => AsyncStorage);
export const progressTypeAtom = atomWithStorage<ProgressType>(
  "progressType",
  ProgressType.ShowTimeRemaining,
  storage,
);

export const useProgressType = () => useAtom(progressTypeAtom);

const streamStatusAtom = atom(true);

const streamStatusEffect = atomEffect((get, set) => {
  const fetchStreamStatus = async () => {
    const json = await request(Constants.StreamStatusAPI);

    set(streamStatusAtom, json.is_live);
  };

  fetchStreamStatus();
  const interval = setInterval(fetchStreamStatus, 10000);

  return () => clearInterval(interval);
});

export const streamIsLiveAtom = atom((get) => {
  get(streamStatusEffect);

  return get(streamStatusAtom);
});

export const useStreamStatus = () => useAtomValue(streamIsLiveAtom);

const nowPlayingLoaded = atom(false);

export const nowPlayingAtom = atom<NowPlayingStatus>({
  ...(Constants.DefaultSongStatus as NowPlayingStatus),
});

const serverIP = "202.61.248.176";
const targetEndpoint = "metadata";
const websocketURL = `ws://${serverIP}/api/?target=${targetEndpoint}`;

export type RawNowPlaying = {
  track: string;
  type: "SONG" | "LINK";
  album: string;
  artist: string;
  length: number;
  timestampUTC: string;
};

// using websockets
const nowPlayingStatusEffect = atomEffect((get, set) => {
  const ws = new WebSocket(websocketURL);

  ws.onopen = async () => {
    console.log("onopen");
  };

  ws.onmessage = async (event) => {
    if (!get(streamIsLiveAtom)) {
      return set(nowPlayingAtom, Constants.StreamOfflineStatus);
    }

    const data = JSON.parse(event.data);

    console.log({ data });

    if (data.type === "LINK") {
      return set(nowPlayingAtom, {
        ...data,
        ...Constants.DefaultSongStatus,
      });
    }

    const track = await transformStatus(data, true);
    const color = await getDominantColor(track.cover);

    const initialFetch = get(nowPlayingLoaded);

    if (!initialFetch) {
      set(colorAtom, color);
      set(nowPlayingAtom, track);
      set(nowPlayingLoaded, true);
    } else {
      setTimeout(() => {
        set(colorAtom, color);
        set(nowPlayingAtom, track);
      }, 15010);
    }
  };

  ws.onclose = () => {
    set(nowPlayingLoaded, true);
    console.log("onclose");
  };

  return () => ws.close();
});

export const useNowPlayingLoaded = () => useAtomValue(nowPlayingLoaded);

const nowPlayingEffectAtom = atom((get) => {
  get(nowPlayingStatusEffect);

  return get(nowPlayingAtom);
});

export const useNowPlaying = () => useAtomValue(nowPlayingEffectAtom);

export const bottomSheetOpenAtom = atom(false);

export const useBottomSheetOpen = () => useAtomValue(bottomSheetOpenAtom);
export const setBottomSheetOpen = (open: boolean) =>
  useSetAtom(bottomSheetOpenAtom)(open);

const internetConnectionAtom = atom(true);

export const internetConnectionEffect = atomEffect((get, set) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    set(internetConnectionAtom, state.isConnected);
  });

  return unsubscribe;
});

export const useInternetConnection = () => useAtomValue(internetConnectionAtom);
