import { MdDeleteForever } from "react-icons/md";

const Note = () => {
  return (
    <div className="note">
      <span>Hello this is our first note</span>
      <div className="note-footer">
        <small>14/09/2025</small>
        <MdDeleteForever size="1.3em" />
      </div>
    </div>
  );
};

export default Note;
