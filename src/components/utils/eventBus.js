const listeners = new Map();

export function on(event, cb) {
  if (!listeners.has(event)) listeners.set(event, []);
  listeners.get(event).push(cb);
  return () => off(event, cb);
}

export function off(event, cb) {
  const cbs = listeners.get(event) || [];
  listeners.set(event, cbs.filter(fn => fn !== cb));
}

export function emit(event, data) {
  (listeners.get(event) || []).forEach(cb => cb(data));
}
