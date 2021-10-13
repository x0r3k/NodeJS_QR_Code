import {
  IStringKeyObject, TCorrectionLevel, TMaxDataMatrix, TMaxDataValue, TRange, TDataTypeValues,
} from './interfaces';

export type TCanDataBeStoredTestData = Array<{
  dataSize: number,
  correctionLevel?: TCorrectionLevel,
  version?: number,
  expected: boolean,
}>

export type TServiceUserDataSizeTestData = Array<{
  version: number,
  dataType: TDataTypeValues,
  expected: number,
}>
