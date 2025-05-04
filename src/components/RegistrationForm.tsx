
import React, { useState } from 'react';
import { Form } from "@/components/ui/form";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import PersonalInfoFields from './form/PersonalInfoFields';
import ContactFields from './form/ContactFields';
import DemographicFields from './form/DemographicFields';
import AttractionReasonField from './form/AttractionReasonField';
import SubmitButton from './form/SubmitButton';
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const RegistrationForm: React.FC = () => {
  const { form, isSubmitting, onSubmit } = useRegistrationForm();
  const [step, setStep] = useState(1);
  
  const handleNext = () => {
    // Trigger validation on first page fields
    form.trigger(['name', 'countryCode', 'whatsapp']);
    const hasErrors = !!form.formState.errors.name || 
                     !!form.formState.errors.countryCode || 
                     !!form.formState.errors.whatsapp;
    
    if (!hasErrors) {
      setStep(2);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-mawadha-primary mb-6">
        Register for Gift Voucher
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 ? (
            <>
              <PersonalInfoFields control={form.control} />
              <ContactFields control={form.control} />
              
              <Button 
                type="button" 
                onClick={handleNext} 
                className="w-full bg-mawadha-primary hover:bg-mawadha-dark flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <DemographicFields control={form.control} />
              <AttractionReasonField control={form.control} />
              
              <div className="space-y-4">
                <SubmitButton 
                  isSubmitting={isSubmitting} 
                  label="Get Your Voucher" 
                  submittingLabel="Processing..." 
                />
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
