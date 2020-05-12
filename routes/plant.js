const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const fs = require('fs'),
      path = require('path'),
      ftpClient = require('ftp'),
      reFileBase64 = require('../utils/readFile'),
      { getFtp } = require('../utils/imgUrl'),
      { FTP_CONF } = require('../conf/db')
const { 
  getList, 
  newPlant, 
  getFamily, 
  getName,
  getEname,
  getMinePic,
  updateMinePic,
  likeThisImg,
  delMinePic } = require('../controller/plant')

  // 连接ftp
let ftp = new ftpClient()
// ftp.connect(FTP_CONF)

router.prefix('/api/plant')

router.get('/list', async function (ctx, next) {
  const author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  const page = ctx.query.page || ''
  // return
  const listData = await getList(author, keyword, page)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function(ctx, next) {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post('/cname', async function (ctx, next) {
  const key = ctx.request.body.key
  const data = await getName(key)
  ctx.body = new SuccessModel(data)
})

router.post('/ename', async function (ctx, next) {
  const key = ctx.request.body.key
  const data = await getEname(key)
  ctx.body = new SuccessModel(data)
})

router.post('/family', async function (ctx, next) {
  const key = ctx.request.body.key
  const data = await getFamily(key)
  ctx.body = new SuccessModel(data)
})
// 将用户上传的文件放到项目文件夹照片中并写入数据库
router.post('/upload', loginCheck, async function (ctx, next) {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 获取file的文件名(名称+后缀)
  const picpath = path.basename(file.path)

  ctx.request.body.author = ctx.session.username
  ctx.request.body.picpath = picpath
  
  const uploadData = await newPlant(ctx.request.body)
  ctx.body = new SuccessModel(uploadData)
})
// router.post('/upload', loginCheck, async function (ctx, next) {
//   // 上传单个文件
//   const file = ctx.request.files.file; // 获取上传文件
//   // 获取file的文件名(名称+后缀)
//   const picpath = path.basename(file.path)
//   ftp.on('ready', async () => {
//     console.log('ready')
//     let promise = new Promise((resolve, reject) => {
//       let filePath = path.join(__dirname, '../public/images/', url)
//       // 判断文件夹中是否有该文件
//       // http://121.199.15.196/images/code.jpg
//       ftp.put(filePath, `/opt/bishe/static/images/${url}`, (err) => {
//         console.log(filePath, 'filePath')
//         if (err) {
//           console.log('上传失败')
//           reject(err)
//         }
//         console.log('上传成功')
//         resolve(true)
//       })
//     })
//       // let p = await promise
//       // console.log(p)
//     ftp.end()
//     }).on('error', async e => {
//         console.log(e);
//         reject(e)
//     }
//   )
//   let status = await getFtp(picpath)
//   console.log(status, 'status')
//   if (status) {
//     ctx.body = new SuccessModel(status)
//   } else {
//     ctx.body = new ErrorModel()
//   }
// })
// // 从当前项目文件夹中读取图片文件，显示
// router.get('/mypic', async function (ctx, next) {
//   const author = ctx.query.author || ''
//   let listData
//   listData = author ? await getMinePic(author) : await getMinePic()
//   // if(listData.length > 0) {
//   // } else {
//   //   listData = []
//   // }
//   let picData = []
//   listData.forEach(item => {
//     let filePath = path.join(__dirname, '../public/images/', item.picpath)
//     let data = fs.readFileSync(filePath)
//     data = Buffer.from(data).toString('base64')
//     item.picpath = data
//     picData.push(item)
//   })
//   ctx.body = new SuccessModel(picData)
// })
// 从当前项目文件夹中读取图片文件，显示
router.get('/mypic', async function (ctx, next) {
  const author = ctx.query.author || ''
  // let listData
  const listData = author ? await getMinePic(author) : await getMinePic()
  ctx.body = new SuccessModel(listData)
})
router.post('/likeit', async function(ctx, next) {
  const { id, author, status } = ctx.request.body

  const val = await likeThisImg(id, author, status)
  if (val) {
    ctx.body = (new SuccessModel())
  } else {
      ctx.body = (new ErrorModel('失败'))
  }
  // ctx.body = new SuccessModel(delData)
})
// 删除当前项目文件夹中的文件
router.post('/delete', loginCheck, async function(ctx, next) {
  const id = ctx.request.body.id
  const author = ctx.request.body.author
  
  const delData = await delMinePic(id, author)
  ctx.body = new SuccessModel(delData)
})

router.post('/update', loginCheck, async function(ctx, next) {
  const val = await updateMinePic(ctx.request.body)
  if (val) {
      ctx.body = (new SuccessModel())
  } else {
      ctx.body = (new ErrorModel('更新博客失败'))
  }
})

router.post('/del', loginCheck, async function (ctx, next) { 
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if (val) {
      ctx.body = (new SuccessModel())
  } else {
      ctx.body = (new ErrorModel('删除博客失败'))
  }
})
module.exports = router
