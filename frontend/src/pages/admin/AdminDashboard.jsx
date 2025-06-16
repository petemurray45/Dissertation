import React, { useEffect } from "react";
import AdminNavBar from "../../components/admin/adminNavBar";
import AdminHero from "../../components/admin/AdminHero";
import AdminCard from "../../components/admin/AdminCard";
import AddPropertyModal from "../../components/admin/AddPropertyModal";
import { IoCreateOutline } from "react-icons/io5";
import { MdBrowserUpdated } from "react-icons/md";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useListingStore } from "../../listings/useListingsStore";

function AdminDashboard() {
  const { properties, loading, error, fetchProperties, addProperty } =
    useListingStore();

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="h-full w-full">
      <AdminNavBar />
      <AdminHero />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10  h-[800px] m-10">
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

      <AddPropertyModal />
    </div>
  );
}

export default AdminDashboard;
