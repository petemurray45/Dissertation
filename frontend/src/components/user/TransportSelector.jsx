import { useState } from "react";
import { FaCar, FaWalking, FaBus } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";

const transportOptions = [
  { id: "car", label: "Car", icon: FaCar },
  { id: "walk", label: "Walk", icon: FaWalking },
  { id: "bike", label: "Cycle", icon: IoIosBicycle },
  { id: "public", label: "Transit", icon: FaBus },
];

function TransportSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-24 h-20 bg-white rounded-md overflow-y-auto flex items-center p-2 gap-4 ml-10">
      {transportOptions.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`w-16 h-16 flex flex-col items-center justify-center rounded-md border ${
            selected === id
              ? "bg-[#02343F] text-white border-[#02343F]"
              : "bg-gray-100 tex-gray-700 border-gray-300"
          } transition-all duration-200`}
          onClick={() => {
            setSelected(id);
            onSelect?.(id);
          }}
        >
          <Icon className="w-16 h-6 mb-1" />
        </button>
      ))}
    </div>
  );
}

export default TransportSelector;
