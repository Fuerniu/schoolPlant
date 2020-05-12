const cheerio = require('cheerio'),
    charset = require('superagent-charset'),
    superagent = charset(require('superagent')),
    ftpClient = require('ftp'),
    path = require('path'),
    { FTP_CONF } = require('../conf/db')

// 连接ftp
let ftp = new ftpClient()
// ftp.connect(FTP_CONF)

let arr

function getImg(url) {
    const promise = new Promise((resolve, reject) => {
        superagent.get(url)
            .charset('utf-8') // 编码格式
            .buffer(true)
            .end((err, sres) => {
                if (err) {
                    reject(err)
                    return
                }
                // 用cheerio解析页面数据
                let html = sres.text,
                $ = cheerio.load(html, {
                    decodeEntities: false,
                    ignoreWhitespace: false,
                    xmlMode: false,
                    lowerCaseTags: false
                })
                arr = []
                let text
                $('head').each((index, el) => {
                    let $el = $(el)
                    text = $el.find('link').attr('href')
                    arr.push({
                        'backImg': `https://cn.bing.com/${text}`
                    })
                })
                resolve(arr[0])
            })
    })
    return promise
}

function getFtp (url) {
    ftp.on('ready', async () => {
        console.log('ready')
        let promise = new Promise((resolve, reject) => {
          let filePath = path.join(__dirname, '../public/images/', url)
          // 判断文件夹中是否有该文件
          // http://121.199.15.196/images/code.jpg
          ftp.put(filePath, `/opt/bishe/static/images/${url}`, (err) => {
            console.log(filePath, 'filePath')
            if (err) {
              console.log('上传失败')
              reject(err)
            }
            console.log('上传成功')
            resolve(true)
          })
        })
        // let p = await promise
        // console.log(p)
        ftp.end()
        return promise
    }).on('error', async e => {
        console.log(e);
        reject(e)
    })
}
module.exports = { getImg, getFtp }