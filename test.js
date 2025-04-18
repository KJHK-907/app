const PAGE_SIZE = 8;
const HEAD_CUT_LIMIT = 30;
const DURATION_TOLERANCE = 8;

const ACCEPTED_REGEX = /\[(\d\d):(\d\d)\.(\d{2,3})\].*/;
const BANNED_REGEX = /.+].+[:：].+/;

class KuGou {
  constructor() {
    this.useTraditionalChinese = false;
  }

  async getLyrics(title, artist, duration) {
    try {
      const keyword = this.generateKeyword(title, artist);
      const candidate = await this.getLyricsCandidate(keyword, duration);

      console.log({ keyword, candidate });

      if (candidate) {
        const lyrics = await this.downloadLyrics(
          candidate.id,
          candidate.accesskey,
        );

        console.log({ lyrics });

        return this.normalize(Buffer.from(lyrics.content, "base64").toString());
      }
      throw new Error("No lyrics candidate");
    } catch (error) {
      throw error;
    }
  }

  async getAllPossibleLyricsOptions(title, artist, duration, callback) {
    const keyword = this.generateKeyword(title, artist);
    const songs = await this.searchSongs(keyword);
    for (const song of songs.data.info) {
      if (
        duration === -1 ||
        Math.abs(song.duration - duration) <= DURATION_TOLERANCE
      ) {
        const lyricsResponse = await this.searchLyricsByHash(song.hash);
        const candidate = lyricsResponse.candidates[0];
        if (candidate) {
          const lyrics = await this.downloadLyrics(
            candidate.id,
            candidate.accesskey,
          );
          callback(
            this.normalize(Buffer.from(lyrics.content, "base64").toString()),
          );
        }
      }
    }
    const keywordLyrics = await this.searchLyricsByKeyword(keyword, duration);
    for (const candidate of keywordLyrics.candidates) {
      const lyrics = await this.downloadLyrics(
        candidate.id,
        candidate.accesskey,
      );
      callback(
        this.normalize(Buffer.from(lyrics.content, "base64").toString()),
      );
    }
  }

  async getLyricsCandidate(keyword, duration) {
    const songs = await this.searchSongs(keyword);
    for (const song of songs.data.info) {
      if (
        duration === -1 ||
        Math.abs(song.duration - duration) <= DURATION_TOLERANCE
      ) {
        const lyricsResponse = await this.searchLyricsByHash(song.hash);
        if (lyricsResponse.candidates.length > 0) {
          return lyricsResponse.candidates[0];
        }
      }
    }
    const keywordLyrics = await this.searchLyricsByKeyword(keyword, duration);
    return keywordLyrics.candidates[0];
  }

  async searchSongs(keyword) {
    const response = await fetch(
      `https://mobileservice.kugou.com/api/v3/search/song?version=9108&plat=0&pagesize=${PAGE_SIZE}&showtype=0&keyword=${encodeURIComponent(`${keyword.title} - ${keyword.artist}`)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  async searchLyricsByKeyword(keyword, duration) {
    const params = new URLSearchParams({
      ver: "1",
      man: "yes",
      client: "pc",
      keyword: `${keyword.title} - ${keyword.artist}`,
    });
    if (duration !== -1) {
      params.append("duration", duration * 1000);
    }
    const response = await fetch(`https://lyrics.kugou.com/search?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  async searchLyricsByHash(hash) {
    const response = await fetch(
      `https://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${hash}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  async downloadLyrics(id, accessKey) {
    const response = await fetch(
      `https://lyrics.kugou.com/download?fmt=lrc&charset=utf8&client=pc&ver=1&id=${id}&accesskey=${accessKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  normalizeTitle(title) {
    return title
      .replace(/\(.*\)/g, "")
      .replace(/（.*）/g, "")
      .replace(/「.*」/g, "")
      .replace(/『.*』/g, "")
      .replace(/<.*>/g, "")
      .replace(/《.*》/g, "")
      .replace(/〈.*〉/g, "")
      .replace(/＜.*＞/g, "");
  }

  normalizeArtist(artist) {
    return artist
      .replace(/, /g, "、")
      .replace(/ & /g, "、")
      .replace(/\./g, "")
      .replace(/和/g, "、")
      .replace(/\(.*\)/g, "")
      .replace(/（.*）/g, "");
  }

  generateKeyword(title, artist) {
    return {
      title: this.normalizeTitle(title),
      artist: this.normalizeArtist(artist),
    };
  }

  normalize(lyrics) {
    console.log({ lyrics });

    const lines = lyrics
      .replace(/&apos;/g, "'")
      .split("\n")
      .filter((line) => ACCEPTED_REGEX.test(line));
    let headCutLine = 0;
    for (let i = Math.min(HEAD_CUT_LIMIT, lines.length - 1); i >= 0; i--) {
      if (BANNED_REGEX.test(lines[i])) {
        headCutLine = i + 1;
        break;
      }
    }
    const filteredLines = lines.slice(headCutLine);

    let tailCutLine = 0;
    for (
      let i = Math.min(lines.length - HEAD_CUT_LIMIT, lines.length - 1);
      i >= 0;
      i--
    ) {
      if (BANNED_REGEX.test(lines[lines.length - 1 - i])) {
        tailCutLine = i + 1;
        break;
      }
    }
    const finalLines = filteredLines.slice(0, -tailCutLine);

    console.log({ finalLines });

    return finalLines.join("\n");
  }
}

module.exports = new KuGou();

(async () => {
  try {
    const kugou = new KuGou();

    const lyrics = await kugou.getLyrics("Butter", "BTS", 180);
    console.log(lyrics);
  } catch (error) {
    console.error(error);
  }
})();

const https = require("https");

const SEARCH_RESULT_START = '<a href="/lyrics/';
const SEARCH_RESULT_END = "</a>";
const SEARCH_RESULT_SYNC_TYPE_START = '<span class="lyrics-list-sync ';

class SongLyrics {
  static SyncType = {
    NONE: "NONE",
    LINE: "LINE",
    WORD: "WORD",
    fromKey: function (key) {
      switch (key) {
        case "none":
          return this.NONE;
        case "line":
          return this.LINE;
        case "word":
          return this.WORD;
        default:
          return this.NONE;
      }
    },
  };
}

class SearchResult {
  constructor(id, name, syncType, artistName, albumName) {
    this.id = id;
    this.name = name;
    this.syncType = syncType;
    this.artistName = artistName;
    this.albumName = albumName;
  }
}

function searchPetitLyrics(title, artist = null) {
  return new Promise((resolve, reject) => {
    const url = new URL("https://petitlyrics.com/search_lyrics");
    url.searchParams.append("title", title);
    if (artist) {
      url.searchParams.append("artist", artist);
    }

    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
      },
    };

    https
      .get(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const lines = data.split("\n");
          const ret = [];
          let r_id = null;
          let r_name = null;
          let r_sync_type = null;
          let r_artist_name = null;
          let r_album_name = null;

          for (const element of lines) {
            const line = element.trim();

            if (!line.startsWith(SEARCH_RESULT_START)) {
              if (
                r_id !== null &&
                r_sync_type === null &&
                line.startsWith(SEARCH_RESULT_SYNC_TYPE_START)
              ) {
                const sync_type = line.substring(
                  SEARCH_RESULT_SYNC_TYPE_START.length,
                  line.indexOf('"', SEARCH_RESULT_SYNC_TYPE_START.length),
                );
                r_sync_type = SongLyrics.SyncType.fromKey(sync_type);
              }
              continue;
            }

            const href = line.substring(
              SEARCH_RESULT_START.length,
              line.indexOf('"', SEARCH_RESULT_START.length + 1),
            );
            const end = line.indexOf(
              SEARCH_RESULT_END,
              SEARCH_RESULT_START.length + href.length,
            );

            const result_id = parseInt(href);
            if (!isNaN(result_id)) {
              if (r_id !== null) {
                ret.push(
                  new SearchResult(
                    r_id.toString(),
                    r_name,
                    r_sync_type,
                    r_artist_name,
                    r_album_name,
                  ),
                );
              } else {
                r_sync_type = null;
                r_artist_name = null;
                r_album_name = null;
              }

              r_id = result_id;
              r_name = getHtmlBody(
                line.substring(0, end + SEARCH_RESULT_END.length),
              );
            } else {
              const split = href.split("/");

              switch (split[0]) {
                case "artist":
                  r_artist_name = getHtmlBody(
                    line.substring(0, end + SEARCH_RESULT_END.length),
                  );
                  break;
                case "album":
                  r_album_name = getHtmlBody(
                    line.substring(0, end + SEARCH_RESULT_END.length),
                  );
                  break;
              }
            }
          }

          if (r_id !== null) {
            ret.push(
              new SearchResult(
                r_id.toString(),
                r_name,
                r_sync_type,
                r_artist_name,
                r_album_name,
              ),
            );
          }

          resolve(ret);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function getHtmlBody(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

module.exports = { searchPetitLyrics };

// (async () => {
//   try {
//     const results = await searchPetitLyrics("Butter", "BTS");
//     console.log(results);
//   } catch (error) {
//     console.error(error);
//   }
// })();
