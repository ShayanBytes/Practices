import Note from "./Note";

const NoteList = ({notes}) => {
  return (
    <div className="notes-list ">
      {notes.map((note)=>(
        <Note/>
      ))}
                                         
    </div>
  );
};



export default NoteList;
