import { useAgencyStore } from "../../utils/useAgencyStore";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
function EnquiriesModal({ agencyId, onClose }) {
  const {
    agency,
    enquiries,
    enquiriesLoading,
    enquiriesError,
    enquiriesPage,
    enquiriesLimit,
    enquiriesTotal,
    setEnquiriesPage,
    fetchAgencyEnquiries,
    updateEnquiryStatus,
  } = useAgencyStore();

  useEffect(() => {
    if (agencyId) fetchAgencyEnquiries(agencyId);
  }, [agencyId, enquiriesPage, enquiriesLimit, fetchAgencyEnquiries]);

  const totalPages = Math.max(1, Math.ceil(enquiriesTotal / enquiriesLimit));

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await updateEnquiryStatus(agency?.id, enquiryId, newStatus);
      toast.success("Enquiry status updated!");
    } catch (err) {
      console.error("Status update error", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="card bg-base-100 w-full relative">
      <Toaster
        position="top-center"
        containerClassName="!absolute !top-0"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontSize: "1.1rem",
            padding: "0.8rem 1.2rem",
            width: "full",
          },
        }}
      />
      <div className="w-full flex justify-between items-center mb-4">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="card-body border-2 rounded-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Enquiries Inbox
        </h2>

        {enquiriesLoading && (
          <p className="text-center">Loading enquiries...</p>
        )}
        {enquiriesError && (
          <p className="text-center text-error">{enquiriesError}</p>
        )}

        {(!enquiries || enquiries.length === 0) && !enquiriesLoading && (
          <p className="text-center text-gray-500">No enquiries found</p>
        )}

        <div className="space-y-6">
          {enquiries?.map((enquiry) => (
            <div key={enquiry.id} className="border rounded-lg p-4 shadow-sm">
              <p className="font-bold text-lg">
                {enquiry.property_title || "Untitled Property"} -{" "}
                <span className="text-sm text-gray-500">
                  {enquiry.property_location}
                </span>
              </p>
              <p className="text-sm mt-1">
                <span className="font-semibold">From:</span>{" "}
                {enquiry.user_full_name} ({enquiry.user_email})
              </p>
              <p className="mt-2">{enquiry.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                Sent: {new Date(enquiry.created_at).toLocaleString()}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <label className="label-text font-medium">Status:</label>
                <select
                  className="select select-bordered select-sm"
                  value={enquiry.status || "pending"}
                  onChange={(e) =>
                    handleStatusChange(enquiry.id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            className="btn btn-sm"
            disabled={enquiriesPage <= 1}
            onClick={() =>
              fetchAgencyEnquiries(agencyId, { page: enquiriesPage - 1 })
            }
          >
            Prev
          </button>
          <span className="mx-2">
            Page {enquiriesPage} of {totalPages || 1}
          </span>
          <button
            className="btn btn-sm"
            disabled={enquiriesPage >= totalPages}
            onClick={() =>
              fetchAgencyEnquiries(agencyId, { page: enquiriesPage + 1 })
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiriesModal;
