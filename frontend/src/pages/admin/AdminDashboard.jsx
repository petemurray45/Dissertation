import React, { useEffect, useState } from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminHero from "../../components/admin/AdminHero";
import AdminCard from "../../components/admin/AdminCard";
import PropertyTile from "../../components/admin/PropertyTile";
import { IoCreateOutline } from "react-icons/io5";
import { MdBrowserUpdated } from "react-icons/md";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useListingStore } from "../../utils/useListingsStore.js";
import ManageAgency from "../../components/admin/ManageAgency.jsx";
import { useNavigate } from "react-router-dom";
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

function AdminDashboard() {
  const {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  } = useListingStore();

  const { token: adminToken } = useAdminStore();

  const [agencyModalOpen, setAgencyModalOpen] = useState(false);

  console.log("Admin Token:", adminToken);

  const navigate = useNavigate();

  useEffect(() => {
    if (adminToken) {
      fetchProperties(adminToken);
    }
  }, [fetchProperties, adminToken]);

  return (
    <>
      <AdminNavBar />
      <AdminHero />
      <div className="flex flex-col  overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 m-10 font-raleway">
          <AdminCard
            title="Add a property"
            icon={<IoCreateOutline className="size-11" />}
            description="Add a property to the site"
            action="Add"
          />
          <AdminCard
            title="Update a property"
            icon={<MdBrowserUpdated className="size-11" />}
            description="Update an existing property"
            action="Update"
          />
          <AdminCard
            title="View properties"
            icon={<HiOutlineViewfinderCircle className="size-11" />}
            description="View all properties"
            action="View"
          />
          <AdminCard
            title="Delete listing"
            icon={<MdOutlineDeleteOutline className="size-11" />}
            description="Delete a property"
            action="Delete"
          />
        </div>

        <div className="flex items-center justify-center pl-10 pr-10 font-raleway">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 w-full  items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/addproperty")}
            >
              <PlusCircleIcon className="size-8 mr-2" />
              Add property
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setAgencyModalOpen(true)}
              data-testid="manage-agencies-open"
            >
              <PlusCircleIcon className="size-8 mr-2" />
              Manage Agencies
            </button>
            <button className="btn bg-gray-200 " onClick={fetchProperties}>
              <RefreshCwIcon className="size-8" />
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full p-10">
          {error && <div className="alert alert-error mb-8">{error}</div>}

          {properties.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="bg-base-100 rounded-full p-6">
                <PackageIcon className="size-12" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold">No Properties found</h3>
                <p className="text-gray-500 max-w-sm">
                  Get started by adding your first property
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {properties.map((property) => (
                <PropertyTile
                  property={property}
                  key={property.id}
                  onEdit={() =>
                    navigate(`/admin/properties/edit/${property.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ManageAgency
        open={agencyModalOpen}
        onClose={() => setAgencyModalOpen(false)}
      />
    </>
  );
}

export default AdminDashboard;
