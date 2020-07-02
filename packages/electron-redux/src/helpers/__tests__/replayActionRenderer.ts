import { mocked } from 'ts-jest/utils';
import { ipcRenderer } from 'electron';
import replayActionRenderer from '../replayActionRenderer';

jest.unmock('../replayActionRenderer');

const mokedIpcRenderer = mocked(ipcRenderer);

describe('replayActionRenderer', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
    };
    const payload = 123;

    replayActionRenderer(mokedIpcRenderer, store as any);

    expect(mokedIpcRenderer.on).toHaveBeenCalledTimes(1);
    expect(mokedIpcRenderer.on.mock.calls[0][0]).toBe('redux-action');
    expect(mokedIpcRenderer.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = mokedIpcRenderer.on.mock.calls[0][1];
    cb('someEvent' as any, payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
