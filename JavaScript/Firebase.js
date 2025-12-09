const firebaseConfig = {
  apiKey: "AIzaSyBlI12KBFoZgmc_asBDqL9czmsgJV4Ww-w",
  authDomain: "pokeapi-91a4f.firebaseapp.com",
  projectId: "pokeapi-91a4f",
  storageBucket: "pokeapi-91a4f.firebasestorage.app",
  messagingSenderId: "933068493418",
  appId: "1:933068493418:web:66c83d045f1d75cb543013"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const notesRef = database.ref("notes");

const notesContainer = document.getElementById("notes-container");
const noteInput = document.getElementById("note-input");
const submitButton = document.getElementById("submit-button");

submitButton.addEventListener("click", () => {
  const noteText = noteInput.value;

  if (noteText.trim() === "") return;

  notesRef.push({
    text: noteText,
    timestamp: Date.now()
  });

  noteInput.value = "";
});

notesRef.on("child_added", (snapshot) => {
  const noteId = snapshot.key;
  const data = snapshot.val();

  const element = createNoteElement(noteId, data.text);
  notesContainer.prepend(element);
});

function createNoteElement(noteId, text) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.dataset.id = noteId;

  const span = document.createElement("span");
  span.textContent = text;
  noteElement.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => deleteNote(noteId);
  noteElement.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editNote(noteId, text);
  noteElement.appendChild(editBtn);

  return noteElement;
}

function deleteNote(noteId) {
  database.ref("notes/" + noteId).remove();
}

notesRef.on("child_removed", (snapshot) => {
  const noteId = snapshot.key;
  const element = document.querySelector(`[data-id="${noteId}"]`);
  if (element) element.remove();
});

function editNote(noteId, currentText) {
  const newText = prompt("Fix your typo:", currentText);

  if (!newText || newText.trim() === "") return;

  database.ref("notes/" + noteId).update({
    text: newText
  });
}

notesRef.on("child_changed", (snapshot) => {
  const noteId = snapshot.key;
  const newData = snapshot.val();

  const element = document.querySelector(`[data-id="${noteId}"]`);
  if (element) {
    element.querySelector("span").innerText = newData.text;
  }
});
