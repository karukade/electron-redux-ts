import { IpcRenderer } from 'electron';

export default async function getInitialStateRenderer(
  ipcRenderer: IpcRenderer
): Promise<any> {
  const stateJson = await ipcRenderer
    .invoke('redux-get-initial-state')
    .catch(() => {
      throw new Error(
        'Could not find reduxState global in main process, did you forget to call replayActionMain?'
      );
    });
  return JSON.parse(stateJson);
}
