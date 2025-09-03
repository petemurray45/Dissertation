import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminCard({ icon, title, description, onClick, action }) {
  return (
    <div>
      <div className="card card-compact w-full p-5 bg-base-100 shadow-lg min-w-20 max-h-[250px] min-h-[250px] items-center font-raleway">
        <figure>{icon}</figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end p-5"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminCard;
