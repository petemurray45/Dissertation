import React, { useEffect } from "react";
import AdminNavBar from "../../components/admin/adminNavBar";
import AdminHero from "../../components/admin/AdminHero";
import AdminCard from "../../components/admin/AdminCard";
import AddPropertyModal from "../../components/admin/AddPropertyModal";
import PropertyTile from "../../components/admin/PropertyTile";
import { IoCreateOutline } from "react-icons/io5";
import { MdBrowserUpdated } from "react-icons/md";
import { PackageIcon } from "lucide-react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useListingStore } from "../../listings/useListingsStore";
import { useNavigate, useParams } from "react-router-dom";

function AdminDashboard() {
  const { properties, loading, error, fetchProperties } = useListingStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  console.log("Properties: ", properties);

  return (
    <>
      <AdminNavBar />
      <AdminHero />
      <div className="flex flex-col overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 m-10">
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

        <div className="w-full justify-center align-middle">
          <h2 className="md:text-6xl sm:text-2xl text-3xl font-bold md:py-6 text-black pl-10 text-center">
            Current Listings
          </h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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
