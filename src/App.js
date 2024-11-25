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

  async addDummyData() {
    const db = getFirestore(app);
    const notesCollection = collection(db, "notes");
    
    const dummyTodos = [
      { description: "🏃 Go for a morning run" },
      { description: "📚 Read 20 pages of current book" },
      { description: "🛒 Buy groceries for the week" },
      { description: "💻 Complete React project" },
      { description: "🎸 Practice guitar for 30 minutes" },
      { description: "🧹 Clean the apartment" },
      { description: "📧 Reply to important emails" },
      { description: "👥 Call family" },
      { description: "🍳 Meal prep for the week" },
      { description: "💪 Hit the gym" }
    ];

    try {
      for (const todo of dummyTodos) {
        await addDoc(notesCollection, todo);
      }
      await this.refreshNotes(); // Refresh the UI after adding dummy data
      console.log("Dummy data added successfully!");
    } catch (error) {
      console.error("Error adding dummy data: ", error);
    }
  }

  render() {
    const { notes, newNote } = this.state;
    return (
      <div className="container">
        <div className="app-wrapper">
          <h1 className="app-title">Todo List</h1>
          
          {notes.length === 0 && (
            <button 
              onClick={() => this.addDummyData()}
              className="dummy-data-button"
            >
              Add Sample Todos
            </button>
          )}
          
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
