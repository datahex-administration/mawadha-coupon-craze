
import * as z from "zod";

export const registrationFormSchema = z.object({
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

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
