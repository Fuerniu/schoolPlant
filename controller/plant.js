const xss = require('xss')
const { exec } = require('../db/mysql')
const { reFileBase64 } = require('../utils/readFile')
// 获取植物图库列表
const getList = async (author, keyword, page) => {
    let sql = `select * from plant_list where status = 1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and keyword like '%${keyword}%' `
    }
    let val = (page - 1) * 15
    sql += `order by createtime desc LIMIT ${val}, 15;`
    // 返回 promise
    return await exec(sql)
}
// 按照中文学名查询
const getName = async (key) => {
    const pattern = new RegExp("[A-Za-z]+")
    let sql = ''
    sql = `select * from plant_list where cn_name like '%${key}%';`
    const data = await exec(sql)
    return data
}
// 按照英文学名查询
const getEname = async (key) => {
    const pattern = new RegExp("[A-Za-z]+")
    let sql = ''
    sql = `select * from plant_list where en_name like '%${key}%';`
    const data = await exec(sql)
    return data
}
// 按照科名首字母查询
const getFamily = async (key) => {
    let sql = `SELECT a.* from plant_list a, plant_type b 
    WHERE a.family_name = b.name AND b.first_letter = '${key}' ORDER BY id;`
    const data = await exec(sql)
    return data
}
const getDetail = async (id) => {
    const sql = `select * from blog_table where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newPlant = async (plantData = {}) => {
    // plantData 是一个植物对象，包含 picpath、author、keyword、status、ct 属性
    const picpath = xss(plantData.picpath)
    const author = xss(plantData.author)
    const name = xss(plantData.plantName)
    const address = xss(plantData.posiName)
    // const base64 = xss(plantData.base64)
    const status = 1
    const createtime = Date.now()

    const sql = `
        insert into mine_plant (picpath, author, address, name, status, createtime)
        values ('${picpath}', '${author}', '${address}', '${name}', '${status}', ${createtime});
    `
    // console.log(sql, 'sql')
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const getMinePic = async (author) => {
    let sql = `select * from mine_plant where status = 1 `
    if (author) {
        sql += `and author='${author}' `
    }
    sql += `order by createtime desc;`
    // 返回 promise
    return await exec(sql)
}

const updateMinePic = async (imgData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含 title content 属性
    const id = xss(imgData.id)
    const title = xss(imgData.title)

    const sql = `
        update mine_plant set name = '${title}' where id = ${id}
    `
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const likeThisImg = async (id, author, status) => {
    let sql
    if (status) {
        sql = `update mine_plant set likeNum = likeNum + 1 where status = 1 and id = ${id} and author = '${author}'`
    } else {
        sql = `update mine_plant set likeNum = likeNum - 1 where status = 1 and id = ${id} and author = '${author}'`
    }

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delMinePic = async (id, author) => {
    // id 就是要删除博客的 id
    const sql = `update mine_plant set status = 0 where id = ${id} and author='${author}';`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

const base64 = async (listData) => {
//     listData.forEah((item, index) => {
//         listData[index].picpath = await reFileBase64(item.picpath)
//     })
//     return listData
}

module.exports = {
    getList,
    getFamily,
    getName,
    getEname,
    newPlant,
    getMinePic,
    updateMinePic,
    likeThisImg,
    base64,
    delMinePic
}
