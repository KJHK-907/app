import {
  cacheSchedule,
  fetchSchedule,
  readCachedSchedule,
  type Schedule,
} from "common/api/fetchSchedule";
import { useCallback, useEffect, useRef, useState } from "react";

export const useSchedule = () => {
  const mounted = useRef(true);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const freshSchedule = await fetchSchedule();
      if (!mounted.current) return;

      setSchedule(freshSchedule);
      setError(null);
      setStale(false);
      await cacheSchedule(freshSchedule);
    } catch (caught) {
      if (!mounted.current) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load the schedule.",
      );
      setStale((current) => current || !!schedule);
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [schedule]);

  useEffect(() => {
    mounted.current = true;

    const load = async () => {
      const cached = await readCachedSchedule();
      if (!mounted.current) return;

      if (cached) {
        setSchedule(cached);
        setLoading(false);
        setStale(true);
      }

      await refresh();
    };

    load();

    return () => {
      mounted.current = false;
    };
  }, []);

  return { schedule, loading, refreshing, stale, error, refresh };
};
