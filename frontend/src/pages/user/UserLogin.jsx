import Auth from "../../components/user/Auth";

function UserLogin() {
  return (
    <div
      className="bg-radial-fade h-screen w-full flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to right bottom, #f0edcc, #bbc9ac, #89a690, #5c8378, #346060, #396067, #40606b, #49606e, #778491, #a5abb5, #d3d4d9, #ffffff)`,
      }}
    >
      <div>
        <Auth />
      </div>
    </div>
  );
}

export default UserLogin;
