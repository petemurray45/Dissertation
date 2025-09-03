import { useUserStore } from "../../../utils/useUserStore";
import { useState, useEffect } from "react";
import { PackageIcon } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";

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
      toast.success("Note deleted.");
      setNotes(updated);
    } catch (err) {
      console.error("Error deleting note", err);
      toast.error("Error deleting note.");
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
      <Toaster position="top-center" />
      {notes.length === 0 ? (
        <div className="px-4 md:px-8 max-w-4xl mx-auto my-12 md:my-20">
          <div className="flex flex-col justify-center items-center h-72 md:h-96">
            <div className="text-gray-200 rounded-full p-6">
              <PackageIcon className="size-16 md:size-24" />
            </div>
            <h3 className="mt-6 text-2xl md:text-4xl text-gray-200 text-center">
              You haven't made any notes yet
            </h3>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 rounded-xl mt-6 md:mt-10 px-4 md:px-8 py-4 max-w-full mx-5 md:mx-20">
          <ul className="space-y-4">
            {notes.map((note) => {
              const id = Number(note.id);
              const long = (note.content || "").length > 80;

              return (
                <li key={id} className="bg-gray-100 rounded-lg p-4 md:p-6">
                  {/* Stack on mobile; 4 columns on md+ */}
                  <div className="flex flex-col gap-3 md:grid md:grid-cols-[1fr_minmax(14rem,22rem)_auto_auto] md:items-center md:gap-x-6">
                    {/* content preview */}
                    <p className="text-base md:text-lg text-gray-900 line-clamp-2 md:line-clamp-1">
                      {note.content}
                    </p>

                    <span className="text-sm md:text-base text-gray-700 truncate">
                      {note.location}
                    </span>

                    {/* date (no wrap) */}
                    <span className="text-sm md:text-base text-gray-700 whitespace-nowrap">
                      {formatDate(note.created_at)}
                    </span>

                    {/* actions */}
                    <div className="flex gap-2 md:justify-end">
                      {long && (
                        <button
                          className="px-3 py-2 rounded-md bg-[#02343F] text-gray-100 text-sm md:text-base hover:bg-[#02343F]/90"
                          onClick={() => toggle(id)}
                        >
                          {openNoteId === id ? "Hide" : "View More"}
                        </button>
                      )}
                      <button
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                        onClick={() => handleDelete(id)}
                        aria-label="Delete note"
                      >
                        <MdDelete size={20} />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* expanded content */}
                  {openNoteId === id && (
                    <div className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg text-gray-900">
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
