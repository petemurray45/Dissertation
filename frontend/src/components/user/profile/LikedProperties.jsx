import { useEffect } from "react";
import { useListingStore } from "../../../utils/useListingsStore";
import { useUserStore } from "../../../utils/useUserStore";
import PropertyTile from "../PropertyTile";
import { PackageIcon } from "lucide-react";

function LikedProperties() {
  const { likedPropertyIds, addToLikes, user } = useUserStore();
  const { fetchProperties, properties } = useListingStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchProperties();
    }
  }, [properties.length, fetchProperties]);

  const toggleLike = async (property) => {
    if (!user) return;
    try {
      await addToLikes(property);
      console.log("property liked:", property.id);
    } catch (err) {
      console.log("Failed to like property", property.id);
    }
  };

  const likedProperties = properties.filter((property) =>
    likedPropertyIds.includes(property.id)
  );

  if (likedPropertyIds.length === 0) {
    return (
      <>
        <h1 className="text-5xl font-raleway text-text-[#02343F] mx-20">
          Liked Properties
        </h1>
        <div className="mx-20 my-20">
          <div className="flex flex-col justify-center items-center h-96">
            <div className="bg-base-100 rounded-full p-6">
              <PackageIcon className="size-24" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl  font-raleway">
                You haven't liked any properties yet
              </h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-5xl font-raleway text-text-[#02343F] mx-20">
        Liked Properties
      </h1>
      <div className="mx-20 my-10 rounded-lg">
        <div className="w-full grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 h-full">
          {likedProperties.map((property) => (
            <PropertyTile
              property={property}
              key={property.id}
              isLiked={likedPropertyIds.includes(property.id)}
              onToggleLike={() => toggleLike(property)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default LikedProperties;
