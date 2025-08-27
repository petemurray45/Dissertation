import React, { useEffect, useState } from "react";
import AdminNavBar from "../../components/admin/AdminNavBar.jsx";
import AdminCard from "../../components/admin/AdminCard.jsx";
import PropertyTile from "../../components/admin/PropertyTile.jsx";
import { IoCreateOutline } from "react-icons/io5";
import { MdBrowserUpdated } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useAgencyStore } from "../../utils/useAgencyStore.js";
import { useNavigate } from "react-router-dom";
import EditAgencyModal from "../../components/admin/EditAgencyModal.jsx";
import EnquiriesModal from "../../components/admin/EnquiriesModal.jsx";

function AgencyDashboard() {
  const {
    agency,
    token: agencyToken,
    fetchPropertiesByAgency,
    loading,
    properties,
    error,
    page,
    limit,
    totalCount,
    setPage,
    setLimit,
  } = useAgencyStore();

  console.log("Agency token:", agencyToken);

  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [showEnquiries, setShowEnquiries] = useState(false);
  const [agencyDetails, setAgencyDetails] = useState(null);

  const navigate = useNavigate();

  const displayName = agency?.agency_name || "Admin";

  useEffect(() => {
    if (agency?.id) {
      fetchPropertiesByAgency(agency.id, agencyToken, { page, limit });
    }
  }, [agency?.id, agencyToken, fetchPropertiesByAgency, page, limit]);

  const openAgencyModal = () => {
    setAgencyDetails(agency);
    setIsAgencyModalOpen(true);
    document.getElementById("agency_modal")?.showModal?.();
  };

  const closeAgencyModal = () => {
    setIsAgencyModalOpen(false);
    setAgencyDetails(null);
    document.getElementById("agency_modal")?.close?.();
  };

  return (
    <>
      <AdminNavBar />
      <div className="mx-20 my-20">
        <h1 className="text-6xl text-center">
          Welcome <span data-testid="agency-name-display">{displayName}</span>
        </h1>
      </div>
      <div className="flex flex-col overflow-x-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 w-full gap-5 items-center">
            <button
              data-testid="add-property"
              aria-label="Add Property"
              className="btn btn-primary"
              onClick={() => navigate("/agency/addproperty")}
            >
              {" "}
              <PlusCircleIcon className="size-8 mr-2" />
              Add property
            </button>
            <button
              className="btn btn-secondary"
              onClick={openAgencyModal}
              data-testid="open-edit-agency"
            >
              <CiEdit className="size-8 mr-2" />
              Edit Agency Details
            </button>
            <button
              className="btn bg-gray-200"
              onClick={() => fetchPropertiesByAgency(agency.id, agencyToken)}
            >
              <RefreshCwIcon className="size-8" />
              Refresh
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => {
                setShowEnquiries(true);
                document.getElementById("enquiries_modal")?.showModal?.();
              }}
            >
              <CiMail className="size-8" />
              Enquiries Inbox
            </button>
          </div>
        </div>
        <div className="w-full p-10">
          {error && <div className="alert alert-error mb-8">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <>
              {properties?.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-96 space-y-4">
                  <div className="bg-base-100 rounded-full p-6">
                    <PackageIcon className="size-12" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-semibold">
                      No Properties found
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                      Get started by adding your first property
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
                    {properties?.map((property) => (
                      <PropertyTile
                        property={property}
                        key={property.id}
                        onEdit={() =>
                          navigate(`/agency/editproperty/${property.id}`)
                        }
                      />
                    ))}
                  </div>
                  <div className="flex justify-center items-center mt-8 space-x-4">
                    <button
                      className="btn btn-md rounded-md"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </button>
                    <span>
                      Page {page} of {Math.ceil(totalCount / limit) || 1}
                    </span>
                    <button
                      className="btn btn-md rounded-md"
                      disabled={page * limit >= totalCount}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>

                    <select
                      className="select select-bordered select-md ml-4 rounded-md"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                    >
                      <option value={6}>6 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <dialog id="agency_modal" className="modal">
          <div className="modal-box max-w-7xl">
            <EditAgencyModal
              initial={agencyDetails}
              onClose={closeAgencyModal}
              backTo="/agency/dashboard"
            />
          </div>
        </dialog>

        <dialog id="enquiries_modal" className="modal">
          <div className="modal-box max-w-5xl">
            <EnquiriesModal
              agencyId={agency?.id}
              onClose={() =>
                document.getElementById("enquiries_modal")?.close?.()
              }
            />
          </div>
        </dialog>
      </div>
    </>
  );
}

export default AgencyDashboard;
