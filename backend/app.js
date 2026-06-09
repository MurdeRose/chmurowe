import cors from 'cors'
import express from 'express';
import db from './database.js';
const redis = require('redis');

const app = express()
app.use(cors())
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const redisClient = redis.createClient({
    url: 'redis://redis:6379'
});

redisClient.connect();

app.get('/api/cache-test', async (req, res) => {
    await redisClient.set('test', 'redis works');
    const value = await redisClient.get('test');
    res.json({
        redis: value
    });
});


app.get('/api/hello', (req, res) =>{
    console.log("hello!!")
    res.status(200).json({response: "hello!"})
})

app.get('/api/user/:id', async(req, res) =>{
    try{
        const result = await db.query(`
            SELECT *
            FROM users
            WHERE id = $1`, [req.params.id])
        res.json(result.rows)
    } catch (err) {
        console.log("cos nie poszlo :c -> ", err)
        res.status(404).json({mes: "not found :c"})
    }
});
app.post('/api/signup', async(req, res) =>{
    console.log(req.body)
    try{
        if(req.body.username && req.body.password){
            const result = await db.query(`
            INSERT INTO users(username, pass) VALUES
            ($1, $2)`, [req.body.username, req.body.password])
            res.status(201).json({mes: "yippie"})
        } else{
            res.status(400).json({mes: "bad request"})
        }
    } catch (err) {
        console.log("cos nie poszlo :c -> ", err)
        res.status(500).json({mes: "something is wrong"})
    }
});

app.post('/api/login', async(req, res) =>{
    console.log(req.body)
    try{
        if(req.body.username && req.body.password){
            const result = await db.query(`
            SELECT *
            FROM users
            WHERE username=$1`, [req.body.username])
            console.log(result)
            if(result.rows[0] === undefined){
                res.status(404).json({mes: "not found :c"})
            } else if(result.rows[0].pass === req.body.password){
                res.status(200).json({username: req.body.username})
            }else{
                res.status(400).json({mes: "bad request"})
            }
        } else{
            res.status(400).json({mes: "bad request"})
        }
    } catch (err) {
        console.log("cos nie poszlo :c -> ", err)
        res.status(500).json({mes: "something is wrong"})
    }
})


app.listen(port, '0.0.0.0')