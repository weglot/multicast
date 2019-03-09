// FIXME: update `ts-jest` once https://github.com/kulshekhar/ts-jest/pull/994 lands
import { mocked } from 'ts-jest/utils';
import { getDataDirectory } from '../get-data-directory.service';
import { mkdirSync, existsSync } from 'fs';

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  existsSync: jest.fn(),
}));

describe('getDataDirectory', () => {
  afterEach(() => {
    mocked(mkdirSync).mockClear();
  });

  it("creates the directory if it doesn't exist", () => {
    mocked(existsSync).mockImplementation(() => false);
    getDataDirectory();
    expect(mkdirSync).toBeCalled();
  });

  it('just returns the path if the directory already exists', () => {
    mocked(existsSync).mockImplementation(() => true);
    getDataDirectory();
    expect(mkdirSync).not.toBeCalled();
  });
});
