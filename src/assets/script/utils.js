import axios from "../../config/http"

function getToken(key) {
  return new Promise((resolve, reject) => {
    axios.post('/v1/mediastore/getUpToken', {
      zone: 1,
      key
    }).then(resp => {
      if (resp.data.code == '00000') {
        resolve(resp.data)
      } else {
        reject(resp.data)
      }
    })
  })
}

function testMobile(tel) {
  let telReg = /^(13[0-9]|14[57]|15[0-35-9]|17[67]|18[07-9])\d{8}$/
  return telReg.test(tel)
}

function testPassword(pwd) {
  let pwdReg = /^[A-Za-z0-9]{6,20}$/
  return pwdReg.test(pwd)
}

function testMsgCode(code) {
  let msgCodeReg = /\d{4}/
  return msgCodeReg.test(code)
}

function isISBNFormat(isbn) {
  if (isbn.length === 13) {
    return /^978\d{10}$/.test(isbn)
  } else {
    return /^\d{10}$/.test(isbn)
  }
}

// 金额由“分”转换成“元”
function priceFloat(price) {
  return parseFloat(price / 100).toFixed(2)
}

// 金额由“元”转换成“分”
function priceInt(price) {
  return parseInt(price * 100)
}

// 判断两个对象是否相等
function isObjectValueEqual(a, b) {
  return JSON.stringify(a) == JSON.stringify(b);
}

export {
  getToken,
  testMobile,
  testPassword,
  testMsgCode,
  isISBNFormat,
  priceFloat,
  priceInt,
  isObjectValueEqual
}
