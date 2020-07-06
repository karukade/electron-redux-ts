import { Store } from 'redux';
import { IpcMain } from 'electron';

export default function replayActionMain(ipcMain: IpcMain, store: Store): void {
  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
  ipcMain.handle('redux-get-initial-state', () =>
    JSON.stringify(store.getState())
  );
}
