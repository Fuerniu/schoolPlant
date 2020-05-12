const router = require('koa-router')(), 
      path = require('path'),
      fs = require('fs')

const { SuccessModel, ErrorModel } = require('../model/resModel')

// router.get(/\.jpg|jpeg|png$/, async function (ctx, next) {
//     let url = ctx.url
//     console.log(url, 'hahah')
// })
router.get(/\.jpg|png|jpeg$/, async function (ctx, next) {
    // 获取文件名称+后缀名
    let url = path.basename(ctx.url)
    let filePath = path.join(__dirname, '../public/images/', url)
    // let filePath = '../public/images/' + url
    let readStream = fs.createReadStream(filePath)
    // readStream.pipe(ctx.res)
    // ctx.res.end('')
})
module.exports = router
