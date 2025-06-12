import React from "react";

function AdminCard({ icon, title, description, onClick, action }) {
  return (
    <div>
      <div className="card card-compact w-full p-5 bg-base-100 shadow-2xl">
        <figure>{icon}</figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end p-5">
            <button className="btn btn-primary" onClick={onClick}>
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCard;
