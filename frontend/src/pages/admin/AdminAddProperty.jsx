// AdminAddProperty.jsx
import React from "react";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAdminStore } from "../../utils/useAdminStore.js";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import PropertyModal from "../../components/admin/PropertyModal.jsx";

function AdminAddProperty() {
  const { addProperty } = useListingStore();
  const { token: adminToken } = useAdminStore();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await addProperty(payload, adminToken);
      navigate("/admin");
    } catch (err) {
      console.error("Failed to add property", err);
    }
  };

  return (
    <>
      <AdminNavBar />
      {/* Page shell */}
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
          <div className="max-w-[1100px] mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
              Add a Property
            </h1>
            {/* Same card layout as the modal component */}
            <PropertyModal
              initial={{}}
              isEdit={false}
              onSubmit={handleSubmit}
              onClose={() => navigate("/admin")}
              backTo="/admin"
              showAgencyPicker={true} // admin chooses the agency
              adminToken={adminToken}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminAddProperty;
