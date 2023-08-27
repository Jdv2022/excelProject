const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: '',
    user: 'root',
    password: '000000000',
    database: 'mydb'
})

async function executeQuery(query, values = []) {
    try {
        const [rows, fields] = await pool.query(query, values)
        return rows
    } catch (error) {
        throw error
    }
}

module.exports = executeQuery
