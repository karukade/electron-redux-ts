export default function replayActionRenderer(ipcRenderer, store) {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
