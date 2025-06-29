import axios from "axios";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

async function getTravelTimeInMinutes(origin, destination) {
  const result = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey,
        units: "metric",
      },
    }
  );
  const duration = res.data.rows[0].elements[0].duration.value;
  return Math.ceil(duration / 60);
}

export default getTravelTimeInMinutes;
