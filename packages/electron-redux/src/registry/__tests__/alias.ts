import alias from '../alias';

jest.unmock('../alias');

describe('alias', () => {
  describe('#set', () => {
    it('should set a value', () => {
      expect(() => {
        alias.set('abc', 123 as any);
      }).not.toThrow();
    });
  });

  describe('#get', () => {
    it('should get a value', () => {
      alias.set('abc', 123 as any);
      expect(alias.get('abc')).toEqual(123);
    });
  });
});
