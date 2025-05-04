import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate, Link } from 'react-router-dom';
import { countryCodes, validatePhoneNumber, generateCouponCode } from "../utils/countryCodes";
import { User } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  whatsapp: z.string().min(8, { message: "Phone number is required." }),
  age: z.string().min(1, { message: "Age is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, {
    message: "Please enter a valid age between 1 and 120."
  }),
  maritalStatus: z.enum(["Single", "Engaged", "Married"], {
    required_error: "Please select your marital status.",
  }),
  attractionReason: z.string().min(0, { message: "Please let us know what attracts you to Mawadha." }),
});

const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      countryCode: "+971",
      whatsapp: "",
      age: "",
      maritalStatus: "Single",
      attractionReason: "",
    },
  });

  const nextStep = () => {
    const { name, countryCode, whatsapp } = form.getValues();
    
    // Basic validation for the first step
    if (!name || name.length < 2) {
      form.setError("name", { message: "Name must be at least 2 characters." });
      return;
    }
    
    if (!countryCode) {
      form.setError("countryCode", { message: "Country code is required." });
      return;
    }
    
    if (!whatsapp || whatsapp.length < 8) {
      form.setError("whatsapp", { message: "Phone number is required." });
      return;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(whatsapp, countryCode)) {
      form.setError("whatsapp", { message: "Invalid phone number for selected country code." });
      return;
    }
    
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
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
      const user: User = {
        name: values.name,
        whatsapp: values.whatsapp,
        countryCode: values.countryCode,
        age: parseInt(values.age),
        maritalStatus: values.maritalStatus as 'Single' | 'Engaged' | 'Married',
        attractionReason: values.attractionReason,
        couponCode: couponCode,
        createdAt: new Date().toISOString(),
      };
      
      // Check if phone number already exists in Supabase
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('whatsapp', values.whatsapp)
        .eq('country_code', values.countryCode);
      
      if (fetchError) {
        console.error("Error checking for existing user:", fetchError);
        toast.error("There was an error checking your information. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      // If phone number already exists
      if (existingUsers && existingUsers.length > 0) {
        console.log("Phone number already exists:", existingUsers);
        toast.error("This phone number is already registered");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Inserting new user:", user);
      
      // Insert new user into Supabase
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          name: user.name,
          whatsapp: user.whatsapp,
          country_code: user.countryCode,
          age: user.age,
          marital_status: user.maritalStatus,
          attraction_reason: user.attractionReason,
          coupon_code: user.couponCode,
        }])
        .select();
      
      if (insertError) {
        console.error("Error submitting form:", insertError);
        toast.error("There was an error submitting your information. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Successfully registered user:", insertedUser);
      
      // Store in localStorage for backward compatibility (can be removed later)
      const existingLocalUsers = JSON.parse(localStorage.getItem('mawadhaUsers') || '[]');
      localStorage.setItem('mawadhaUsers', JSON.stringify([...existingLocalUsers, user]));
      
      // Success message
      toast.success("Registration successful!");
      
      // Redirect to coupon page with the code
      console.log("Redirecting to coupon page with code:", couponCode);
      navigate(`/coupon?code=${couponCode}`);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting your information. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-mawadha-primary mb-6">
        Register for Gift Voucher
      </h2>
      
      <div className="text-center text-mawadha-primary text-xs mb-4">
        <p>
          Already registered? <Link to="/coupon-status" className="text-mawadha-secondary underline">Check your coupon status</Link>
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="WhatsApp number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="button" 
                className="w-full bg-mawadha-primary hover:bg-mawadha-dark"
                onClick={nextStep}
              >
                Next Step
              </Button>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Engaged">Engaged</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
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
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  className="sm:w-1/3" 
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="sm:w-2/3 bg-mawadha-primary hover:bg-mawadha-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Get Your Voucher"}
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
