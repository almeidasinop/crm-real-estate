import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PropertyForm from '@/components/forms/PropertyForm';

interface PropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Record<string, any>;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const PropertyDialog: React.FC<PropertyDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  isEditing = false,
  onSuccess
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Propriedade' : 'Nova Propriedade'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações da propriedade selecionada.'
              : 'Preencha as informações para adicionar uma nova propriedade ao portfólio.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <PropertyForm
            initialData={initialData}
            isEditing={isEditing}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDialog;