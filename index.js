const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database.js');

app.use(cors());
app.use(express.json());
//let events = [];

app.get('/events', (req,res) => {
    db.all('select * from EVENTS', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows)
    });
});

app.post('/events', (req,res) => {
    const { date, type, time } = req.body;
    db.run('insert into EVENTS(date, type, time) VALUES(?,?,?)', [date, type, time], function (err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({id: this.lastID, date, type, time }); //lastID is kept by sqlite as the last inserted ID in the database if you have a key 
    });
});

app.patch('/events/:id', (req,res) => {
    const { ate } = req.body;
    const { id } = req.params;
    console.log(`Received id: ${id}, ate: ${ate}`);
    db.run('update EVENTS set ate = ? where id = ?', [ate, id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: err.message})
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({error: "No event found with the provided id."});
            return;
        }
        res.json({message: "record successfully updated."})
    })
})

app.delete('/events/:id', (req,res) => {
    const { id } = req.params;
    db.run('delete from EVENTS where id = ?', [id], function (err) {
        if (err) {
            console.error(err.message)
            res.status(500).json({error: err.message});
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({error: "No event found with the provided id."});
            return;
        }
        res.json({message: "record successfully deleted."})
    })
})

app.listen(5001, () => {
    console.log('server running on port 5001');
});