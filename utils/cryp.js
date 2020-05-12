const crypto = require('crypto')

// 密匙
const SECRET_KEY = 'W@#89!`/]d<:Gvz&'
// md5加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function genPsw(psw) {
    const str = `psw=${ psw }&key=${ SECRET_KEY }`
    return md5(str)
}
module.exports = {
    genPsw
}