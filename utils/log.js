const fs = require('fs')
const path = require('path')

// 封装一个writeStream函数
function createWrite(fileName) {
    const fullName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullName, {
        flags: 'a'
    })
    return writeStream
}
// 封装一个写日志函数
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

// 生成一个writeStream
const accessWriteStream = createWrite('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}