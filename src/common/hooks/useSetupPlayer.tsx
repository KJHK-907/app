import { Constants } from "common/const";
import { useEffect, useState } from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from "react-native-track-player";

export const useSetupPlayer = () => {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) return;
      setPlayerReady(true);
      const queue = await TrackPlayer.getQueue();
      if (unmounted) return;
      if (queue.length <= 0) {
        await QueueInitialTracksService();
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);

  return playerReady;
};

const setupPlayer = async (
  options?: Parameters<typeof TrackPlayer.setupPlayer>[0],
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options).catch(() => {});
    } catch (error) {
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === "android_cannot_setup_player_in_background") {
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }
};

const SetupService = async () => {
  await setupPlayer();
  await TrackPlayer.updateOptions({
    progressUpdateEventInterval: 5,
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      alwaysPauseOnInterruption: true,
    },
    capabilities: [Capability.Play, Capability.Pause],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
};

const QueueInitialTracksService = async (): Promise<void> => {
  const track = {
    url: Constants.StreamURI,
    isLiveStream: true,
    title: "The Sound Alternative",
    artist: "KJHK 90.7 FM",
    artwork: "https://i.imgur.com/dG2mh79.png",
    duration: 0,
  };

  await TrackPlayer.add([track]);
};
