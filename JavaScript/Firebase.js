// --- 2. INITIALIZE FIREBASE ---
// The firebaseConfig object (not shown here) must be defined above this script.
// It contains your Firebase project keys such as apiKey, databaseURL, etc.
// This line initializes Firebase using that configuration.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQxETfI67in4wRXNKfpqf-fpglvUJmMjM",
  authDomain: "notesapp-f31ba.firebaseapp.com",
  databaseURL: "https://notesapp-f31ba-default-rtdb.firebaseio.com",
  projectId: "notesapp-f31ba",
  storageBucket: "notesapp-f31ba.firebasestorage.app",
  messagingSenderId: "208358290960",
  appId: "1:208358290960:web:82680959b55e1bfbf27c95",
  measurementId: "G-EDP6Z0WC7L"
};
firebase.initializeApp(firebaseConfig);

// The firebase.database() method gives us access to the Realtime Database service.
const database = firebase.database();

// Here we create a reference (a pointer) to the 'notes' collection (or path) in our database.
// Every note we add or modify will go under this "notes" node.
const notesRef = database.ref('notes');


// --- 3. GET ELEMENTS FROM THE PAGE ---
// Get the container element from HTML where all notes will be displayed dynamically.
const notesContainer = document.getElementById('notes-container');

// Get the input box where the user types a new note.
const noteInput = document.getElementById('note-input');

// Get the submit button that will trigger adding a new note when clicked.
const submitButton = document.getElementById('submit-button');


// --- 4. CREATE: WRITE DATA TO FIREBASE ---
// Add an event listener to handle click actions on the "Submit" button.
submitButton.addEventListener('click', () => {
 
  // Retrieve the text typed by the user in the input box.
  const noteText = noteInput.value;

  // If the user clicked "Submit" with an empty or whitespace-only input, do nothing.
  if (noteText.trim() === '') return;

  // Push a new note object into the 'notes' path in the Realtime Database.
  // Firebase automatically creates a unique key (ID) for each pushed item.
  notesRef.push({
    text: noteText,          // The actual note text
    timestamp: Date.now()    // Save the current time (milliseconds since 1970)
  });

  // After adding the note to Firebase, clear the input box for the next note.
  noteInput.value = '';
});

// Read Op

notesRef.on('child_added',(snapshot) => {
  // Step 1: Extract ID and object
  const noteId = snapshot.key;
  const newNote = snapshot.val();

  const notesElement = createNoteElement(noteId, newNote.text);

  notesContainer.prepend(notesElement);

})


function createNoteElement(noteId, noteText) {
 
  // Outer Box
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.setAttribute('data-id', noteId);

  //text
  const noteTextElement = document.createElement('span');
  noteTextElement.textContent = noteText;
  noteElement.appendChild(noteTextElement);
  // Delete Button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click' ,() =>{
    deleteNote(noteId);
  });
  noteElement.appendChild(deleteButton);
   // Edit Button
  const editButton = document.createElement('button');
  editButton.classList.add('edit-btn');
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', () => {
    const currentText = noteElement.querySelector('span').innerText;
    editNote(noteId,currentText);
  });
  noteElement.appendChild(editButton);

 




 



  return noteElement;

}

function deleteNote(noteId) {
  // Create a reference to the specific note to be deleted
  const specificNoteRef = database.ref('notes/' + noteId);

  // Remove the note from the database
  specificNoteRef.remove();
}

notesRef.on('child_removed', (snapshot) => {

  const noteId = snapshot.key;

  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);

  if(noteElement) {
    noteElement.remove();}
   
});




function editNote (noteId,currentText){
   // prompt is a built in tool that forces a small popup window to appear
   // We gibes it two things
   // 1] the Question : 'Fix your typo:'(this tells user what to do)
   //2] the Default Answer :currentText (this puts therire old note in the box auto)
  const newText = prompt('Fix your typo:' ,currentText);


  if(newText && newText.trim() !==''){

    const specificNoteRef = database.ref('notes/' +noteId);

    specificNoteRef.update({
      text : newText
    });

  }

}


notesRef.on('child_changed', (snapshot) =>{

  const noteId = snapshot.key;
  const updatedNote = snapshot.val();
  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);
  // if it exists locate the <span> inside and update its displayed text
  if(noteElement){
    noteElement.querySelector('span').innerText = updatedNote.text;
  }

})