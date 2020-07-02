import { mocked } from 'ts-jest/utils';
import { ipcMain, IpcMainEvent } from 'electron';
import replayActionMain from '../replayActionMain';

jest.unmock('../replayActionMain');

const mockedIpcMain = mocked(ipcMain);

describe('replayActionMain', () => {
  beforeEach(() => {
    mockedIpcMain.handle.mockClear();
  });
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };
    const payload = 123;

    replayActionMain(store as any);

    expect(mockedIpcMain.on).toHaveBeenCalledTimes(1);
    expect(mockedIpcMain.on.mock.calls[0][0]).toBe('redux-action');
    expect(mockedIpcMain.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = mockedIpcMain.on.mock.calls[0][1];
    cb({} as IpcMainEvent, payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });

  it('should handle get initial state action', () => {
    const initialState = { initial: 'state' };
    const newState = { new: 'state' };
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };

    store.getState.mockReturnValueOnce(initialState);
    store.getState.mockReturnValueOnce(newState);

    replayActionMain(store as any);

    expect(mockedIpcMain.handle).toHaveBeenCalledTimes(1);
    expect(mockedIpcMain.handle.mock.calls[0][0]).toBe(
      'redux-get-initial-state'
    );
    expect(mockedIpcMain.handle.mock.calls[0][1]).toBeInstanceOf(Function);

    const handler = mockedIpcMain.handle.mock.calls[0][1];

    expect((handler as any)()).toEqual(JSON.stringify(initialState));
    expect(store.getState).toHaveBeenCalledTimes(1);

    expect((handler as any)()).toEqual(JSON.stringify(newState));
    expect(store.getState).toHaveBeenCalledTimes(2);
  });
});
