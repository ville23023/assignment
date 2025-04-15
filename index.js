const express = require('express');
const path = require('path');

const fs = require('fs');
const playersData = fs.readFileSync('./players.json', 'utf-8');
const players = JSON.parse(playersData);

const app = express();

app.get('/api/players', (req,res) =>{
    res.json(players);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));