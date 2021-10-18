/* eslint-disable no-underscore-dangle */
import {
  IStringKeyObject,
  TCorrectionLevel,
  TLevelVersionNumMatrix,
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
  private static readonly _maxDataMatrix: TLevelVersionNumMatrix = {
    L: [152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184, 4712, 5176, 5768, 6360, 6888,
      7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 14744, 15640, 16568, 17528, 18448, 19472, 20528, 21616, 22496, 23648],
    M: [128, 224, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920, 3320, 3624, 4056, 4504, 5016, 5352,
      5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 11640, 12328, 13048, 13800, 14496, 15312, 15936, 16816, 17728, 18672],
    Q: [104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088, 2360, 2600, 2936, 3176, 3560, 3880,
      4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368, 9848, 10288, 10832, 11408, 12016, 12656, 13328],
    H: [72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264, 2504, 2728, 3080,
      3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136, 9776, 10208],
  };

  public static get maxDataMatrix(): TLevelVersionNumMatrix {
    return MyQRCodeConstants._maxDataMatrix;
  }

  /**
   * Stores info about how many blocks data should be split into.
   *
   * Number of blocks depends on chosen "Correction level" (key of object) and QR Code Version# (index in array for each key value)
   */
  private static readonly _NumberOfBlocks: TLevelVersionNumMatrix = {
    L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8,
      8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16,
      17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20,
      23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25,
      25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  };

  public static get NumberOfBlocks(): TLevelVersionNumMatrix {
    return MyQRCodeConstants._NumberOfBlocks;
  }

  /**
   * Stores info about how many correction bytes for QR Code should be generated
   *
   * Number of blocks depends on chosen "Correction level" (key of object) and QR Code Version# (index in array for each key value)
   */
  private static readonly _NumberOfCorrectionBytes: TLevelVersionNumMatrix = {
    L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28,
      28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26,
      26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30,
      28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28,
      30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  };

  public static get NumberOfCorrectionBytes(): TLevelVersionNumMatrix {
    return MyQRCodeConstants._NumberOfCorrectionBytes;
  }

  private static readonly _GeneratingPolynomialCoefs = {
    7: [87, 229, 146, 149, 238, 102, 21],
    10: [251, 67, 46, 61, 118, 70, 64, 94, 32, 45],
    13: [74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78],
    15: [8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105],
    16: [120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120],
    17: [43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136],
    18: [215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153],
    20: [17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190],
    22: [210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231],
    24: [229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21],
    26: [173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70],
    28: [168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123],
    30: [41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180],
  };

  public static get GeneratingPolynomialCoefs() {
    return MyQRCodeConstants._GeneratingPolynomialCoefs;
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
