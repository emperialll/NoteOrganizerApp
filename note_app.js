const fs = require('fs');
const readline = require('readline-sync');

// This is a Note class with title, body and time_added
const Note = class {
    constructor(title, body) {
      this.title = title;
      this.body = body;
      this.time_added = new Date().toISOString(); // Time will be added automatically
    }
  };


// This is Note processor class to store data in a file with CRUD methods
const NoteProcessor = class{
    constructor(filePath){
        this.filePath = filePath;
    }
    // Adds new note object to the file path.
    add_note(note) {
        let notes = [];

        // Check if the file already exists and read its contents
        if (fs.existsSync(this.filePath)) {
            const fileContent = fs.readFileSync(this.filePath, 'utf8');
            notes = JSON.parse(fileContent);
        }

        // Add the new note to the array
        notes.push(note);

        // Write the updated array back to the file
        fs.writeFileSync(this.filePath, JSON.stringify(notes, null, 2));
        console.log('Note added successfully!')
    }


    // Shows all note objects in the file path
    list_notes(){
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        let notes = JSON.parse(fileContent);
        notes.forEach(note => {
            console.log(`\nTitle: ${note.title}\nBody: ${note.body}\nAdded: ${note.time_added}\n`);
        });
    }


    // Getsa note title and return the note body and time added
    read_note(note_title){
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        let notes = JSON.parse(fileContent);
        for (const note of notes) {
            // Check if note is available in the file path
            if (note.title === note_title) {
                return `Body: ${note.body}\nAdded: ${note.time_added}`;
            }
        }
        return `Note not found!`; // If note has not been found.
    }


    // Gets a note title and remove the respective note from file path
    delete_note(note_title){
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        let notes = JSON.parse(fileContent);
        for (const note of notes) {
            // Check if note is available in the file path
            if (note.title === note_title) {
                let filteredNotes = notes.filter(note => note.title !== note_title);
                // Write the updated array back to the file
                fs.writeFileSync(this.filePath, JSON.stringify(filteredNotes, null, 2));
                return `Note deleted successfully!`;
            }
        }
        return `Note not found!`; // If note has not been found.
    }


    // Gets note title and new note body to update the note body in the file path.
    update_note(note_title, note_body){
        const fileContent = fs.readFileSync(this.filePath, 'utf8');
        let notes = JSON.parse(fileContent);
        for (const note of notes) {
            // Check if note is available in the file path
            if (note.title === note_title) {
                note.body = note_body;
                // Write the updated array back to the file
                fs.writeFileSync(this.filePath, JSON.stringify(notes, null, 2));
                return `Note updated successfully!`;
            }
        }
        return `Note not found!`; // If note has not been found.
    }
}


// This function quits the program
function quit() {
    console.log('Goodbye!');
    process.exit();
  }

// Main program menu to give multiple choice of CRUD to the user
function showMenu() {
    let noteTitle = '';
    let noteBody = '';
    console.log('\nMenu:');
    console.log('1. Add a note');
    console.log('2. List all notes');
    console.log('3. Read a note');
    console.log('4. Delete a note');
    console.log('5. Update a note');
    console.log('6. Exit');
    const choice = readline.question('Enter your choice: '); // Use readline-sync for input
    switch (choice) {
        case '1':
            noteTitle = readline.question('Enter your note title: ');
            noteBody = readline.question('Enter your note body: ');
            const mynote = new Note(noteTitle, noteBody);
            daily_chors.add_note(mynote);
            showMenu(); // Call showMenu() again to keep prompting
            break;
        case '2':
            daily_chors.list_notes();
            showMenu();
            break;
        case '3':
            noteTitle = readline.question('Enter your note title: ');
            console.log(daily_chors.read_note(noteTitle));
            showMenu();
            break;
        case '4':
            noteTitle = readline.question('Enter your note title: ');
            console.log(daily_chors.delete_note(noteTitle));
            showMenu();
            break;
        case '5':
            noteTitle = readline.question('Enter your note title: ');
            noteBody = readline.question('Enter your note body: ');
            console.log(daily_chors.update_note(noteTitle, noteBody));
            showMenu();
            break;
        case '6':
            quit();
            break;
        default:
            console.log('Invalid choice. Please try again with numbers (1 - 6).');
            showMenu();
    }
};

const daily_chors = new NoteProcessor('dailyChors.json');
showMenu();
