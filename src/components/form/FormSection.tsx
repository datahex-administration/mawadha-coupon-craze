
import React from 'react';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-mawadha-primary">{title}</h3>}
      {children}
    </div>
  );
};

export default FormSection;
