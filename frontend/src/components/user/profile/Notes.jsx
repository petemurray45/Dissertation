import { useUserStore } from "../../../utils/useUserStore";
import { useState, useEffect } from "react";
import { PackageIcon } from "lucide-react";
import { MdDelete } from "react-icons/md";
function Notes() {
  const [notes, setNotes] = useState([]);
  const [openNoteId, setOpenNoteId] = useState(null);
  const { fetchAllNotes, deleteNote } = useUserStore();

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await fetchAllNotes();
        setNotes(response || []);
      } catch (err) {
        console.error("Failed to fetch all notes", err);
        setNotes([]);
      }
    };
    loadNotes();
  }, [fetchAllNotes]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      const updated = await fetchAllNotes();
      setNotes(updated);
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleDrawer = (id) => {
    setOpenNoteId(openNoteId === id ? null : id);
  };

  return (
    <div className="font-raleway">
      {notes.length === 0 ? (
        <div className="mx-20 my-20">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="text-gray-200 rounded-full p-6">
              <PackageIcon className="size-24" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl text-gray-200 font-raleway mt-10">
                You haven't made any notes yet
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 rounded-xl mt-10 mx-20">
          <ul className="space-y-4 px-5 py-3">
            {notes.map((note) => {
              const id = Number(note.id); // <-- coerce once
              return (
                <li key={id} className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-100 px-5 py-5 rounded-lg">
                    <span className="text-xl truncate max-w-[200px]">
                      {note.content}
                    </span>

                    {note.content?.length > 40 && (
                      <button
                        className=" hover:bg-[#02343F]/60 text-xl bg-[#02343F] text-gray-200 px-5 py-3 rounded-md"
                        onClick={() => toggleDrawer(id)} // <-- pass function
                      >
                        {openNoteId === id ? "Hide" : "View More"}
                      </button>
                    )}

                    <span className="text-2xl">{note.location}</span>
                    <span className="text-2xl">
                      {formatDate(note.created_at)}
                    </span>

                    <button
                      className="btn w-28 h-16 bg-red-200 rounded-md"
                      onClick={() => handleDelete(id)}
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>

                  {openNoteId === id && (
                    <div className="mt-3 p-4 bg-white/70 backdrop-blur-sm rounded-lg text-gray-900">
                      {note.content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notes;
