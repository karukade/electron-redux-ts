import { mocked } from 'ts-jest/utils';
import { sum } from '../module';
import { main } from '../index';

jest.unmock('../index');

const moekdSum = mocked(sum);

describe('index', () => {
  it('call sum', () => {
    main(sum);
    expect(moekdSum).toHaveBeenCalledTimes(1);
  });
});
