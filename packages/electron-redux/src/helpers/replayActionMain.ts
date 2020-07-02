import { Store } from 'redux';
import { ipcMain } from 'electron';

export default function replayActionMain(store: Store): void {
  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
  ipcMain.handle('redux-get-initial-state', () =>
    JSON.stringify(store.getState())
  );
}
