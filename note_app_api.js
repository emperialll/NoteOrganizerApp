const express = require('express');
const fs = require('fs');
const app = express();

// Before setting up your routes, you'll want to add this line, 
// which sets up Express to parse the JSON bodies of incoming requests.
// You'll need this for the POST and PUT routes.
app.use(express.json());

app.get('/notes', function (req, res) {
  const data = fs.readFileSync('dailyChors.json');
  const notes = JSON.parse(data);
  res.json(notes);
});

app.post('/notes', function (req, res) {
    // Extract the note data from the request's JSON body
    const { title, body } = req.body;
  
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required fields' });
    }
  
    // Read the existing notes from the file
    const data = fs.readFileSync('dailyChors.json');
    const notes = JSON.parse(data);
  
    // Create a new note object
    const newNote = {
      title,
      body,
      time_added: new Date().toISOString()
    };
  
    // Add the new note to the array of notes
    notes.push(newNote);
  
    // Write the updated notes array back to the file
    fs.writeFileSync('dailyChors.json', JSON.stringify(notes, null, 2));
  
    // Respond with the newly created note
    res.status(201).json(newNote);
  });


app.get('/notes/:title', function (req, res) {
const requestedTitle = req.params.title;
const data = fs.readFileSync('dailyChors.json', 'utf8');
const notes = JSON.parse(data);

// Find the note with the requested title
const foundNote = notes.find((note) => note.title === requestedTitle);

if (foundNote) {
    res.json(foundNote);
} else {
    res.status(404).json({ error: 'Note not found' });
}
});


app.delete('/notes/:title', function (req, res) {
const requestedTitle = req.params.title;
const data = fs.readFileSync('dailyChors.json', 'utf8');
let notes = JSON.parse(data);

// Find the note with the requested title
const foundNoteIndex = notes.findIndex((note) => note.title === requestedTitle);

if (foundNoteIndex !== -1) {
    // Remove the found note from the array
    notes.splice(foundNoteIndex, 1);

    // Write the updated array back to the file
    fs.writeFileSync('dailyChors.json', JSON.stringify(notes, null, 2));

    res.json({ message: 'Note deleted successfully' });
} else {
    res.status(404).json({ error: 'Note not found' });
}
});


app.put('/notes/:title', function (req, res) {
    const requestedTitle = req.params.title;
    const { title, body } = req.body;
  
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required fields' });
    }
  
    const data = fs.readFileSync('dailyChors.json', 'utf8');
    let notes = JSON.parse(data);
  
    // Find the index of the note with the requested title
    const foundNoteIndex = notes.findIndex((note) => note.title === requestedTitle);
  
    if (foundNoteIndex !== -1) {
      // Update the found note with the new title and body
      notes[foundNoteIndex] = { title, body, time_added: notes[foundNoteIndex].time_added };
  
      // Write the updated array back to the file
      fs.writeFileSync('dailyChors.json', JSON.stringify(notes, null, 2));
  
      res.json({ message: 'Note updated successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });
  

app.listen(3000, function () {
  console.log('Note Organizer API is listening on port 3000!')
});