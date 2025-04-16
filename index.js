const express = require('express');
const exphbs = require('express-handlebars');

const fs = require('fs');
const playersData = fs.readFileSync('./players.json', 'utf-8');
let players = JSON.parse(playersData);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    partialsDir:'views/partials'
}));

app.get('/', (req,res)=>{
    res.render('index',
        {
            title: 'Node.js assigment',
            players: players
        });
});

app.set('view engine', 'handlebars');

//css
app.use(express.static('public'));

//REST API
//Get all
app.get('/api/players', (req,res) =>{
    res.status(200).json(
        {
            status:'Succes',
            results: players.length,
            data: players
        }
    );
});

//Get one
app.get('/api/players/:id', (req,res)=>{
    const id = Number(req.params.id);
    const player = players.find(player => player.id === id);
    if(player){
        res.json(player);
    }else{
        res.status(404).json(
            {
                msg:"No player with such ID"
            }
        )
    }; 
});

//Delete one
app.delete('/api/players/:id', (req,res) =>{
    const idToRemove = Number(req.params.id);
    const player = players.find(player => player.id === idToRemove);

    if(player){
        players = players.filter(player => player.id != idToRemove)
        res.status(200).json(
            {
                msg: `Player with id:${idToRemove} removed from the list`
            }
        )
    }else{
        res.status(404).json(
            {
                msg:"No player with such ID"
            }
        )
    };  
});

//Create
app.post('/api/players', (req,res) =>{
    const newId = players[players.length-1].id + 1;
    const newPlayer = {
        id: newId,
        name: req.body.name,
        position: req.body.position,
        goals: req.body.goals,
        isCaptain: req.body.isCaptain
    }
    players.push(newPlayer);
    res.location('http://localhost:3000/api/players/'+ newId);
    res.status(201).json(
        {
            msg:"New player created",
            player: newPlayer
        }
    );
});

//Update
app.patch('/api/players/:id', (req,res) =>{
    const idToUpdate = Number(req.params.id);
    const newName = req.body.name;
    const newPosition = req.body.position;
    const newGoals = req.body.goals;
    const newIsCaptain = req.body.isCaptain;

    const player = players.find(player => player.id === idToUpdate);

    if(player){
        players.forEach(player =>{
            if(player.id === idToUpdate){
                player.name = newName;
                player.position = newPosition;
                player.goals = newGoals;
                player.isCaptain = newIsCaptain;
            }
        });
        res.status(200).json(player);
    }else{
        res.status(404).json(
            {
                msg:"Could not update"
            }
        )
    }
});


app.use((req,res,next) =>{
    res.status(404).send("Sorry, could not find the content");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));