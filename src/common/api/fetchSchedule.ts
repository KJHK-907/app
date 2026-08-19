import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "common/const";

export const SCHEDULE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type ScheduleDay = (typeof SCHEDULE_DAYS)[number];

export type ScheduleShow = {
  id: string;
  day: ScheduleDay;
  startTime: string;
  endTime: string;
  showName: string;
  djName?: string;
  description?: string;
  genre?: string;
  linkUrl?: string;
};

export type Schedule = {
  version: number;
  timezone: string;
  updatedAt: string;
  shows: ScheduleShow[];
};

type CachedSchedule = {
  cacheVersion: number;
  schedule: Schedule;
};

type UnknownRecord = Record<string, unknown>;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const REQUEST_TIMEOUT_MS = 10000;

const isRecord = (value: unknown): value is UnknownRecord =>
  !!value && typeof value === "object" && !Array.isArray(value);

const optionalString = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const normalizeDay = (value: unknown): ScheduleDay | null => {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return (
    SCHEDULE_DAYS.find(
      (day) =>
        day.toLowerCase() === normalized ||
        day.slice(0, 3).toLowerCase() === normalized,
    ) ?? null
  );
};

export const timeToMinutes = (time: string) => {
  const match = TIME_PATTERN.exec(time);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

const durationInMinutes = (startTime: string, endTime: string) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null) return null;

  const duration = end > start ? end - start : 24 * 60 - start + end;
  return duration;
};

const normalizeShow = (value: unknown, index: number): ScheduleShow | null => {
  if (!isRecord(value)) return null;

  const day = normalizeDay(value.day);
  const startTime = optionalString(value.startTime);
  const endTime = optionalString(value.endTime);
  const showName = optionalString(value.showName);

  if (!day || !startTime || !endTime || !showName) return null;

  const duration = durationInMinutes(startTime, endTime);
  if (duration === null || duration < 60 || duration % 60 !== 0) return null;

  const id =
    optionalString(value.id) ?? `${day}-${startTime}-${showName}-${index}`;
  const linkUrl = optionalString(value.linkUrl);

  return {
    id,
    day,
    startTime,
    endTime,
    showName,
    djName: optionalString(value.djName),
    description: optionalString(value.description),
    genre: optionalString(value.genre),
    linkUrl: linkUrl?.startsWith("https://") ? linkUrl : undefined,
  };
};

const sameShow = (left: ScheduleShow, right: ScheduleShow) =>
  left.day === right.day &&
  left.showName.trim().toLowerCase() === right.showName.trim().toLowerCase() &&
  (left.djName ?? "").trim().toLowerCase() ===
    (right.djName ?? "").trim().toLowerCase() &&
  (left.description ?? "").trim() === (right.description ?? "").trim() &&
  (left.genre ?? "").trim().toLowerCase() ===
    (right.genre ?? "").trim().toLowerCase();

/** Combines repeated hourly rows for the same show into one continuous block. */
export const coalesceScheduleShows = (shows: ScheduleShow[]) => {
  const sorted = [...shows].sort((left, right) => {
    const dayDifference =
      SCHEDULE_DAYS.indexOf(left.day) - SCHEDULE_DAYS.indexOf(right.day);
    if (dayDifference) return dayDifference;
    return left.startTime.localeCompare(right.startTime);
  });

  return sorted.reduce<ScheduleShow[]>((combined, show) => {
    const previous = combined[combined.length - 1];

    if (
      previous &&
      sameShow(previous, show) &&
      (previous.endTime === show.startTime ||
        (previous.startTime === show.startTime &&
          previous.endTime === show.endTime))
    ) {
      if (previous.endTime === show.startTime) previous.endTime = show.endTime;
      return combined;
    }

    combined.push({ ...show });
    return combined;
  }, []);
};

export const normalizeSchedule = (value: unknown): Schedule => {
  const response = isRecord(value) ? value : {};
  const rawShows = Array.isArray(value)
    ? value
    : Array.isArray(response.shows)
      ? response.shows
      : [];

  const shows = coalesceScheduleShows(
    rawShows
      .map((show, index) => normalizeShow(show, index))
      .filter((show): show is ScheduleShow => !!show),
  );

  return {
    version: typeof response.version === "number" ? response.version : 1,
    timezone:
      typeof response.timezone === "string"
        ? response.timezone
        : "America/Chicago",
    updatedAt:
      typeof response.updatedAt === "string"
        ? response.updatedAt
        : new Date().toISOString(),
    shows,
  };
};

export const fetchSchedule = async (): Promise<Schedule> => {
  if (!Constants.ScheduleAPI) {
    throw new Error("The schedule API URL has not been configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(Constants.ScheduleAPI, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Schedule request failed (${response.status}).`);
    }

    return normalizeSchedule(await response.json());
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The schedule request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const readCachedSchedule = async (): Promise<Schedule | null> => {
  try {
    const stored = await AsyncStorage.getItem(Constants.ScheduleCacheKey);
    if (!stored) return null;

    const cached = JSON.parse(stored) as CachedSchedule;
    if (cached.cacheVersion !== Constants.ScheduleCacheVersion) return null;

    return normalizeSchedule(cached.schedule);
  } catch {
    return null;
  }
};

export const cacheSchedule = async (schedule: Schedule) => {
  const cached: CachedSchedule = {
    cacheVersion: Constants.ScheduleCacheVersion,
    schedule,
  };

  await AsyncStorage.setItem(
    Constants.ScheduleCacheKey,
    JSON.stringify(cached),
  );
};
