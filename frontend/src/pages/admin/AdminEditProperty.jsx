// AdminEditProperty.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavBar from "../../components/admin/AdminNavBar";
import PropertyModal from "../../components/admin/PropertyModal.jsx";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAdminStore } from "../../utils/useAdminStore.js";

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

function AdminEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, updateProperty, deleteProperty, fetchProperty } =
    useListingStore();
  const { token: adminToken } = useAdminStore();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        await fetchProperty(id);
      } catch (err) {
        console.error("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    }

    const foundProperty = properties.find((p) => p.id === Number(id));

    if (foundProperty) {
      setProperty(foundProperty);
      setLoading(false);
    } else {
      loadProperty();
    }
  }, [id, fetchProperty, properties]);

  const handleSubmit = async (payload) => {
    try {
      await updateProperty(id, payload, adminToken);
      navigate("/agency/dashboard");
    } catch (err) {
      console.error("Failed to update property", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id, adminToken);
      navigate("/agency/dashboard");
    } catch (err) {
      console.error("Failed to delete property", err);
    }
  };

  const onClose = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center mt-10">
        Property not found.
        <button onClick={onClose} className="btn ml-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-4xl mb-6">Edit Property</h2>
        <PropertyModal
          initial={mapPropertyToForm(property)}
          isEdit={true}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={onClose}
          showAgencyPicker={!!adminToken}
          adminToken={adminToken}
        />
      </div>
    </>
  );
}

export default AdminEditProperty;
