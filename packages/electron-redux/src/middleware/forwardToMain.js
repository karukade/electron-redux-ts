import validateAction from '../helpers/validateAction';

// eslint-disable-next-line consistent-return, no-unused-vars
export const forwardToMainWithParams = (params = {}) => ipcRenderer => store => next => action => {
  const { blacklist = [] } = params;
  if (!validateAction(action)) return next(action);
  if (action.meta && action.meta.scope === 'local') return next(action);

  if (blacklist.some(rule => rule.test(action.type))) {
    return next(action);
  }

  // stop action in-flight
  ipcRenderer.send('redux-action', action);
};

const forwardToMain = forwardToMainWithParams({
  blacklist: [/^@@/, /^redux-form/],
});

export default forwardToMain;
