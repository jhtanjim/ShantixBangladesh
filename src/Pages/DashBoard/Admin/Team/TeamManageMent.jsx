import {
  ArrowDown,
  ArrowUp,
  Edit,
  EyeOff,
  Filter,
  Image as ImageIcon,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { FcCancel } from "react-icons/fc";
import Swal from "sweetalert2";
import {
  useCreateTeam,
  useDeleteTeam,
  useGetActiveTeam,
  useGetAllTeam,
  useRemoveTeamImage,
  useReorderTeam,
  useSoftDeleteTeam,
  useUpdateTeam,
  useUploadTeamImage,
} from "../../../../hooks/useTeam";

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    isActive: true,
  });

  // Queries
  const { data: activeTeam, isLoading: activeLoading } = useGetActiveTeam();
  const { data: allTeam, isLoading: allLoading } = useGetAllTeam();

  // Mutations - Create general mutations that can be used with different IDs
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam(); // General update mutation
  const deleteMutation = useDeleteTeam();
  const softDeleteMutation = useSoftDeleteTeam();
  const uploadImageMutation = useUploadTeamImage();
  const removeImageMutation = useRemoveTeamImage();
  const reorderMutation = useReorderTeam();

  const currentData = activeTab === "active" ? activeTeam?.data : allTeam?.data;
  const isLoading = activeTab === "active" ? activeLoading : allLoading;

  // Filter data based on search
  const filteredData =
    currentData?.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleOpenModal = (member = null) => {
    setSelectedMember(member);
    setImageFile(null);
    setImagePreview(null);

    if (member) {
      setFormData({
        name: member.name || "",
        position: member.position || "",
        bio: member.bio || "",
        isActive: member.isActive ?? true,
      });
    } else {
      setFormData({
        name: "",
        position: "",
        bio: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  // ✅ Fixed handleToggleActive function
  const handleToggleActive = async (memberId, memberName, currentStatus) => {
    console.log(
      "Toggle Active - Member ID:",
      memberId,
      "Current Status:",
      currentStatus
    ); // Debug log

    const action = currentStatus ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} member?`,
      text: `This will ${action} ${memberName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        console.log("Sending update request for member ID:", memberId); // Debug log

        // Method 1: If your mutation expects ID in the payload
        await updateMutation.mutateAsync({
          id: memberId,
          isActive: !currentStatus,
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Member has been ${action}d successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Update error:", error); // Debug log
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || `Failed to ${action} member`,
        });
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      isActive: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      position: formData.position,
      bio: formData.bio,
      isActive: formData.isActive,
    };

    try {
      let memberId;

      if (selectedMember) {
        // ✅ Update existing member - include ID in payload
        await updateMutation.mutateAsync({
          id: selectedMember.id,
          ...payload,
        });
        memberId = selectedMember.id;

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Team member updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Create new member
        const response = await createMutation.mutateAsync(payload);
        memberId = response.data.id;

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Team member created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Upload image if provided
      if (imageFile && memberId) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        try {
          await uploadImageMutation.mutateAsync({
            id: memberId,
            formData: imageFormData,
          });
        } catch (imageError) {
          console.error("Image upload failed:", imageError);
          Swal.fire({
            icon: "warning",
            title: "Partial Success",
            text: "Member saved but image upload failed. You can try uploading the image again.",
          });
        }
      }

      handleCloseModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async (memberId, memberName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete ${memberName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete permanently!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(memberId);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Team member has been permanently deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete team member",
        });
      }
    }
  };

  const handleSoftDelete = async (memberId, memberName) => {
    const result = await Swal.fire({
      title: "Hide team member?",
      text: `This will hide ${memberName} from public view. You can restore them later.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, hide member",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await softDeleteMutation.mutateAsync(memberId);
        Swal.fire({
          icon: "success",
          title: "Hidden!",
          text: "Team member has been hidden from public view.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to hide team member",
        });
      }
    }
  };

  // Add this compression function at the top of your component or in a separate utils file
  const compressImage = (
    file,
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8
  ) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file); // fallback if blob is null
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Replace your existing handleImageChange function with this:
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please select a valid image file (JPEG, PNG, WebP)",
        });
        return;
      }

      // Show loading while compressing
      Swal.fire({
        title: "Compressing image...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Compress image with your custom function
      const compressedFile = await compressImage(
        file,
        1200, // maxWidth
        800, // maxHeight
        0.8 // quality
      );

      // Close loading
      Swal.close();

      // Set compressed file
      setImageFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(compressedFile);

      // Show success message with size info
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      const compressionRatio = Math.round(
        (1 - compressedFile.size / file.size) * 100
      );

      // Only show compression stats if there was actual compression
      if (compressedFile.size < file.size) {
        Swal.fire({
          icon: "success",
          title: "Image compressed successfully!",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Image ready!",
          text: "Image is already optimized.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Image processing failed:", error);
      Swal.fire({
        icon: "error",
        title: "Processing Failed",
        text: "Failed to process image. Please try again.",
      });
    }
  };

  // Replace your existing handleImageUpload function with this:
  const handleImageUpload = async (memberId, memberName) => {
    const { value: file } = await Swal.fire({
      title: `Upload image for ${memberName}`,
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload team member image",
      },
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
    });

    if (file) {
      try {
        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/jpg",
        ];
        if (!allowedTypes.includes(file.type)) {
          Swal.fire({
            icon: "error",
            title: "Invalid File Type",
            text: "Please select a valid image file (JPEG, PNG, WebP)",
          });
          return;
        }

        // Show compression progress
        Swal.fire({
          title: "Processing image...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Compress image with your custom function
        const compressedFile = await compressImage(
          file,
          1200, // maxWidth
          800, // maxHeight
          0.8 // quality
        );

        // Create FormData with compressed file
        const formData = new FormData();
        formData.append("image", compressedFile);

        // Upload compressed image
        await uploadImageMutation.mutateAsync({
          id: memberId,
          formData,
        });

        // Show success with compression info
        const originalSizeKB = Math.round(file.size / 1024);
        const compressedSizeKB = Math.round(compressedFile.size / 1024);
        const compressionRatio = Math.round(
          (1 - compressedFile.size / file.size) * 100
        );

        if (compressedFile.size < file.size) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Image uploaded successfully!",
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Image uploaded successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message || "Failed to upload image",
        });
      }
    }
  };

  // ✅ Fixed handleImageRemove function
  const handleImageRemove = async (memberId, memberName) => {
    const result = await Swal.fire({
      title: "Remove image?",
      text: `This will remove the profile image for ${memberName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove image",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // ✅ Use the existing mutation and pass the ID in the payload
        await removeImageMutation.mutateAsync({
          id: memberId,
        });

        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "Image has been removed.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.message || "Failed to remove image",
        });
      }
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const reorderedData = [...filteredData];
    const [movedItem] = reorderedData.splice(fromIndex, 1);
    reorderedData.splice(toIndex, 0, movedItem);

    const reorderData = reorderedData.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    try {
      await reorderMutation.mutateAsync(reorderData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Team members reordered successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to reorder team members",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Team Management
        </h1>
        <p className="text-gray-600">
          Manage your team members and their information
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Active Members
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              All Members
            </button>
          </div>

          {/* Search and Add */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((member, index) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Member Image */}
            <div className="h-48 bg-gray-100 relative">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Reorder Controls */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <button
                  onClick={() => handleReorder(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleReorder(index, index + 1)}
                  disabled={index === filteredData.length - 1}
                  className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Member Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-blue-600 text-sm mb-2">{member.position}</p>
              {member.email && (
                <p className="text-gray-600 text-sm mb-1">{member.email}</p>
              )}
              {member.phone && (
                <p className="text-gray-600 text-sm mb-3">{member.phone}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(member)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleImageUpload(member.id, member.name)}
                  className="bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
                {member.image && (
                  <button
                    onClick={() => handleImageRemove(member.id, member.name)}
                    className="bg-orange-50 text-orange-600 px-3 py-2 rounded-md hover:bg-orange-100 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    console.log("Member object:", member); // Debug log
                    console.log("Member ID:", member.id); // Debug log
                    handleToggleActive(member.id, member.name, member.isActive);
                  }}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    member.isActive
                      ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {member.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No team members found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No members match your search criteria."
              : "Get started by adding your first team member."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add First Member
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {selectedMember?.image && !imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Current image:</p>
                      <img
                        src={selectedMember.image}
                        alt="Current"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active (visible on website)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <FcCancel className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
