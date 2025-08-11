import React, { useEffect } from "react";
import AdminNavBar from "../../components/admin/AdminNavBar";
import AdminHero from "../../components/admin/AdminHero";
import AdminCard from "../../components/admin/AdminCard";
import AddPropertyModal from "../../components/admin/AddPropertyModel.jsx";
import PropertyTile from "../../components/admin/PropertyTile";
import { IoCreateOutline } from "react-icons/io5";
import { MdBrowserUpdated } from "react-icons/md";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useListingStore } from "../../utils/useListingsStore.js";
import { useUserStore } from "../../utils/useUserStore.js";
import { useAgencyStore } from "../../utils/useAgencyStore.js";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { properties, loading, error, fetchProperties } = useListingStore();

  const { user } = useUserStore();
  const { agency } = useAgencyStore();

  const displayName = agency?.agency_name || user?.name || "Admin";

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const navigate = useNavigate();

  console.log("Properties: ", properties);

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
            onClick={() => {
              document.getElementById("add_property_modal").showModal();
            }}
            action="Add"
          />
          <AdminCard
            title="Update a property"
            icon={<MdBrowserUpdated className="size-11" />}
            description="Update an existing property"
            // onlcick =
            action="Update"
          />
          <AdminCard
            title="View properties"
            icon={<HiOutlineViewfinderCircle className="size-11" />}
            description="View all properties"
            // onclick=
            action="View"
          />
          <AdminCard
            title="Delete listing"
            icon={<MdOutlineDeleteOutline className="size-11" />}
            description="Delete a property"
            //onlick=
            action="Delete"
          />
        </div>

        <div className="flex items-center justify-center pl-10 pr-10 font-raleway">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 w-full  items-center ">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/admin/addproperty");
              }}
            >
              <PlusCircleIcon className="size-8 mr-2" />
              Add property
            </button>
            <h2 className="md:text-6xl sm:text-2xl text-3xl font-bold md:py-6 text-black pl-10 text-center w-full">
              Current Listings
            </h2>
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
                <PropertyTile property={property} key={property.id} />
              ))}
            </div>
          )}
        </div>

        <AddPropertyModal />
      </div>
    </>
  );
}

export default AdminDashboard;
