// AgencyAddProperty.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyModal from "../../components/admin/PropertyModal.jsx";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAgencyStore } from "../../utils/useAgencyStore.js";
import { Toaster, toast } from "react-hot-toast";
import AdminNavBar from "../../components/admin/AdminNavBar.jsx";

function AgencyAddProperty() {
  const { addProperty } = useListingStore();
  const { token: agencyToken, agencyId } = useAgencyStore();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const payloadWithAgencyId = {
      ...payload,
      agency_id: agencyId,
    };

    try {
      await addProperty(payloadWithAgencyId, agencyToken);
      toast.success("Property added successfully!");
      navigate("/agency/dashboard"); 
    } catch (err) {
      console.error("Failed to add property", err);
      toast.error("Something went wrong with adding the property.");
    }
  };

  const handleClose = () => {
    navigate("/agency/dashboard"); 
  };

  return (
    <>
      <AdminNavBar />
      <Toaster />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-4xl mb-6">Add a New Property</h2>
        <PropertyModal
          initial={{}}
          isEdit={false}
          onSubmit={handleSubmit}
          onClose={handleClose}
          showAgencyPicker={false} // Agencies cannot assign properties to other agencies
        />
      </div>
    </>
  );
}

export default AgencyAddProperty;
