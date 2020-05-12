const fs = require('fs')
const path = require('path')

let picData = []

function reFileBase64 (picpath) {
  const promise = new Promise((resolve, reject) => {
    // listData.forEach((item, index) => {
    // })
    let filePath = path.join(__dirname, '../public/images/', picpath)
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      let buffer = Buffer.from(data).toString('base64')
      resolve(buffer)
    })
  })
  return promise
}
module.exports = {
  // reFileName,
  reFileBase64
}