import { Constants } from "../const";
import { request } from "./__utils";
import { fetchCoverAndDuration } from "./fetchCover";

const STREAM_API = "https://kjhk.org/api/now-playing.php?q=";

export type RawNowPlayingStatus = {
  track: string;
  album: string;
  artist: string;
  length: number;
  timestampUTC: string;
  timestampCST: string;
};

export type CurrentSong = {
  title: string;
  album: {
    title: string;
    cover: string;
  };
  artist: {
    name: string;
    icon: string;
  };
  length: number;
  beganAt: number;
  endedAt: number;
  timestamp: string;
};

export type NowPlayingStatus = {
  track: string;
  album: string;
  cover: string;
  artist: string;
  length: number;
  startAt: number;
  endedAt: number;
  timestamp: string;
};

export const fetchNowPlaying = async (): Promise<NowPlayingStatus> => {
  try {
    const latestSong = await request<RawNowPlayingStatus>(`${STREAM_API}${1}`);

    return await transformStatus(latestSong, true);
  } catch (error) {
    console.log(error);

    return {
      length: 0,
      startAt: null,
      endedAt: null,
      timestamp: null,
      ...Constants.DefaultSongStatus,
    };
  }
};

export const fetchNowPlayingHistory = async (): Promise<NowPlayingStatus[]> => {
  try {
    const history = await request<RawNowPlayingStatus[]>(`${STREAM_API}${25}`);

    return await Promise.all(history.map((song) => transformStatus(song)));
  } catch (error) {
    console.log(error);

    return [];
  }
};

function convertUTCDateToLocalDate(date: Date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export const transformStatus = async (
  data: RawNowPlayingStatus,
  shouldFetchCover = false,
): Promise<NowPlayingStatus> => {
  let { track, album, artist, length, timestampUTC } = data;

  const { cover, duration, albumDup } = shouldFetchCover
    ? await fetchCoverAndDuration(artist, track, album)
    : {
        cover: null,
        duration: length,
        albumDup: album,
      };

  if (length === 0) {
    length = duration;
  }

  const localDate = convertUTCDateToLocalDate(new Date(timestampUTC));

  return {
    track: track.length
      ? track.replace(/ *\([^)]*\) */g, "").replace(/\[[^\]]*\]/g, "")
      : "Unknown Track",
    album: album.length ? album : albumDup?.length ? albumDup : "Unknown Album",
    cover,
    artist: artist.length ? artist : "Unknown Artist",
    length: length / 1000,
    startAt: Date.now(),
    endedAt: new Date(timestampUTC).getTime() + 7500 + length,
    // convert (timestampCST) to local time zone
    timestamp: localDate.toISOString(),
  };
};
