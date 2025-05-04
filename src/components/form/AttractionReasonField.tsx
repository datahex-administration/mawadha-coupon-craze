
import React from 'react';
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FormSection from './FormSection';

interface AttractionReasonFieldProps {
  control: Control<any>;
}

const AttractionReasonField: React.FC<AttractionReasonFieldProps> = ({ control }) => {
  return (
    <FormSection>
      <FormField
        control={control}
        name="attractionReason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What attracts you the most in Mawadha?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please share what you like most about Mawadha"
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};

export default AttractionReasonField;
