const express = require('express');
const path = require('path');

const app = express();

const players = ("./players.js");



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));