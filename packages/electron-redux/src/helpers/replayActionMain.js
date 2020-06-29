import { ipcMain } from 'electron';

export default function replayActionMain(store) {
  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
  ipcMain.handle('redux-get-initial-state', () => JSON.stringify(store.getState()));
}
