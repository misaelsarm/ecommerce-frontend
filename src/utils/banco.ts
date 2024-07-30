import CryptoJS from "crypto-js";

function _arrayBufferToBase64(buffer: ArrayBufferLike) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64toHEX(base64: string) {
  var raw = atob(base64);
  var HEX = '';
  for (let i = 0; i < raw.length; i++) {
    var _hex = raw.charCodeAt(i).toString(16)
    HEX += (_hex.length == 2 ? _hex : '0' + _hex);
  }
  return HEX.toUpperCase();
}


function decifrarAES(cadena_cifrada: string, keyParam: string) {
  let key = CryptoJS.enc.Hex.parse(keyParam);
  let first = CryptoJS.enc.Base64.parse(cadena_cifrada); //cadena_cifrada.clone();
  let second: any = CryptoJS.enc.Base64.parse(cadena_cifrada); //cadena_cifrada;
  first.words = first.words.slice(0, 4);
  second.words = second.words.slice(4, second.length);
  console.log(cadena_cifrada);
  first.sigBytes = 16;
  second.sigBytes = second.sigBytes - 16;
  console.log(second);
  second = CryptoJS.enc.Base64.stringify(second);
  console.log(second);
  let cipherParams = {
    iv: first,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }
  let decrypted: any = CryptoJS.AES.decrypt(second, key, cipherParams);
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

function cifrarAES(data: string, keyParam: string) {
  try {
    let buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf); //Obtenermos 16 bytes
    let buffer_b64 = _arrayBufferToBase64(buf); //
    let iv = CryptoJS.enc.Hex.parse(base64toHEX(buffer_b64));

    var key = CryptoJS.enc.Hex.parse(keyParam);

    let cipherParams = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }

    let encrypted = CryptoJS.AES.encrypt(data, key, cipherParams);

    let merge: any = encrypted.iv.clone();
    merge.concat(encrypted.ciphertext);
    merge = CryptoJS.enc.Base64.stringify(merge);

    console.log({merge})
    return merge;
  } catch (error) {
    return 'Tu llave es incorrecta: ' + error;
  }
}

export {
  _arrayBufferToBase64,
  base64toHEX,
  decifrarAES,
  cifrarAES
}
/* {
  "merge": "/87yY8Hkozgktikve1+s9V1C3PQZs64nTChmq/BLpRKf+27zQ7SrSRGVpwIsm3n4kqbfS3I4WPeZ0EdEqZsbrDLzCSFMW8rNYkykEOm+/Wtu57FHqj0TyBWD4coM+EZHGEYzJsD3d4VIzBtLOZb1ol2n1u8lyD3CmMsSvsAAbdM6niQApKzeE5V/Gs4FJ+3YUoNb7qc7PU5MeBvGrDhgBI3nJdPjIWU9Oixkstd6chuVuT15Ip+qin6l6m1eydzzsWVJ2iK1o4abYZ5QAg+d+grP+Ucu8UpKumqoWEEZox1oNBEWzhBMrvRQxJ8eVojs75mF6iKrAf989JZhjx4Nm6SDRQsETkwS+HQf78YfAb6q+22PoX4cOVt1D3TbecG3uScy9CNZtFHoJe2wYVhDi3xRfR41xwKPojKT9+694H5YQW1+CTBQHoz7z5g+nak9l/3+WLJaj0/Y/weywiJpa8GcqIvZZNgUH/G7VroQGne1N7RYRlaHrhJYquJBev7czKn2LtuvRKNdS0I5OaSJiBWO9gD53jLTdK6zecfwKI3C2T9pa3JdrsxqKpEPxl3svZbjKEHHV0vV//zBb4uDEHynnTdtdRdB2kLtMG7f9pH6e/F2oLwZUT29v5FEMT8x3vvVShXOH8hhLvlCFvJJHaOXc3CYK1c9q3EjHhiN/kxGQx/3wf1G7VLGfVbYzOgskbZnzU6eNNb4p7e0mYhMeno9hGEUSmv94dUA9nUpMSWTMQ+0tW/bILTpaPwqlhB2uGZxLQBKc3x+zlNKQNL7jTXPPFX75tHPBGnWuzpee1JL+MmOWPRwmd2sGNMqb9GkRrnuzasEoe1WtvkmM99eZduhcdktAoR7kDREn0qZjd93/TGI+ruceo2FDM8fnl4GkdmOu7woLC3U9ENyWJ3LbaVczAqlcBE7tmFjG3p/kxNZ1ItNJP8x1tNI+vPSHykm/iZc1oz0YanTb+MtG2ZZaZoFD+La1J/UvnAWydf04SJHDNjS3r2eQSMNP1HKav/kRl0Jh2uEVtQzeZXgTmpnm+ovPq+6acaYVLeyDxvPwKei6+QTm/p2xEnf8asAIurW+9DhKmjJiQj5ap4lavJJ1K48hu+0qR2Yyk+IQKwNoMFDAIrALBZ2153NYL7HQWJWVWyGjSDmOYtigZty1zy3ttSW/YpErlwvwaAa/qc89ww="
} */
