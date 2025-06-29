// components/ShipSchedule/ShipScheduleEdit.jsx
import React, { useState } from 'react';
import ShipScheduleForm from './ShipScheduleForm';
import useShipSchedule from '../../../../hooks/useShipSchedule';
import Swal from 'sweetalert2';

const ShipScheduleEdit = ({ schedule, onClose, onSuccess }) => {
  const { updateMutation } = useShipSchedule();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const result = await updateMutation.mutateAsync({ 
        id: schedule.id, 
        data: formData 
      });
      
      if (result && (result.success !== false)) {
        Swal.fire({
          title: 'Updated!',
          text: 'Schedule has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose?.();
      } else {
        throw new Error(result?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update schedule error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update schedule. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData = {
    title: schedule?.title || '',
    image: schedule?.image || '',
    description: schedule?.description || '',
    isActive: schedule?.isActive !== undefined ? schedule.isActive : true
  };

  return (
    <ShipScheduleForm
      title="Edit Schedule"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isSubmitting={isSubmitting}
      submitText="Update Schedule"
    />
  );
};

export default ShipScheduleEdit;