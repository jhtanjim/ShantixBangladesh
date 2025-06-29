// components/ShipSchedule/ShipScheduleCreate.jsx
import React, { useState } from 'react';
import ShipScheduleForm from './ShipScheduleForm';
import useShipSchedule from '../../../../hooks/useShipSchedule';
import Swal from 'sweetalert2';

const ShipScheduleCreate = ({ onClose, onSuccess }) => {
  const { createMutation } = useShipSchedule();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const result = await createMutation.mutateAsync(formData);
      
      if (result && (result.success !== false)) {
        Swal.fire({
          title: 'Created!',
          text: 'New schedule has been created successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        onClose?.();
      } else {
        throw new Error(result?.message || 'Creation failed');
      }
    } catch (error) {
      console.error('Create schedule error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to create schedule. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ShipScheduleForm
      title="Add New Schedule"
      onSubmit={handleSubmit}
      onCancel={onClose}
      isSubmitting={isSubmitting}
      submitText="Create Schedule"
    />
  );
};

export default ShipScheduleCreate;