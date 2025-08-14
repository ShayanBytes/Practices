import { useState } from "react";
import { nanoid } from "nanoid";
import NoteList from "./components/NoteList";

const app = () => {
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
  return (
    <div className="container ">
      <NoteList  notes={notes}/>
    </div>
  );
};

export default app;
