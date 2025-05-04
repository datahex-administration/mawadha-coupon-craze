
import React from 'react';
import { Form } from "@/components/ui/form";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import PersonalInfoFields from './form/PersonalInfoFields';
import ContactFields from './form/ContactFields';
import DemographicFields from './form/DemographicFields';
import AttractionReasonField from './form/AttractionReasonField';
import SubmitButton from './form/SubmitButton';

const RegistrationForm: React.FC = () => {
  const { form, isSubmitting, onSubmit } = useRegistrationForm();
  
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-mawadha-primary mb-6">
        Register for Gift Voucher
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields control={form.control} />
          <ContactFields control={form.control} />
          <DemographicFields control={form.control} />
          <AttractionReasonField control={form.control} />
          
          <SubmitButton 
            isSubmitting={isSubmitting} 
            label="Get Your Voucher" 
            submittingLabel="Processing..." 
          />
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
