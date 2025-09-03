import React, { useEffect } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { useUserStore } from "../../../utils/useUserStore";

function statusBadgeClass(s) {
  switch ((s || "pending").toLowerCase()) {
    case "accepted":
      return "badge badge-success p-4";
    case "declined":
      return "badge badge-error p-4";
    default:
      return "badge badge-secondary p-4";
  }
}

function Enquiries() {
  const {
    enquiries,
    enquiriesLoading,
    enquiriesError,
    fetchUserEnquiries,
    hasHydrated,
    token,
  } = useUserStore();

  useEffect(() => {
    if (hasHydrated && token) fetchUserEnquiries();
  }, [hasHydrated, token, fetchUserEnquiries]);

  if (enquiriesLoading) return <div className="p-6">Loading enquiries...</div>;
  if (enquiriesError)
    return <div className="alert alert-error">{enquiriesError}</div>;
  if (!enquiries.length)
    return (
      <div className="p-6 w-full flex justify-center text-center text-gray-200 font-raleway">
        <MessageSquare className="mx-auto opacity-50" size={96} />
        <p className="text-3xl font-raleway">No enquiries submitted yet.</p>
      </div>
    );

  return (
    <div className="space-y-4 bg-gray-300 px-5 py-3 mx-5 md:mx-20 my-5 rounded-2xl">
      {enquiries.map((e) => (
        <div key={e.id} className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg">
              {e.propertyTitle || e.property_title || "Untitled Property"}
            </h3>
            <p className="text-base-content/60">
              {e.propertyLocation ||
                e.property_location ||
                `Property #${e.propertyId || e.property_id}`}
            </p>

            <p className="mt-2">{e.message}</p>

            <div className="mt-3 flex items-center justify-between">
              <span className={statusBadgeClass(e.status)}>{e.status}</span>
              <span className="text-sm text-base-content/60 flex items-center gap-1">
                <Clock size={14} />
                {new Date(e.createdAt || e.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Enquiries;
