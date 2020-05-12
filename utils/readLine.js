const fs = require('fs')
const path = require('path')
const readline = require('readline')

// const filName = path.join(__dirname, '../', '../', 'logs', 'access.log')
// const readStream = fs.createReadStream(filName)
// // 创建readLine对象
// const rl = readline.createInterface({
//     input: readStream
// })

let chromeNum = 0, sum = 0

function parseImg (file) {
    let filePath = path.join(__dirname, '../public/', file)
    fs.readFile(filePath, (err, data) => {
        if(err) {
            console.error(err)
            return
        }
        data = Buffer.from(data).toString('base64')
        return data
    })
}
// 逐行读取
// rl.on('line', (lineData) => {
//     if(!lineData) {
//         return
//     }
//     sum++
//     let arr = lineData.split(' -- ')
//     if(arr[2].indexOf('Chrome') > -1) {
//         chromeNum++
//     }
// })
// // 监听完成
// rl.on('close', () => {
//     console.log('Chrome占比:' + (chromeNum / sum))
// })

module.exports = {
    parseImg
}