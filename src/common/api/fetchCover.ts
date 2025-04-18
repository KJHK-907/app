import { Constants } from "common/const";

import { request } from "./__utils";

const ITUNES_API = "https://itunes.apple.com/search?term=";
const DEEZER_API = "https://api.deezer.com/search?q=";

const encode = (str: string) => encodeURIComponent(str).replace(/%20/g, "+");

const BACKUP_IMG = Constants.DefaultSongStatus.cover;

export const fetchCover = async (
  artist: string,
  title: string,
  album: string,
  size: "sm" | "lg" = "lg",
) => {
  const itunesUrl = `${ITUNES_API}${encode(artist)}+${encode(title)}+${encode(
    album,
  )}&limit=1`;
  const deezerUrl = `${DEEZER_API}${encode(artist)}+${encode(title)}+${encode(
    album,
  )}&limit=1`;

  try {
    const [{ results }, { data }] = await Promise.all([
      request(itunesUrl),
      request(deezerUrl),
    ]);

    if (!results.length && !data.length) {
      return BACKUP_IMG;
    }

    const [itunes, deezer] = [results[0], data[0]];

    const itunesCoverUrl = itunes?.artworkUrl60;
    const deezerCoverUrl = deezer?.cover_small;

    const coverUrl = deezerCoverUrl ?? itunesCoverUrl ?? BACKUP_IMG;

    return resizeImageUrl(coverUrl, size);
  } catch (error) {
    console.log(error);

    return BACKUP_IMG;
  }
};

export const fetchCoverAndDuration = async (
  artist: string,
  title: string,
  album: string,
  size: "sm" | "lg" = "lg",
) => {
  const itunesUrl = `${ITUNES_API}${encode(artist)}+${encode(title)}+${encode(
    album,
  )}&limit=1&entity=song`;
  const deezerUrl = `${DEEZER_API}${encode(artist)}+${encode(title)}+${encode(
    album,
  )}&limit=1`;

  try {
    const [{ results }, { data }] = await Promise.all([
      request(itunesUrl),
      request(deezerUrl),
    ]);

    if (!results.length && !data.length) {
      return {
        cover: BACKUP_IMG,
        duration: 0,
      };
    }

    const [itunes, deezer] = [results[0], data[0]];

    const itunesCoverUrl = itunes?.artworkUrl60;
    const deezerCoverUrl = deezer?.album?.cover_small;

    const itunesDuration = itunes?.trackTimeMillis;
    const deezerDuration = (deezer?.duration && deezer?.duration) || null;

    const itunesAlbum = itunes?.collectionName;
    const deezerAlbum = deezer?.album?.title;

    const coverUrl = deezerCoverUrl ?? itunesCoverUrl ?? BACKUP_IMG;

    return {
      // cover: Constants.DefaultSongStatus.cover,
      cover: resizeImageUrl(coverUrl, size),
      duration: deezerDuration ?? itunesDuration ?? 0,
      albumDup: deezerAlbum ?? itunesAlbum ?? album,
    };
  } catch (error) {
    console.log(error);

    return {
      cover: BACKUP_IMG,
      duration: 0,
      albumDup: album,
    };
  }
};

const resizeImageUrl = (url: string, size: "sm" | "lg"): string => {
  const regex = /(\d+)x(\d+)/;

  switch (size) {
    case "sm":
      return url.replace(regex, "350x350");
    case "lg":
      return url.replace(regex, "325x325");
    default:
      return url;
  }
};
