import axios from "axios";
import { useCallback, useState } from "react";

const Testimonial = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    rating: 5,
    comment: "",
    carModel: "",
  });

  const [image, setImage] = useState(null);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const compressImage = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const originalSize = file.size;

      if (originalSize < 500 * 1024) {
        setCompressionInfo({
          originalSize: (originalSize / 1024 / 1024).toFixed(2),
          compressedSize: (originalSize / 1024 / 1024).toFixed(2),
          compressionRatio: "0",
        });
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        let maxWidth, maxHeight, quality;

        if (originalSize > 5 * 1024 * 1024) {
          maxWidth = 800;
          maxHeight = 600;
          quality = 0.7;
        } else if (originalSize > 2 * 1024 * 1024) {
          maxWidth = 1000;
          maxHeight = 750;
          quality = 0.75;
        } else {
          maxWidth = 1200;
          maxHeight = 800;
          quality = 0.8;
        }

        const aspectRatio = width / height;

        if (width > maxWidth || height > maxHeight) {
          if (aspectRatio > 1) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        requestAnimationFrame(() => {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressionRatio = (
                  ((originalSize - blob.size) / originalSize) *
                  100
                ).toFixed(1);

                setCompressionInfo({
                  originalSize: (originalSize / 1024 / 1024).toFixed(2),
                  compressedSize: (blob.size / 1024 / 1024).toFixed(2),
                  compressionRatio,
                });

                resolve(blob);
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            "image/jpeg",
            quality
          );
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (image) {
        const compressed = await compressImage(image);

        const form = new FormData();
        form.append(
          "file",
          new File([compressed], image.name, { type: "image/jpeg" })
        );

        const uploadRes = await axios.post("/api/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      const finalData = {
        ...formData,
        imageUrl,
      };

      await axios.post("/api/testimonials", finalData);
      alert("Testimonial submitted!");

      setFormData({
        name: "",
        country: "",
        rating: 5,
        comment: "",
        carModel: "",
      });
      setImage(null);
      setCompressionInfo(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Submit a Testimonial</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="rating"
          type="number"
          max={5}
          min={1}
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating (1-5)"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Your feedback"
          rows={4}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="carModel"
          value={formData.carModel}
          onChange={handleChange}
          placeholder="Car Model (e.g., Honda CR-V 2020)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {compressionInfo && (
          <div className="text-sm text-gray-600">
            <p>Original Size: {compressionInfo.originalSize} MB</p>
            <p>Compressed Size: {compressionInfo.compressedSize} MB</p>
            <p>Compression: {compressionInfo.compressionRatio}%</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default Testimonial;
