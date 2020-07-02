import { Store } from 'redux';
import { IpcRenderer } from 'electron';

export default function replayActionRenderer(
  ipcRenderer: IpcRenderer,
  store: Store
): void {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
