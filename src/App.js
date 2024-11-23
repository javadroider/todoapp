import { Component } from 'react';
import './App.css';
import app from './firebase';
import { getDocs, collection, getFirestore, addDoc, deleteDoc, doc } from "firebase/firestore/lite";



class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      newNote: ''
    };
    this.addNote = this.addNote.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  handleInputChange(e) {
    this.setState({ newNote: e.target.value });
  }

  async refreshNotes() {

    var notesList=[]
    const db = getFirestore(app);
    const notesCollection = collection(db, "notes");
    const snapshot = await getDocs(notesCollection);
    snapshot.forEach(doc => {
      notesList.push({
        id: doc.id,
        ...doc.data()
      });
    });
    this.setState({ notes: notesList });
  }

  componentDidMount() {
    this.refreshNotes();
  }


  async addNote() {
    const db = getFirestore(app);
    const notesCollection = collection(db, "notes");
    const newNote = {
      description: this.state.newNote
    };
    await addDoc(notesCollection, newNote);
    this.setState({ newNote: '' });
    this.refreshNotes();
  }

  async deleteNote(id) {
    const db = getFirestore(app);
    const docRef = doc(db, "notes", id);
    await deleteDoc(docRef);
    await this.refreshNotes();
  }


  render() {
    const { notes, newNote } = this.state;
    return (
      <div className="container">
        <div className="app-wrapper">
          <h1 className="app-title">Todo List</h1>
          
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newNote}
              onChange={this.handleInputChange}
              className="todo-input"
              onKeyPress={(e) => e.key === 'Enter' && this.addNote()}
            />
            <button 
              onClick={this.addNote}
              className="add-button"
            >
              Add
            </button>
          </div>

          <div className="todos-list">
            {notes.map(note => (
              <div key={note.id} className="todo-item">
                <span className="todo-text">{note.description}</span>
                <button 
                  onClick={() => this.deleteNote(note.id)}
                  className="delete-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}


export default App;
