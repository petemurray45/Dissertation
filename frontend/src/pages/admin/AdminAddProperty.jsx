import React, { useEffect, useState } from "react";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAdminStore } from "../../utils/useAdminStore.js";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Toaster, toast } from "react-hot-toast";
import AddPropertyModal from "../../components/admin/PropertyModal.jsx";

import {
  ArrowLeftIcon,
  House,
  PoundSterling,
  BedDouble,
  MapPinPlusInside,
  PlusCircleIcon,
  ImageIcon,
  Dog,
  Wifi,
  Toilet,
} from "lucide-react";
import axios from "axios";

function AdminAddProperty() {
  // data from lisitings store
  const { loading, addProperty } = useListingStore();
  const { token: adminToken } = useAdminStore();

  // used to navigate to different route
  const navigate = useNavigate();
  // gets property id from url

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <Toaster position="top-center" />
        <h2 className="text-4xl mb-6">Add a Property</h2>
        <AddPropertyModal
          loading={loading}
          onSubmit={async (payload) => {
            await addProperty(payload);
            toast.success("Property Added!");
            navigate("/admin");
          }}
          showAgencyPicker={true}
          adminToken={adminToken}
        />
      </div>
    </>
  );
}

export default AdminAddProperty;
