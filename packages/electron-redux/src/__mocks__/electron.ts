export default jest.fn();

export const webContents = {
  getAllWebContents: jest.fn(() => []),
};

export const ipcMain = {
  on: jest.fn(),
  handle: jest.fn(),
};

export const ipcRenderer = {
  on: jest.fn(),
  send: jest.fn(),
  invoke: jest.fn(),
};

export const remote = {
  getGlobal: jest.fn(),
};
