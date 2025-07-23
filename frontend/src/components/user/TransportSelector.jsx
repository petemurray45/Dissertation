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
    <div className="w-24 h-20 bg-white rounded-md overflow-y-auto flex items-center p-2 gap-4 ml-10"></div>
  );
}

export default TransportSelector;
