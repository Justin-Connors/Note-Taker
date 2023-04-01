const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

const readFromFile = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

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
    readFromFile('./db/db.json').then((note) => res.json(JSON.parse(note)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
          title,
          text,
          id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added!`);
    } else {
        res.error(`oh no there was an error`)
    }
});

app.listen(PORT, () => console.log(`Nasa now has control of your PC and is hacking on ${PORT} 👀`));