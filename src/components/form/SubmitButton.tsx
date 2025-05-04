
import React from 'react';
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label: string;
  submittingLabel: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting, 
  label = "Submit", 
  submittingLabel = "Processing..." 
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-mawadha-primary hover:bg-mawadha-dark"
      disabled={isSubmitting}
    >
      {isSubmitting ? submittingLabel : label}
    </Button>
  );
};

export default SubmitButton;
