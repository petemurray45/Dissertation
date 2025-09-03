import { CiTextAlignJustify } from "react-icons/ci";
import { useUserStore } from "../../../utils/useUserStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";

function MakeNote({ property }) {
  const { user, addNote, fetchNotes, deleteNote } = useUserStore();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addNote({ property_id: property.id, content });
      toast.success("Note saved!");
      setContent("");
    } catch (err) {
      console.error("Error submitting note", err);
      toast.error("Failed to save note.");
    }
  };

  const handleOpenDrawer = async () => {
    try {
      const response = await fetchNotes({ property_id: property.id });
      setNotes(response);
      console.log("notes response:", response);
      setShowDrawer(true);
    } catch (err) {
      console.log("Error fetching notes", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      const updated = await fetchNotes({ property_id: property.id });
      toast.success("Note deleted.");
      setNotes(updated);
    } catch (err) {
      console.error("Error deleting note", err);
      toast.error("Error deleting note.");
    }
  };
  return (
    <>
      <div className="bg-gray-300 px-2 py-2 rounded-2xl">
        <div className="bg-gray-100 px-8 py-8 rounded-2xl relative">
          <Toaster
            position="top-center"
            containerClassName="!absolute !top-0"
            toastOptions={{
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "1rem 1.5rem",
              },
            }}
          />
          {user ? (
            <div className="flex-col font-raleway text-gray-600">
              <div className="flex-col mt-5">
                <h1 className="text-2xl md:text-4xl">
                  Something you like about this property?
                </h1>
                <p className="text-xl md:text-2xl pt-5">
                  Why not make a note for later.
                </p>
              </div>
              <form className="grid grid-cols-1 gap-10" onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <CiTextAlignJustify size={24} />
                  </div>
                  <textarea
                    className="textarea textarea-bordered bg-white/90 backdrop-blur-sm w-full px-12 py-5 sm:text-xl mt-10 md:text-2xl resize-none h-52 md:h-80 text-gray-600"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="w-full flex justify-between">
                  <button
                    className="flex justify-center gap-4 sm:gap-2 px-2  items-center w-40 h-16 md:w-96 md:h-16 rounded-md bg-[#02343F] text-white text-sm md:text-2xl hover:bg-[#F0EDCC] hover:text-black"
                    type="button"
                    onClick={handleOpenDrawer}
                  >
                    View notes for this property
                    <FaArrowDown className="size-6 md:size-8" />
                  </button>
                  <button
                    className="sm:w-36 md:w-44 sm:h-12 md:h-16 px-2 rounded-md bg-[#02343F] text-gray-100 text-sm md:text-2xl hover:bg-[#F0EDCC] hover:text-black"
                    type="submit"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex w-full justify-center font-raleway text-gray-600 pt-10 md:pt-16">
              <div>
                <h1 className="text-2xl md:text-4xl text-center">
                  Something you like about this property you wish to make a note
                  of?
                </h1>
                <p className="text-xl md:text-2xl pt-5 text-center">
                  Create an acount or log in now to access this feature.
                </p>
                <div className="flex w-full justify-center pt-10">
                  <button
                    className="w-36 h-12 md:w-52 md:h-16 rounded-md bg-[#02343F] text-gray-200 hover:bg-[#F0EDCC] hover:text-black text-xl md:text-3xl flex justify-center items-center gap-4"
                    onClick={() => navigate("/login")}
                  >
                    Log in <FaArrowRight className="size-6 md:size-26" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDrawer && (
            <div className="w-full bg-white h-96 overflow-y-auto transition-transform duration-300 mt-10 rounded-3xl font-raleway">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl pt-5 px-5 text-gray-500">
                  Your notes on {property.location}
                </h2>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-5xl text-black pr-5"
                >
                  &times;
                </button>
              </div>

              {notes.length === 0 ? (
                <div>
                  <p className="flex w-full h-full justify-center items-start pt-20 text-2xl text-gray-500">
                    You dont have any notes on this property yet.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4 px-5 py-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex justify-between items-center bg-gray-100 px-5 py-5"
                    >
                      <span className="text-xl">{note.content}</span>
                      <button
                        className="btn w-28 h-16 bg-red-200 rounded-md"
                        onClick={() => handleDelete(note.id)}
                      >
                        <MdDelete size={24} />
                      </button>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MakeNote;
