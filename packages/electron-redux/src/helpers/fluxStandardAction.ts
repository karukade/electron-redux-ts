export type FsaType = {
  type?: string;
  payload?: { [key: string]: any };
  error?: boolean | null;
  meta?: { [key: string]: any };
};

function isValidKey(key: string) {
  return ['type', 'payload', 'error', 'meta'].includes(key);
}

export function isFSA(action: FsaType): boolean {
  return (
    typeof action === 'object' &&
    !Array.isArray(action) &&
    typeof action.type === 'string' &&
    Object.keys(action).every(isValidKey)
  );
}

export function isError(action: FsaType): boolean {
  return isFSA(action) && action.error === true;
}
