/* eslint-disable no-underscore-dangle */
import {
  IStringKeyObject,
  TCorrectionLevel,
  TMaxDataMatrix,
  TRange,
  TDataTypeValues,
  TServiceUserDataSize,
  TVersionGroups,
} from './interfaces/interfaces';

export default class MyQRCodeConstants {
  // Object with codes for each allowed symbol
  private static readonly _symbolCodeDictionary: IStringKeyObject = {
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
  };

  public static get symbolCodeDictionary(): IStringKeyObject {
    return MyQRCodeConstants._symbolCodeDictionary;
  }

  // Regex patter to check if alphanum string has non-allowed characters
  // eslint-disable-next-line no-useless-escape
  private static readonly _checkStringValidity = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-.\/:';

  public static get checkStringValidity() {
    return MyQRCodeConstants._checkStringValidity;
  }

  /**
   * Possible correction levels of QR Code
   */
  private static readonly _correctionLevel: Array<TCorrectionLevel> = ['L', 'M', 'Q', 'H'];

  public static get correctionLevel(): Array<TCorrectionLevel> {
    return MyQRCodeConstants._correctionLevel;
  }

  private static readonly _defaultCorrectionLevel: TCorrectionLevel = 'M';

  public static get defaultCorrectionLevel(): TCorrectionLevel {
    return MyQRCodeConstants._defaultCorrectionLevel;
  }

  /**
   * Range of QR Code versions
   */
  private static readonly _versionRange: TRange = { min: 1, max: 40 };

  public static get versionRange(): TRange {
    return MyQRCodeConstants._versionRange;
  }

  /**
   * Possible types of data for QR Code. Support of 'bytes' data type will be implemented in V2
   */

  private static readonly _dataTypes: Array<TDataTypeValues> = ['number', 'alphanum', 'bytes'];

  public static get dataTypes(): Array<TDataTypeValues> {
    return MyQRCodeConstants._dataTypes;
  }

  /**
   * Matrix describes max data capacity (in bits) that can be inserted to QR Code
   * depends on chosen "Correction level" (key of object) and QR Code Version# (index in array for each key value)
   *
   * There are 4 Correction levels and 40 Versions of QR Code.
   * Number for each Correction-Version pair describes number of bits that can be inserted to QR Code
   *
   * Attention! This data capacity INCLUDES space for Service Data
   */
  private static readonly _maxDataMatrix: TMaxDataMatrix = {
    L: [152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184, 4712, 5176, 5768, 6360, 6888,
      7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 14744, 15640, 16568, 17528, 18448, 19472, 20528, 21616, 22496, 23648],
    M: [128, 224, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920, 3320, 3624, 4056, 4504, 5016, 5352,
      5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 11640, 12328, 13048, 13800, 14496, 15312, 15936, 16816, 17728, 18672],
    Q: [104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088, 2360, 2600, 2936, 3176, 3560, 3880,
      4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368, 9848, 10288, 10832, 11408, 12016, 12656, 13328],
    H: [72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264, 2504, 2728, 3080,
      3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136, 9776, 10208],
  };

  public static get maxDataMatrix(): TMaxDataMatrix {
    return MyQRCodeConstants._maxDataMatrix;
  }

  private static readonly _versionGroups: TVersionGroups = {
    1: { max: 9, min: 1 },
    2: { max: 26, min: 10 },
    3: { max: 40, min: 27 },
  };

  public static get versionGroups(): TVersionGroups {
    return MyQRCodeConstants._versionGroups;
  }

  /**
   * Stores info about size of service data needed to be stored in QR Code.
   *
   * Size of this data depends of dataType and QR Code Version group
   */
  private static readonly _serviceUserDataSize: TServiceUserDataSize = {
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
  };

  public static get serviceUserDataSize(): TServiceUserDataSize {
    return MyQRCodeConstants._serviceUserDataSize;
  }
}