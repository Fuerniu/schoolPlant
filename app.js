const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const morgan = require('koa-morgan')
const fs = require('fs')
const koaBody = require('koa-body')
const path = require('path')
const { REDIS_CONF } = require('./conf/db')

// const index = require('./routes/index')
// const users = require('./routes/users')

const blog = require('./routes/blog')
const user = require('./routes/user')
const plant = require('./routes/plant')
const map = require('./routes/map')
const home = require('./routes/home'),
      img = require('./routes/img')

// error handler
onerror(app)
// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(koaBody({
  multipart: true,
  formidable:{
    uploadDir: path.join(__dirname,'./public/images'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 5 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}))
// 如果是线上环境
if(process.env.NODE_ENV === 'production') {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
} else {
  app.use(morgan('dev'));
}
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// session配置
app.keys = ['Woid(*76%.,_']
app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 3600 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${ REDIS_CONF.host }:${ REDIS_CONF.port }`  // 写死本地的redis
  })
}))
// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(plant.routes(), plant.allowedMethods())
app.use(map.routes(), map.allowedMethods())
app.use(home.routes(), home.allowedMethods())
// app.use(img.routes(), img.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
