const pool = require("../config/database.js")

exports.sendData = async function (req, res) {
  const { data } = req.body

  let postId, id, name, email, body
  const query = "INSERT INTO data(postId,id,name,email,body)  VALUES (?, ?, ?, ?, ?)"
  try {
    for (let i = 0; i < data.length; i++) {
      id = data[i]['"id"'].replace(/"/g, "")
      postId = data[i]['"postId"'].replace(/"/g, "")
      name = data[i]['"name"'].replace(/"/g, "")
      email = data[i]['"email"'].replace(/"/g, "")
      body = data[i]['"body"'].replace(/"/g, "")
      result = await pool.query(query, [postId, id, name, email, body])
      return res.json({ success: true })
    }
  } catch (err) {
    return res.json({ error: true })
  }
}

exports.getData = async function (req, res) {
  const query = "SELECT * FROM data"
  try {
    const results = await pool.query(query)
    // Extracting rows from the results
    const data = results[0].map(row => ({
      id: row.id,
      postId: row.postId,
      name: row.name,
      email: row.email,
      body: row.body
    }))
    return res.json(data)
  } catch (err) {
    console.error("Error retrieving data:", err)
    return res.json({ error: true })
  }
}
