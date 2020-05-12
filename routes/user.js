const router = require('koa-router')()
const { login,
        watchMe,
        watchOther } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if (data.username) {
        // 设置 session
        ctx.session.username = data.username
        ctx.session.realname = data.realname
        ctx.body = new SuccessModel('成功')
        return
    }
    ctx.body = new ErrorModel(404, '失败')
})
router.post('/watchme', async function (ctx, next) {
    const { username } = ctx.request.body
    const data = await watchMe(username)

    ctx.body = new SuccessModel(data[0] || [])
})
router.post('/watchother', async function (ctx, next) {
    const { author } = ctx.request.body
    const val = await watchOther(author)

    if (val) {
        ctx.body = (new SuccessModel())
    } else {
        ctx.body = (new ErrorModel('关注失败'))
    }
})
// router.get('/session-test', async function (ctx, next) { 
//   if(!ctx.session.viewCount) {
//     ctx.session.viewCount = 1
//     return
//   }
//   ctx.session.viewCount++
//   ctx.body = {
//     errno: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router
