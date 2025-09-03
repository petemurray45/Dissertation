// AdminAddProperty.jsx

import React, { useEffect, useState } from "react";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAdminStore } from "../../utils/useAdminStore.js";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Toaster, toast } from "react-hot-toast";
import PropertyModal from "../../components/admin/PropertyModal.jsx";


function mapPropertyToForm(p) {
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    price_per_month: p.price_per_month ?? "",
    propertyType: p.property_type ?? p.propertyType ?? "",
    ensuite: p.ensuite ?? "",
    bedType: p.bed_type ?? p.bedType ?? "",
    wifi: p.wifi ?? "",
    pets: p.pets ?? "",
    location: p.location ?? "",
    latitude: p.latitude ?? "",
    longitude: p.longitude ?? "",
    images: (p.imageUrls || p.images || []).map((u) => u),
    agency_id: p.agency_id ?? null,
  };
}

function AdminAddProperty() {
  const { addProperty } = useListingStore();
  const { token: adminToken } = useAdminStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(null); 

  const handleSubmit = async (payload) => {
    try {
      await addProperty(payload, adminToken);
      navigate("/admin"); 
    } catch (err) {
      console.error("Failed to add property", err);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    navigate("/admin");
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-4xl mb-6">Add a Property</h2>
        <PropertyModal
          initial={{}} 
          isEdit={false} 
          onSubmit={handleSubmit}
          onClose={handleClose}
          showAgencyPicker={!!adminToken}
          adminToken={adminToken}
        />
      </div>
    </>
  );
}

export default AdminAddProperty;
