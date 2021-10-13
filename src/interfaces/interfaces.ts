/* eslint-disable no-unused-vars */
import MyQRCodeUtils from '../myQRCodeUtils';

export interface IStringKeyObject {
  [key: string]: number
}

export type TCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type TDataTypeValues = 'number' | 'alphanum' | 'bytes';

export type TVersionGroupIds = '1' | '2' | '3';

export type TMaxDataMatrix = {[K in TCorrectionLevel]: Array<number>};

export type TMaxDataValue = {[K in TCorrectionLevel]?: number};

export type TRange = { max: number, min: number };

export type TServiceUserDataSize = {
  [K in (typeof MyQRCodeUtils.dataTypes)[number]]: {
    [key in TVersionGroupIds]: number
  }
}

export type TVersionGroups = {
  [K in TVersionGroupIds]: TRange
}

export type TUserDataTypes = number | string;

export type TQRCodeOptions = {
  version?: number,
  correctionLevel?: TCorrectionLevel
}
