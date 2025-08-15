// AdminAddProperty.jsx

import React, { useEffect, useState } from "react";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAdminStore } from "../../utils/useAdminStore.js";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Toaster, toast } from "react-hot-toast";
import PropertyModal from "../../components/admin/PropertyModal.jsx";

// You need to define this function, as it was in AdminDashboard
// It maps the property data to the form format
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

  // Define state and handlers here for the new page
  const [editing, setEditing] = useState(null); // This is not needed for adding, but useful for a single component

  const handleSubmit = async (payload) => {
    // This function will now handle adding a property
    try {
      await addProperty(payload, adminToken);
      navigate("/admin"); // Redirect back to the dashboard after success
    } catch (err) {
      console.error("Failed to add property", err);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    // This function navigates away from the page
    navigate("/admin");
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-4xl mb-6">Add a Property</h2>
        <PropertyModal
          initial={{}} // For adding, initial is an empty object
          isEdit={false} // This is always false for adding a property
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
