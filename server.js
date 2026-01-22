// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// initialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});


// =========================
// VIEW ALL PETS
// =========================
app.get('/allpets', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM pets');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not retrieve pets' });
    }
});


// =========================
// ADD A NEW PET
// =========================
app.post('/addpet', async (req, res) => {
    const { pet_name, pet_type, pet_pic } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO pets (pet_name, pet_type, pet_pic) VALUES (?, ?, ?)',
            [pet_name, pet_type, pet_pic],
        );
        res.status(201).json({
            message: `Pet ${pet_name} added successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not add pet ${pet_name}`
        });
    }
});


// =========================
// UPDATE A PET
// =========================
app.put('/updatepet/:id', async (req, res) => {
    const petId = req.params.id;
    const { pet_name, pet_type, pet_pic } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE pets SET pet_name = ?, pet_type = ?, pet_pic = ? WHERE pet_id = ?',
            [pet_name, pet_type, pet_pic, petId]
        );
        res.json({
            message: `Pet ID ${petId} updated successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not update pet ID ${petId}`
        });
    }
});


// =========================
// DELETE A PET
// =========================
app.delete('/deletepet/:id', async (req, res) => {
    const petId = req.params.id;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM pets WHERE pet_id = ?',
            [petId]
        );
        res.json({
            message: `Pet ID ${petId} deleted successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `Server error - could not delete pet ID ${petId}`
        });
    }
});
