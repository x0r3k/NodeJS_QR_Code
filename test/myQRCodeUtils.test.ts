/* eslint-disable no-undef */
import MyQRCodeUtils from '../src/myQRCodeUtils';
import { TCanDataBeStoredTestData, TServiceUserDataSizeTestData } from '../src/interfaces/test.interfaces';

const testData: TCanDataBeStoredTestData = [
  {
    dataSize: 1, correctionLevel: 'L', version: 1, expected: true,
  },
  {
    dataSize: 100, correctionLevel: 'L', version: 1, expected: true,
  },
  {
    dataSize: 1000, correctionLevel: 'M', version: 1, expected: false,
  },
  {
    dataSize: 100, correctionLevel: 'H', version: 1, expected: false,
  },
  {
    dataSize: 10000, correctionLevel: 'Q', version: 1, expected: false,
  },
  {
    dataSize: 1000, correctionLevel: 'L', expected: true,
  },
  {
    dataSize: 25000, correctionLevel: 'L', expected: false,
  },
  {
    dataSize: 1000, version: 6, expected: true,
  },
  {
    dataSize: 1000, version: 2, expected: false,
  },
  {
    dataSize: 1000, expected: true,
  },
  {
    dataSize: 25000, expected: false,
  },
];

const versionGroupsTestData = [
  { version: 1, expected: '1' },
  { version: 9, expected: '1' },
  { version: 10, expected: '2' },
  { version: 27, expected: '3' },
  { version: 40, expected: '3' },
  { version: 0, expected: null },
  { version: 41, expected: null },
];

const serviceUserDataSizeTestData: TServiceUserDataSizeTestData = [
  { version: 1, dataType: 'number', expected: 10 },
  { version: 30, dataType: 'alphanum', expected: 13 },
  { version: 20, dataType: 'number', expected: 12 },
  { version: 40, dataType: 'alphanum', expected: 13 },
];

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

describe('"MyQRCodeUtils" Class methods Test', () => {
  describe('GetNumberOfBits method Test', () => {
    it('Should get bit size by level and version', () => {
      expect(MyQRCodeUtils.getNumberOfBits('H', 1)).toBe(72);
      expect(MyQRCodeUtils.getNumberOfBits('L', 10)).toBe(2192);
      expect(MyQRCodeUtils.getNumberOfBits('M', 20)).toBe(5352);
      expect(MyQRCodeUtils.getNumberOfBits('Q', 30)).toBe(7880);
      expect(MyQRCodeUtils.getNumberOfBits('H', 40)).toBe(10208);
    });
  });

  describe('GetVersionForDataSize method Test', () => {
    it('Should return version for total datasize', () => {
      expect(MyQRCodeUtils.getVersionForDataSize(1000, 'L')).toEqual({ L: 6 });
      expect(MyQRCodeUtils.getVersionForDataSize(1000, 'M')).toEqual({ M: 8 });
      expect(MyQRCodeUtils.getVersionForDataSize(1000, 'Q')).toEqual({ Q: 9 });
      expect(MyQRCodeUtils.getVersionForDataSize(1000, 'H')).toEqual({ H: 11 });
      expect(MyQRCodeUtils.getVersionForDataSize(100)).toEqual({
        L: 1, M: 1, Q: 1, H: 2,
      });
      expect(MyQRCodeUtils.getVersionForDataSize(5000)).toEqual({
        L: 17, M: 19, Q: 24, H: 27,
      });
    });
    it('Should return version for only user datasize and datatype \'number\'', () => {
      expect(MyQRCodeUtils.getVersionForDataSize(1087, 'L', 'number')).toEqual({ L: 7 });
      expect(MyQRCodeUtils.getVersionForDataSize(1078, 'L', 'number')).toEqual({ L: 7 });
      expect(MyQRCodeUtils.getVersionForDataSize(1074, 'L', 'number')).toEqual({ L: 6 });
      expect(MyQRCodeUtils.getVersionForDataSize(368, 'H', 'alphanum')).toEqual({ H: 6 });
      expect(MyQRCodeUtils.getVersionForDataSize(1078, 'H', 'alphanum')).toEqual({ H: 11 });
      expect(MyQRCodeUtils.getVersionForDataSize(3248, 'H', 'alphanum')).toEqual({ H: 22 });
    });
  });

  describe('CanDataBeStored method Test', () => {
    it.each(testData)('Check if datasize $dataSize fits to QR Code with $correctionLevel and $version params',
      ({
        dataSize, correctionLevel, version, expected,
      }) => {
        expect(MyQRCodeUtils.canDataBeStored(dataSize, correctionLevel, version)).toBe(expected);
      });
  });

  describe('GetVersionGroup method Test', () => {
    it.each(versionGroupsTestData)('Check if version $version relates to group $expected',
      ({ version, expected }) => {
        expect(MyQRCodeUtils.getVersionGroup(version)).toBe(expected);
      });
  });

  describe('GetServiceUserDataSize method Test', () => {
    it.each(serviceUserDataSizeTestData)('Version $version and data type $dataType should return $expected bits',
      ({ version, dataType, expected }) => {
        expect(MyQRCodeUtils.getServiceUserDataSize(version, dataType)).toBe(expected);
      });
  });

  describe('ConvertVersion method Test', () => {
    it('Should convert format of version', () => {
      expect(MyQRCodeUtils.convertVersion(10, 'v')).toBe(11);
      expect(MyQRCodeUtils.convertVersion(10, 'i')).toBe(9);
    });
  });
});
