import { mocked } from 'ts-jest/utils';
import { ipcRenderer } from 'electron';
import getInitialStateRenderer from '../getInitialStateRenderer';

jest.unmock('../getInitialStateRenderer');

const mockedIpcRenderer = mocked(ipcRenderer, true);

describe('getInitialStateRenderer', () => {
  it('should return the initial state', () => {
    const state = { foo: 456 };
    mockedIpcRenderer.invoke.mockImplementation(() =>
      Promise.resolve(JSON.stringify(state))
    );
    return getInitialStateRenderer(ipcRenderer).then((initialState) =>
      expect(initialState).toEqual(state)
    );
  });
});
