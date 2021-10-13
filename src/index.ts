import MyQRCode from './myQRCode';
import MyQRCodeUtils from './myQRCodeUtils';

const data = 'HELLO';
const userBinaryData = MyQRCode.codeAlphanum(data);
console.log(MyQRCode.createStr(data));
// console.log(MyQRCode.generateServiceFields('alphanum', 4, binarySize!.length, 'H'));

// console.log(MyQRCodeUtils.getVersionForDataSize(1074, 'L', 'number'));
