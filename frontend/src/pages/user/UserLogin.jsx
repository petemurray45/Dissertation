import Auth from "../../components/user/auth/UserAuth";

function UserLogin() {
  return (
    <div
      className="bg-radial-fade h-screen w-full flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to right top, #ffffff, #d3d4d9, #a5abb5, #778491, #49606e, #435f6c, #3e5e69, #395d66, #5d7d85, #829fa6, #a9c3c8, #d1e7eb)`,
      }}
    >
      <div>
        <Auth />
      </div>
    </div>
  );
}

export default UserLogin;
