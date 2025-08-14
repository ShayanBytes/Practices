import { useState } from "react";
import { nanoid } from "nanoid";
import NoteList from "./components/NoteList";

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: nanoid(),
      text: "First Note is this",

      date: "14/09/25",
    },
     {
      id: nanoid(),
      text: "Second Note is this",

      date: "14/09/25",
    },
     {
      id: nanoid(),
      text: "Third Note is this",

      date: "14/09/25",
    }
  ]);
  const addNote =(text)=>{
    const date= new Date();
    const newNote={
      id:nanoid(),
      text:text,
      date:date.toLocaleDateString()
    }
    const newNotes = [...notes,newNote]
    setNotes(newNotes);
  }
  return (
    <div className="container ">
      <NoteList  notes={notes} handleAddNote={addNote}/>
    </div>
  );
};

export default App;
