const cheerio = require('cheerio'),
mysql=require('mysql'),
xss = require('xss')
// 获取8个区域点位数据
const { exec } = require('../db/mysql')
const { getImg } = require('../utils/imgUrl')

const imgBack = async (imgUrl) => {
    return await getImg(imgUrl)
}
const newImg = async (imgUrl) => {
    // blogData 是一个博客对象，包含 title content author 属性
    const bcImg = xss(imgUrl.backImg)

    let sql = `INSERT INTO back_img(backImg) SELECT '${bcImg}'
            FROM DUAL WHERE NOT EXISTS(SELECT backImg FROM 
            back_img WHERE backImg = '${bcImg}');`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const currentImg = async () => {
    let sql = `SELECT backImg from back_img;`
    const currData = await exec(sql)
    return currData
}

module.exports = {
    getImg,
    newImg,
    imgBack,
    currentImg
}