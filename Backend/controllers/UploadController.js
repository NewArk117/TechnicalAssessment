const pool = require("../config/database.js")

exports.sendData = async function (req, res) {
  var { data } = req.body
  let postId, id, name, email, body
  id = data[0]['"id"'].replace(/"/g, "")
  console.log(id)
  const query = "INSERT INTO data(postId,id,name,email,body)  VALUES (?, ?, ?, ?, ?)"
  try {
    for (let i = 0; i < data.length; i++) {
      id = data[i]['"id"'].replace(/"/g, "")
      postId = data[i]['"postId"'].replace(/"/g, "")
      name = data[i]['"name"'].replace(/"/g, "")
      email = data[i]['"email"'].replace(/"/g, "")
      body = data[i]['"body"'].replace(/"/g, "")
      result = await pool.query(query, [postId, id, name, email, body])
    }
  } catch (err) {
    return res.json({ error: true })
  }
}

exports.getData = async function (req, res) {
  const query = "select * from data"
  try {
    result = await pool.query(query)
    return res.json(result[0])
  } catch (err) {
    return res.json({ error: true })
  }
}
