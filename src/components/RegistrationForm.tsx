
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { countryCodes, validatePhoneNumber, generateCouponCode } from "../utils/countryCodes";
import { User } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  attractionReason: z.string().min(5, { message: "Please let us know what attracts you to Mawadha." }),
});

const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Validate phone number based on country code
    if (!validatePhoneNumber(values.whatsapp, values.countryCode)) {
      toast.error("Invalid phone number for selected country code");
      setIsSubmitting(false);
      return;
    }
    
    // Generate coupon code
    const couponCode = generateCouponCode(values.name);
    
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
    
    try {
      // In a real app, here we would save the data to Supabase
      console.log("User data to save:", user);
      
      // Store in localStorage for demo
      const existingUsers = JSON.parse(localStorage.getItem('mawadhaUsers') || '[]');
      
      // Check if phone number already exists
      const phoneExists = existingUsers.some(
        (u: User) => u.countryCode === user.countryCode && u.whatsapp === user.whatsapp
      );
      
      if (phoneExists) {
        toast.error("This phone number is already registered");
        setIsSubmitting(false);
        return;
      }
      
      // Add new user
      localStorage.setItem('mawadhaUsers', JSON.stringify([...existingUsers, user]));
      
      // Redirect to coupon page with the data
      navigate(`/coupon?code=${couponCode}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-mawadha-primary mb-6">
        Register for Gift Voucher
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.country} ({country.code})
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
                <FormItem className="space-y-3">
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Single" id="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Engaged" id="engaged" />
                        <Label htmlFor="engaged">Engaged</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Married" id="married" />
                        <Label htmlFor="married">Married</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
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
          
          <Button 
            type="submit" 
            className="w-full bg-mawadha-primary hover:bg-mawadha-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Get Your Voucher"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
