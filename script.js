//determine if we want to make a new firebase or use existing.
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const notesRef = database.ref('notes');
const notesContainer = document.getElementById('notes-container');
const noteInput = document.getElementById('note-input');
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () =>
{  
    const noteText = noteInput.value;
    if(noteText.trim() === '') return;
    notesRef.push({
        text :noteText,          
        timestamp : Date.now()    
    })
    noteInput.value = '';
   
});


notesRef.on('child_added',(snapshot) => {
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
  // Delete 
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click' ,() =>{
    deleteNote(noteId);
  });
  noteElement.appendChild(deleteButton);
   // Edit 
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
  const specificNoteRef = database.ref('notes/' + noteId);
  specificNoteRef.remove();
}

notesRef.on('child_removed', (snapshot) => {

  const noteId = snapshot.key;

  const noteElement = document.querySelector(`div[data-id="${noteId}"]`);

  if(noteElement) {
    noteElement.remove();}
   
});




function editNote (noteId,currentText){
  const newText = prompt('Edit comment:' ,currentText);

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
  if(noteElement){
    noteElement.querySelector('span').innerText = updatedNote.text;
  }

})