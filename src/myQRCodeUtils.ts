import {
  IStringKeyObject,
  TCorrectionLevel,
  TMaxDataMatrix,
  TMaxDataValue,
  TRange,
  TDataTypeValues,
  TServiceUserDataSize,
  TVersionGroupIds,
  TVersionGroups,
  TUserDataTypes,
} from './interfaces/interfaces';

// Common utils that relateto QR Code generation flow only
export default class MyQRCodeUtils {
  // Object with codes for each allowed symbol
  public static symbolCodeDictionary: IStringKeyObject = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 18,
    J: 19,
    K: 20,
    L: 21,
    M: 22,
    N: 23,
    O: 24,
    P: 25,
    Q: 26,
    R: 27,
    S: 28,
    T: 29,
    U: 30,
    V: 31,
    W: 32,
    X: 33,
    Y: 34,
    Z: 35,
    ' ': 36,
    $: 37,
    '%': 38,
    '*': 39,
    '+': 40,
    '-': 41,
    '.': 42,
    '/': 43,
    ':': 44,
  }

  // Regex patter to check if alphanum string has non-allowed characters
  // eslint-disable-next-line no-useless-escape
  public static checkStringValidity = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-.\/:';

  /**
   * Possible correction levels of QR Code
   */
  public static readonly correctionLevel: Array<TCorrectionLevel> = ['L', 'M', 'Q', 'H'];

  /**
   * Range of QR Code versions
   */
  public static readonly versionRange: TRange = { min: 1, max: 40 };

  /**
   * Possible types of data for QR Code. Support of 'bytes' data type will be implemented in V2
   */
  public static readonly dataTypes: Array<TDataTypeValues> = ['number', 'alphanum', 'bytes'];

  /**
   * Matrix describes max data capacity (in bits) that can be inserted to QR Code
   * depends on chosen "Correction level" (key of object) and QR Code Version# (index in array for each key value)
   *
   * There are 4 Correction levels and 40 Versions of QR Code.
   * Number for each Correction-Version pair describes number of bits that can be inserted to QR Code
   *
   * Attention! This data capacity INCLUDES space for Service Data
   */
  public static readonly maxDataMatrix: TMaxDataMatrix = {
    L: [152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184, 4712, 5176, 5768, 6360, 6888,
      7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 14744, 15640, 16568, 17528, 18448, 19472, 20528, 21616, 22496, 23648],
    M: [128, 224, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920, 3320, 3624, 4056, 4504, 5016, 5352,
      5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 11640, 12328, 13048, 13800, 14496, 15312, 15936, 16816, 17728, 18672],
    Q: [104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088, 2360, 2600, 2936, 3176, 3560, 3880,
      4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368, 9848, 10288, 10832, 11408, 12016, 12656, 13328],
    H: [72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264, 2504, 2728, 3080,
      3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136, 9776, 10208],
  };

  public static readonly versionGroups: TVersionGroups = {
    1: { max: 9, min: 1 },
    2: { max: 26, min: 10 },
    3: { max: 40, min: 27 },
  }

  /**
   * Stores info about size of service data needed to be stored in QR Code.
   *
   * Size of this data depends of dataType and QR Code Version group
   */
  public static readonly serviceUserDataSize: TServiceUserDataSize = {
    number: {
      1: 10,
      2: 12,
      3: 14,
    },
    alphanum: {
      1: 9,
      2: 11,
      3: 13,
    },
    bytes: {
      1: 8,
      2: 16,
      3: 16,
    },
  }

  /**
   * Get data capacity by values of correction level and version of QR Code
   *
   * If params are out of range or value method throws error.
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns Data capacity for chosen Correction-Version pair
   */
  public static getNumberOfBits(correctionLevel: TCorrectionLevel, version: number): number {
    if (!this.correctionLevel.includes(correctionLevel)) throw new Error('Wrong correction level value');
    if (version < this.versionRange.min || version > this.versionRange.max) throw new Error('Wrong version value');
    version -= 1; // transform version value to index in array;
    if (!this.maxDataMatrix[correctionLevel][version]) throw new Error('Something went wrong');
    return this.maxDataMatrix[correctionLevel][version];
  }

  /**
   * Simple method to transform QR Code version from 'index' ('i') format
   * to 'value' ('v') format and vice versa.
   *
   * Format param defines format of first parameter - version. If format === 'i'
   * then version passed as array index and will be transformed to QR Code version value.
   * If format === 'v' then version passed as QR Code version value and will be transformed
   * to index of array
   * @param version Value of version
   * @param format Initial format of 'version' param
   * @returns version in new format
   */
  public static convertVersion(version: number, format: string = 'i'): number {
    switch (format) {
      case 'i':
        return version + 1;
      case 'v':
        return version - 1;
      default:
        return -1;
    }
  }

  /**
   * Returns the value of minimal required QR Code version to store the data.
   *
   * If correcton level param passed then returns version only for passed correction level,
   * otherwise returns version to all existing levels.
   *
   * If a varsion that fits the size of data not found then it returns -1.
   * @param dataSize Size of data in bits
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param dataType Type of user data
   * @returns
   */
  public static getVersionForDataSize(dataSize: number, correctionLevel?: TCorrectionLevel, dataType?: TDataTypeValues): TMaxDataValue {
    const result: TMaxDataValue = {};
    if (correctionLevel) {
      result[correctionLevel] = this.maxDataMatrix[correctionLevel].findIndex((item) => item >= dataSize);
    } else {
      this.correctionLevel.forEach((level) => {
        result[level] = this.maxDataMatrix[level].findIndex((item) => item >= dataSize);
      });
    }

    const resultKeys = Object.keys(result) as Array<keyof TMaxDataValue>;
    resultKeys.forEach((level) => {
      // if version not found then skip
      if (typeof result[level] === 'undefined' || result[level] === -1) return;
      // if datasize includes only user data then get service data size
      if (typeof dataType !== 'undefined') {
        // get service data for chosen version
        const serviceData = this.getServiceUserDataSize(this.convertVersion(result[level]!, 'i'), dataType);
        dataSize = dataSize + serviceData + 4; // recalc total datasize for storing
        // if version cannot store this size of data then increment version
        if (!this.canDataBeStored(dataSize, level, this.convertVersion(result[level]!, 'i'))) result[level]! += 1;
      }
      // transform version array index to normal value of version
      result[level] = this.convertVersion(result[level]!, 'i');
      // if result version is bigger than max version value - reset to -1
      if (result[level]! > this.versionRange.max) result[level] = -1;
    });
    return result;
  }

  /**
   * Checks if dataSize can be fully stored in QR Code without any loses.
   *
   * It checks either with passed parameters correctionLevel and version or for all suitable level-version pairs.
   * @param dataSize Size of data in bits
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns
   */
  public static canDataBeStored(dataSize: number, correctionLevel?: TCorrectionLevel, version?: number): boolean {
    if (correctionLevel && !this.correctionLevel.includes(correctionLevel)) throw new Error('Wrong correction level value');

    if (version && (version < this.versionRange.min || version > this.versionRange.max)) throw new Error('Wrong version value');

    const suitableVersions = this.getVersionForDataSize(dataSize);
    const resultKeys = Object.keys(suitableVersions) as Array<keyof TMaxDataValue>;

    // if passed only correction level then check if this level can store this size of data
    if (correctionLevel && !version) return suitableVersions[correctionLevel] !== -1;

    // if passed only version check existence of atleast one correction level with this level
    if (!correctionLevel && version) {
      const versionCheck = resultKeys.map((level) => suitableVersions[level]! <= version);
      return versionCheck.some((item) => item === true);
    }

    // if passed both - check that correction level with passed version can store this size of data
    if (correctionLevel && version) return suitableVersions[correctionLevel]! <= version;

    // if both were not passed - check if there atleast one correction level that can store this size of data
    if (!correctionLevel && !version) {
      const versionCheck = resultKeys.map((level) => suitableVersions[level] !== -1);
      return versionCheck.some((item) => item === true);
    }

    return false;
  }

  /**
   * Returns Id of version group
   * @param version Version of QR Code. Range 1-40
   * @returns number of version group as string or null if group was not found
   */
  public static getVersionGroup(version: number): TVersionGroupIds | null {
    const groups = Object.keys(this.versionGroups) as Array<keyof TVersionGroups>;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < groups.length; i++) {
      if (this.versionGroups[groups[i]].max >= version && this.versionGroups[groups[i]].min <= version) return groups[i];
    }
    return null;
  }

  /**
   * Get size of service data which responds for user data size
   * @param version Version of QR Code. Range 1-40
   * @param dataType Type of data for QR Code
   * @returns Size of "user's data size" service data in bytes
   */
  public static getServiceUserDataSize(version: number, dataType: TDataTypeValues): number {
    const versionGroup = this.getVersionGroup(version);
    if (!versionGroup) throw new Error('Version group not found');
    const result = this.serviceUserDataSize[dataType][versionGroup];
    if (!result) throw new Error('Service data for user data size not found');
    return result;
  }

  /**
   * Method essence is to calculate user data size in bytes
   * (DO NOT CONFUSE IT WITH BINARY USER DATA SIZE)
   *
   * If dataType 'number' or 'alphanum' then userDataSize would be amount of characters in data
   * If dataType 'bytes' then it would be number of passed bytes
   * @param dataType Type of data for QR Code
   * @param userData User data that should be stored in QR Code
   * @returns Size of user data in bytes
   */
  public static getUserDataSize(dataType: TDataTypeValues, userData: TUserDataTypes) {
    switch (dataType) {
      case 'number':
        return userData.toString(10).length;
      case 'alphanum':
        return userData.toString().length;
      case 'bytes': // will be implemented later
      default:
        return -1;
    }
  }
}
