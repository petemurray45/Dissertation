// src/components/admin/AgencyManageModal.jsx
import { useEffect, useState } from "react";
import { X, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useAdminStore } from "../../utils/useAdminStore";

export default function ManageAgency({ open, onClose }) {
  const { agencies, loading, error, fetchAgencies, addAgency, deleteAgency } =
    useAdminStore();

  const [form, setForm] = useState({
    agency_name: "",
    agency_email: "",
    phone: "",
    website: "",
    logo_url: "",
    loginId: "",
  });

  useEffect(() => {
    if (open) fetchAgencies();
  }, [open, fetchAgencies]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.agency_name || !form.agency_email) return;
    await addAgency(form);
    setForm({
      agency_name: "",
      agency_email: "",
      phone: "",
      website: "",
      logo_url: "",
      loginId: "",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* modal */}
      <div
        className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in"
        data-testid="agency-manage-modal"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl md:text-2xl font-bold">Manage Agencies</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            data-testid="agency-close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* body */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Add form */}
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              className="input input-bordered"
              placeholder="Agency name *"
              name="agency_name"
              value={form.agency_name}
              onChange={onChange}
              data-testid="agency-add-name"
              required
            />
            <input
              className="input input-bordered"
              placeholder="Agency email *"
              name="agency_email"
              value={form.agency_email}
              onChange={onChange}
              type="email"
              data-testid="agency-add-email"
              required
            />
            <input
              className="input input-bordered"
              placeholder="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              data-testid="agency-add-phone"
            />
            <input
              className="input input-bordered"
              placeholder="Website (https://...)"
              name="website"
              value={form.website}
              onChange={onChange}
              data-testid="agency-add-website"
            />
            <input
              className="input input-bordered md:col-span-2"
              placeholder="Logo URL"
              name="logo_url"
              value={form.logo_url}
              onChange={onChange}
              data-testid="agency-add-logo"
            />
            <input
              className="input input-bordered md:col-span-2"
              placeholder="LoginID"
              name="loginId"
              value={form.loginId}
              onChange={onChange}
              data-testid="agency-loginId"
            />
            <button
              className="btn btn-primary md:col-span-2"
              type="submit"
              data-testid="agency-add-submit"
            >
              <PlusCircle className="size-5 mr-2" />
              Add Agency
            </button>
          </form>

          {error && <div className="alert alert-error">{error}</div>}

          {/* List */}
          <div className="bg-base-100 rounded-xl overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-16">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="hidden md:table-cell">Phone</th>
                    <th className="hidden md:table-cell">Website</th>
                    <th className="w-20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex items-center justify-center gap-2 py-6 text-gray-600">
                          <Loader2 className="size-5 animate-spin" /> Loading…
                        </div>
                      </td>
                    </tr>
                  ) : agencies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No agencies yet — add one above.
                      </td>
                    </tr>
                  ) : (
                    agencies.map((a) => (
                      <tr key={a.id}>
                        <td className="font-mono">{a.id}</td>
                        <td className="font-semibold">
                          <div className="flex items-center gap-2">
                            {a.logo_url ? (
                              <img
                                src={a.logo_url}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : null}
                            {a.agency_name}
                          </div>
                        </td>
                        <td>{a.agency_email}</td>
                        <td className="hidden md:table-cell">
                          {a.phone || "—"}
                        </td>
                        <td className="hidden md:table-cell">
                          {a.website ? (
                            <a
                              className="link"
                              href={a.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {a.website}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => deleteAgency(a.id)}
                            title="Delete"
                            data-testid={`agency-delete-${a.id}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-5 py-4 border-t flex justify-end">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
