import {
  Star,
  Trash2,
  User,
  MapPin,
  Car,
  MessageSquare,
  Upload,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
} from "../../../../hooks/useTestimonial";

const Testimonial = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { mutateAsync: createTestimonial, isPending } = useCreateTestimonial();
  const { data, isLoading, error } = useTestimonials();
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);

    setAvatar(file);
  };

  const onSubmit = async (formDataInput) => {
    try {
      const formData = new FormData();
      for (let key in formDataInput) {
        formData.append(key, formDataInput[key]);
      }
      if (avatar) {
        formData.append("avatar", avatar);
      }

      await createTestimonial(formData);
      reset();
      setAvatar(null);
      setAvatarPreview(null);
      setShowForm(false);
      Swal.fire({
        title: "Success!",
        text: "Testimonial added successfully",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the testimonial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteTestimonial(id);
        Swal.fire({
          title: "Deleted!",
          text: "Testimonial has been removed.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Customer Testimonials
          </h1>
          <p className="text-gray-600">Manage and showcase customer feedback</p>
        </div>

        {/* Add Testimonial Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            {showForm ? "Cancel" : "Add New Testimonial"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="lg:w-10 w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Testimonial
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Country Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Country
                  </label>
                  <input
                    {...register("country", {
                      required: "Country is required",
                    })}
                    placeholder="Enter country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Rating Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Star className="w-4 h-4" />
                    Rating
                  </label>
                  <select
                    {...register("rating", { required: "Rating is required" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                    <option value="3">⭐⭐⭐ (3 stars)</option>
                    <option value="2">⭐⭐ (2 stars)</option>
                    <option value="1">⭐ (1 star)</option>
                  </select>
                  {errors.rating && (
                    <p className="text-red-500 text-sm">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                {/* Car Model Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Car className="w-4 h-4" />
                    Car Model
                  </label>
                  <input
                    {...register("carModel", {
                      required: "Car model is required",
                    })}
                    placeholder="Enter car model"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.carModel && (
                    <p className="text-red-500 text-sm">
                      {errors.carModel.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Comment Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  Comment
                </label>
                <textarea
                  {...register("comment", { required: "Comment is required" })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              {/* Avatar Upload */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Upload className="w-4 h-4" />
                  Upload Avatar (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Submitting..." : "Submit Testimonial"}
              </button>
            </div>
          </div>
        )}

        {/* Testimonials List */}
        {isLoading && (
          <p className="text-center text-gray-600">Loading testimonials...</p>
        )}
        {error && (
          <p className="text-center text-red-500">
            Failed to load testimonials.
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data &&
            data.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
                  title="Delete testimonial"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.avatarUrl ? (
                    <img
                      src={testimonial.avatarUrl}
                      alt={`${testimonial.name} avatar`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-indigo-500">
                      <User className="w-8 h-8" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.country}
                    </p>
                    <p className="text-sm text-indigo-600 font-medium">
                      {testimonial.carModel}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {testimonial.comment}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
