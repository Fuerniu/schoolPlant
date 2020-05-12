const xss = require('xss')
const { exec } = require('../db/mysql')
// 获取8个区域点位数据
const getList = async () => {
    const sql = `select * from area_type where 1=1 `
    // 返回 promise
    return await exec(sql)
}
// 获取每个区域图片数量
const getNums = async (id) => {
    const sql = `select COUNT(p.id) total, a.center, a.cover, a.area_name 
    from plant_map p, area_type a 
    where p.area = a.id and p.area = ${id}`;
    // const sql = `select COUNT(id) total from plant_map where area=${id}`
    const rows = await exec(sql)
    return rows
}
// 获取每个区域的图片信息
const getPicList = async (name, page, size) => {
    let sql = `select * from plant_list where address = '${name}'`
    let val = (page - 1) * size
    sql += `order by createtime desc LIMIT ${val}, ${size};`
    const rows = await exec(sql)
    return rows
}
// 获取各个区域的图片数量
const getEveryNums = async () => {
  const sql = `SELECT a.area_name, a.id, COUNT(b.area) num
  FROM area_type a 
  LEFT JOIN plant_map b 
  ON a.id = b.area 
  GROUP BY a.id ORDER BY COUNT(b.area) desc;`
  const rows = await exec(sql)
  return rows
}
module.exports = {
    getList,
    getNums,
    getPicList,
    getEveryNums
}