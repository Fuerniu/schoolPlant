const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel')
// const loginCheck = require('../middleware/loginCheck')
// const fs = require('fs'),
//     path = require('path')
const { exec } = require('../db/mysql')
const cheerio = require('cheerio'),
    charset = require('superagent-charset'),
    superagent = charset(require('superagent')),
    mysql=require('mysql')

const {
    getImg,
    newImg,
    imgBack,
    currentImg
} = require('../controller/home')
// 计数使用
let count = 0
router.prefix('/api/home')

router.get('/backimg', async function (ctx, next) {
    let data, url = 'https://cn.bing.com'
    // 如果是第一次访问，则进行爬虫操作，获取当天Bing主页图片并存入库中
    // if (count < 1) {
    //     console.log('get')
    //     data = await getImg(url)
    // } else {
    //     data = await currentImg()
    // }
    // 获取今日Bing背景图片
    data = await imgBack(url)
    // 将今日背景图片存入到数据库中
    insertData = await newImg(data)

    ctx.body = new SuccessModel(data, '成功')
})


module.exports = router
