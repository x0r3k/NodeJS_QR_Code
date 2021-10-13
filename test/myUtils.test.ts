/* eslint-disable no-undef */
import MyUtils from '../src/myUtils';

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

describe('"MyUtils" Class methods Test', () => {
  describe('ConvertIntToBinary method Test', () => {
    it('Should convert to binary', () => {
      expect(MyUtils.convertIntToBinary(1)).toBe('1');
      expect(MyUtils.convertIntToBinary(2)).toBe('10');
      expect(MyUtils.convertIntToBinary(7)).toBe('111');
      expect(MyUtils.convertIntToBinary(14)).toBe('1110');
    });
  });

  describe('FillBinaryString method Test', () => {
    it('Should fill with zeros', () => {
      expect(MyUtils.fillBinaryString('1', 4)).toBe('0001');
      expect(MyUtils.fillBinaryString('11001', 7)).toBe('0011001');
      expect(MyUtils.fillBinaryString('1011001', 10)).toBe('0001011001');
    });
  });
});
