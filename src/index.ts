import MyQRCode from './myQRCode';
import MyQRCodeUtils from './myQRCodeUtils';

const data = 'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH';
const binarySize = MyQRCode.codeString(data);

console.log(MyQRCode.codeString(data)!.length);
console.log(MyQRCode.generateServiceFields('alphanum', 4, binarySize!.length, 'H'));

// console.log(MyQRCodeUtils.getVersionForDataSize(1074, 'L', 'number'));
