import React from "react";

function PropertyCard({ property }) {
  return (
    <div>
      <div className="card w-96 glass">
        <figure>
          <img src={image} alt="house" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{property.title}</h2>
          <p>{property.description}</p>
          <div className="card-actions justify-end">
            <p className="font-bold">£{property.price_per_month}</p>
            <button className="btn btn-primary">Select</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
