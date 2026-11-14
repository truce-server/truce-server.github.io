import { useCallback, useEffect, useState } from 'react';

// Shared across the app so each JSON file is fetched once per visit.
const pending = new Map();
const loaded = new Map();

function load(url) {
  if (loaded.has(url)) return Promise.resolve(loaded.get(url));
  if (!pending.has(url)) {
    const request = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Request for ${url} failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        loaded.set(url, data);
        return data;
      })
      .finally(() => pending.delete(url));
    pending.set(url, request);
  }
  return pending.get(url);
}

/** Starts loading a JSON file early (e.g. on hover) so it's ready when needed. */
export function prefetchJson(url) {
  load(url).catch(() => {});
}

/** The file's contents if it has already loaded this visit, otherwise null. Never starts a request. */
export const peekJson = (url) => (loaded.has(url) ? loaded.get(url) : null);

/** Loads several JSON files. Returns their contents in the same order, with null for any still on the way. */
export function useJsonAll(urls) {
  const [, refresh] = useState(0);
  const key = urls.join('\n');

  useEffect(() => {
    let active = true;
    key.split('\n').forEach((url) => {
      if (loaded.has(url)) return;
      load(url).then(() => active && refresh((count) => count + 1), () => {});
    });
    return () => {
      active = false;
    };
  }, [key]);

  return urls.map(peekJson);
}

const initialState = (url) => ({
  data: url && loaded.has(url) ? loaded.get(url) : null,
  error: null,
  loading: Boolean(url) && !loaded.has(url),
});

export function useJson(url) {
  const [state, setState] = useState(() => initialState(url));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) {
      setState(initialState(null));
      return undefined;
    }
    if (loaded.has(url)) {
      const data = loaded.get(url);
      setState((current) => (current.data === data && !current.loading ? current : initialState(url)));
      return undefined;
    }

    let active = true;
    setState({ data: null, error: null, loading: true });
    load(url).then(
      (data) => active && setState({ data, error: null, loading: false }),
      (error) => active && setState({ data: null, error, loading: false })
    );
    return () => {
      active = false;
    };
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  return { ...state, retry };
}
