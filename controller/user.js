const { exec, escape } = require('../db/mysql')
const { genPsw } = require('../utils/cryp')

const login = async (username, password) => {
    // escape防止sql注入攻击
    username = escape(username)
    // 生成加密密码
    password = genPsw(password)
    password = escape(password)

    const sql = `
        select username from user_table where username=${username} and psw=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}
// 获取关注人数
const watchMe = async (username) => {
    username = escape(username)
    const sql = `select watchNum from user_table where username = ${username}`
    const watchData = await exec(sql)
    return watchData
}
// 关注别人
const watchOther = async (author) => {
    author = escape(author)
    const sql = `update user_table set watchNum = watchNum + 1 where username = ${author}`

    const watchData = await exec(sql)
    if (watchData.affectedRows > 0) {
        return true
    }
    return false
}
module.exports = {
    login,
    watchMe,
    watchOther
}