// Importing the ImagePreview component
import { Edit, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import "./sweetAlertImplement";
// Importing the EditForm component
import { EditForm } from "./EditForm";
export const GalleryItem = ({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onToggleStatus,
  onDragStart,
  onDragOver,
  onDrop,
  isLoading,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item)}
      className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-move"
    >
      <div className="relative">
        <ImagePreview
          src={item.image}
          alt={item.description}
          className="h-48 w-full"
        />

        <div className="absolute top-2 left-2">
          <button className="text-white hover:text-gray-200 bg-black bg-opacity-50 rounded p-1">
            <GripVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded">
            #{item.order}
          </span>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <EditForm
            item={item}
            onSave={onSave}
            onCancel={onCancelEdit}
            isLoading={isLoading}
          />
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>ID: {item.id}</span>
              <span>Order: {item.order}</span>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => onEdit(item.id)}
                className="flex items-center px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                title="Edit item"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onToggleStatus(item.id)}
                className={`flex items-center px-3 py-1 rounded transition-colors ${
                  item.isActive
                    ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                    : "text-green-600 bg-green-50 hover:bg-green-100"
                }`}
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                {item.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                title="Delete permanently"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
