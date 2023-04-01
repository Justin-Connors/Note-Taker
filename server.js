const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisfy(fs.readFile);

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved for notes`);
    readFromFile('./db/notes.json').then((note) => res.json(JSON.parse(note)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);

    const { title, noteinfo } = req.body;

    if (req.body) {
        const newNote = {
          title,
          noteinfo,
          note_id: uuid(),
    };

    readAndAppend(newNote, '/db/notes.json');
    res.json(`Note added!`);
    } else {
        res.error(`oh no there was an error`)
    }
});

app.listen(PORT, () => 
console.log(`Nasa now has control of your PC and is hacking on ${PORT} 👀`)
);