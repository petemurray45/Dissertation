import { useUserStore } from "../../../utils/useUserStore";

function LikedProperties() {
  const { user, likedPropertyIds } = useUserStore();
  return (
    <>
      <h1 className="text-5xl font-raleway text-text-[#02343F] mx-20">
        Liked Properties
      </h1>
      <div className=" h-96 mx-20 my-10 bg-gray-300 rounded-lg"></div>
    </>
  );
}

export default LikedProperties;
