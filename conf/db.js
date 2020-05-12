const env = process.env.NODE_ENV  // 环境参数

// 配置
let MYSQL_CONF
let REDIS_CONF
let FTP_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '***',
        port: '3306',
        database: '###'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

    FTP_CONF = {
        host: '***',
        port: '21',
        user: '###',
        password: '???'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
      host: 'localhost',
      user: 'root',
      password: '***',
      port: '3306',
      database: '###'
  }

  // redis
  REDIS_CONF = {
      port: 6379,
      host: '127.0.0.1'
  }

  FTP_CONF = {
      host: '***',
      port: '21',
      user: '###',
      password: '???'
  }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF,
    FTP_CONF
}