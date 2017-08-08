import axios from "../../config/http"

function getToken(zone, key) {
    return new Promise((resolve, reject) => {
        axios.post('/v1/mediastore/get_up_token', {
            zone,
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

function copyObject(obj) {
    var resObj = {}
    try {
        resObj = JSON.parse(JSON.stringify(obj))
    } catch (e) {
        console.log(e);
    } finally {
        return resObj
    }
}

// 判断两个对象是否相等
function isObjectValueEqual(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

/**
 * 数组排序去重算法
 * @param  {[type]} array [未去重数组]
 * @return {[type]}       [去重的数组]
 */
function unique(array) {
    array.sort(); //先排序
    var res = [array[0]];
    for (var i = 1; i < array.length; i++) {
        if (array[i] !== res[res.length - 1]) {
            res.push(array[i]);
        }
    }
    return res;
}
export {
    getToken,
    testMobile,
    testPassword,
    testMsgCode,
    isISBNFormat,
    priceFloat,
    priceInt,
    copyObject,
    isObjectValueEqual,
    s2ab,
    unique
}
