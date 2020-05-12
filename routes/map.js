const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const fs = require('fs')
const path = require('path')
// const { parseImg } = require('../utils/readLine')
const { 
  getList, 
  getNums, 
  getEveryNums, 
  getPicList } = require('../controller/map')

router.prefix('/api/map')

router.get('/list', async function (ctx, next) {
    const keyword = ctx.query.keyword || ''
    const listData = await getList()
    ctx.body = new SuccessModel(listData)
})
// 获取当前区域点位数量
router.post('/point', async function (ctx, next) {
  const id = ctx.request.body.id
  const numData = await getNums(id)
  ctx.body = new SuccessModel(numData)
})
// 获取当前点位的图片信息
router.post('/poimg', async function (ctx, next) {
  const name = ctx.request.body.name
  const page = ctx.request.body.page
  const size = ctx.request.body.size

  const imgData = await getPicList(name, page, size)
  ctx.body = new SuccessModel(imgData)
})

// 获取各个区域内点位的数量
router.get('/areapoints', async function (ctx, next) {
  const areaData = await getEveryNums()
  ctx.body = new SuccessModel(areaData)
})

module.exports = router
