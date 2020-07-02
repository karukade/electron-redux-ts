import { Middleware } from 'redux';
import { IpcRenderer } from 'electron';
import validateAction from '../helpers/validateAction';

export const forwardToMainWithParams = (
  params: { blacklist?: RegExp[] } = {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (ipcRenderer: IpcRenderer): Middleware => (store) => (next) => (
  action
) => {
  const { blacklist = [] } = params;
  if (!validateAction(action)) return next(action);
  if (action.meta && action.meta.scope === 'local') return next(action);

  if (blacklist.some((rule) => rule.test(action.type))) {
    return next(action);
  }

  // stop action in-flight
  ipcRenderer.send('redux-action', action);
};

const forwardToMain = forwardToMainWithParams({
  blacklist: [/^@@/, /^redux-form/],
});

export default forwardToMain;
