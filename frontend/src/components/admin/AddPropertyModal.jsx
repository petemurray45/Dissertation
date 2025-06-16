import { useListingStore } from "../../listings/useListingsStore";
import {
  House,
  Text,
  PoundSterling,
  BedDouble,
  MapPinPlusInside,
  Compass,
} from "lucide-react";

function AddPropertyModal() {
  const { addProperty, formData, setFormData, loading } = useListingStore();

  return (
    <dialog id="add_property_modal" className="modal">
      <div className="modal-box">
        {/* Close Button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            X
          </button>
        </form>
        {/* Modal Header */}
        <h3 className="font-bold text-xl mb-8">Add New Property</h3>
        <form onSubmit={addProperty} className="space-y-6">
          {/*Property Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Property name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <House className="size-5" />
              </div>

              <input
                type="text"
                placeholder="Enter Property Name"
                className="input input-bordered w-full !pl-10 py-3 focus:input-primary transition-colors duration-200"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>

          {/* Property Description Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">
                Add a description
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <Text className="size-5" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default AddPropertyModal;
