// AgencyEditProperty.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyModal from "../../components/admin/PropertyModal.jsx";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useAgencyStore } from "../../utils/useAgencyStore.js";
import { Toaster, toast } from "react-hot-toast";
import AdminNavBar from "../../components/admin/AdminNavBar.jsx";

function mapPropertyToForm(p) {
  // This is the same mapping function, can be moved to a shared utility file
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

function AgencyEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, fetchProperties, updateProperty, deleteProperty } =
    useListingStore();
  const { token: agencyToken, agency } = useAgencyStore();
  const agencyId = agency?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties(agencyToken).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [properties, fetchProperties, agencyToken]);

  useEffect(() => {
    if (!loading && agencyId != null) {
      const foundProperty = properties.find((p) => p.id === Number(id));

      if (foundProperty) {
        if (foundProperty.agency_id === agencyId) {
          setProperty(foundProperty);
        } else {
          toast.error("You can only edit your own properties.");
          navigate("/agency/dashboard");
        }
      }
    }
  }, [loading, properties, id, agencyId, navigate]);

  const handleSubmit = async (payload) => {
    try {
      await updateProperty(id, payload, agencyToken);
    } catch (err) {
      console.error("Failed to update property", err);
      toast.error("Something went wrong with the update.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id, agencyToken);
        toast.success(
          <span data-testid="toast-delete">Property Deleted!</span>
        );
        navigate("/agency/dashboard");
      } catch (err) {
        console.error("Failed to delete property", err);
        toast.error("Something went wrong with the deletion.");
      }
    }
  };

  const onClose = () => {
    navigate("/agency/dashboard");
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
        Property not found or you do not have permission to edit it.
        <button onClick={onClose} className="btn ml-4">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />

      <div
        className="container mx-auto px-4 py-6"
        data-testid="agency-edit-prop"
      >
        <h2 className="text-4xl mb-6">Edit Property</h2>
        <PropertyModal
          initial={mapPropertyToForm(property)}
          isEdit={true}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={onClose}
          showAgencyPicker={false}
          backTo="/agency/dashboard"
        />
      </div>
    </>
  );
}

export default AgencyEditProperty;
