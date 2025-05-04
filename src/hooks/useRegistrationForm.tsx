
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { validatePhoneNumber, generateCouponCode } from "@/utils/countryCodes";
import { supabase } from "@/integrations/supabase/client";
import { registrationFormSchema, RegistrationFormValues } from "@/utils/formSchemas";

export function useRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      countryCode: "+971",
      whatsapp: "",
      age: "",
      maritalStatus: "Single",
      attractionReason: "",
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    console.log("Form submission started with values:", values);
    setIsSubmitting(true);
    
    // Validate phone number based on country code
    if (!validatePhoneNumber(values.whatsapp, values.countryCode)) {
      toast.error("Invalid phone number for selected country code");
      setIsSubmitting(false);
      return;
    }
    
    // Generate coupon code
    const couponCode = generateCouponCode(values.name);
    console.log("Generated coupon code:", couponCode);
    
    // Create user object
    const user = {
      name: values.name,
      whatsapp: values.whatsapp.trim(),
      country_code: values.countryCode,
      age: parseInt(values.age),
      marital_status: values.maritalStatus,
      attraction_reason: values.attractionReason,
      coupon_code: couponCode,
    };
    
    try {
      // Check if the user already exists with this phone number
      console.log("Checking for existing user with:", values.countryCode, values.whatsapp);
      const { data: existingUser, error: lookupError } = await supabase
        .from('users')
        .select('coupon_code')
        .eq('country_code', values.countryCode)
        .eq('whatsapp', values.whatsapp.trim())
        .maybeSingle();
      
      console.log("Existing user check result:", existingUser, lookupError);
      
      if (lookupError) {
        console.error("Error checking existing user:", lookupError);
        toast.error("Error checking registration. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      if (existingUser) {
        // User already exists, redirect to their coupon
        console.log("User already exists, redirecting to coupon:", existingUser.coupon_code);
        toast.success('You are already registered. Redirecting to your coupon!');
        setTimeout(() => {
          navigate(`/coupon?code=${existingUser.coupon_code}`);
        }, 1000);
        setIsSubmitting(false);
        return;
      }
      
      // Insert user data into Supabase
      console.log("Inserting new user:", user);
      const { data: insertedUser, error } = await supabase
        .from('users')
        .insert([user])
        .select('coupon_code')
        .single();
      
      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Error registering. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Registration successful, inserted user:", insertedUser);
      
      // Redirect to coupon page with the data
      toast.success('Registration successful!');
      
      // Use the inserted user's coupon code if available, otherwise use the generated one
      const finalCouponCode = insertedUser?.coupon_code || couponCode;
      console.log("Redirecting to coupon:", finalCouponCode);
      
      // Immediate redirect to coupon page
      navigate(`/coupon?code=${finalCouponCode}`);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
}
