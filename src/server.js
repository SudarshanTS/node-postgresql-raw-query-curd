const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { Client } = require('pg');
// db connection 
const connectionString = 'postgres://postgres:postgres@localhost:5432/backend-testing';
const client = new Client({
    connectionString: connectionString,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
client.connect();
app.get('/getAllEmp', (req, res) => {
    client.query('SELECT * from emp', (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    })
});
app.post('/create-emp', (req, res, next) => {
    const data = req.body;
    console.log(data);
    client.query(
        `insert into emp(name, email, role_number, created_on) VALUES($1, $2, $3, $4) RETURNING *`,
        [data.name, data.email, data.roleNo, '01-06-2020'],
        (error, result) => {
            if (!!error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(result.rows[0]);
            }
        }
    );
});
app.put("/update-emp/:id", async function (req, res, next) {
    try {
        const data = req.body;
        const id = req.params.id;
        const result = await client.query(
            "UPDATE emp SET name=$1, email=$2,role_number=$3 WHERE id=$4 RETURNING *",
            [data.name, data.email, data.roleNo, id]
        );
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.delete("/delete-emp/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const result = await client.query(
            "DELETE FROM emp WHERE id=$1 RETURNING *",
            [id]
        );
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.listen(3000, () => console.log(`Example app listening at http://localhost:${3000}`))