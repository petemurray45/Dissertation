export const handleSubmit = async (e) => {
  console.log("handleSubmit e:", e);
  e.preventDefault();

  try {
    const files = Array.from(fileInputRef.current?.files || []);
    const imageUrls = await uploadImagestoCloudinary(files);

    console.log("FORM DATA STATE:", formData);

    const finalPayload = {
      ...formData,
      images: imageUrls,
    };
    await addProperty(finalPayload);
    console.log("Sent final payload to backend", finalPayload);

    resetForm();
    toast.success("Property Added!");
  } catch (err) {
    console.log("Error in image upload", err);
    toast.error("Property creation failed.");
  }
};

export default handleSubmit;
