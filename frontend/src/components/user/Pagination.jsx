import { useListingStore } from "../../utils/useListingsStore";

function Pagination() {
  const { pagination, setPage, fetchPaginatedProperties } = useListingStore();
  const totalPages = Math.ceil(
    (pagination?.totalCount || 0) / (pagination?.perPage || 1)
  );

  return (
    <div className="flex justify-center my-8 gap-4 font-raleway">
      <button
        type="button"
        className="btn rounded-md bg-[#02343F] text-white"
        onClick={(e) => {
          e.preventDefault();
          setPage(pagination.currentPage - 1);
          fetchPaginatedProperties();
        }}
        disabled={pagination.currentPage <= 1}
      >
        Previous
      </button>
      <span className="self-center text-lg font-medium">
        Page {pagination.currentPage} of {totalPages || "?"}
      </span>
      <button
        type="button"
        className="btn rounded-md bg-[#f0edcc]"
        onClick={(e) => {
          e.preventDefault();
          setPage(pagination.currentPage + 1);
          fetchPaginatedProperties();
        }}
        disabled={pagination.currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
