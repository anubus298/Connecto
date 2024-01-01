import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8)
  .max(20)
  .refine(
    (password: string) => {
      const hasLowercase = /[a-z]/.test(password);

      const hasDigit = /\d/.test(password);

      const errors: string[] = [];
      if (!hasLowercase) errors.push("at least one lowercase letter");

      if (!hasDigit) errors.push("at least one digit (0-9)");

      return errors.length === 0;
    },
    {
      message:
        "Password must be 8-20 characters long and include at least one lowercase letter, one uppercase letter, and one digit",
    }
  );

const emailSchema = z.string().email({
  message: "Invalid email address format",
});

const NameSchema = z.string().refine(
  (firstName: string) => {
    // Custom validation logic
    const isValidFormat = /^[a-zA-Z]+(?:\s[a-zA-Z]+){0,2}$/.test(firstName);

    return isValidFormat;
  },
  {
    message: "Invalid first name format.",
  }
);
const HexSchema = z.string().refine(
  (color: string) => {
    // Custom validation logic
    const isValidFormat = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

    return isValidFormat;
  },
  {
    message: "Invalid color format.",
  }
);

const Term = z.boolean().refine((value) => value === true, {
  message: "Required",
});

const ReviewZod = z.string().min(10).max(1000);

const ratingSchema = z.number().refine(
  (value: number) => {
    return value >= 0 && value <= 5 && value % 0.5 === 0;
  },
  {
    message: "Rating must be a number between 0.5 and 5 with a step of 0.5",
  }
);

const phoneNumberSchema = z.string().refine(
  (value) => {
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return phoneRegex.test(value);
  },
  {
    message: "Invalid phone number format",
  }
);

const genderSchema = z.string().refine(
  (value) => {
    const validGenders = ["male", "female"];
    return validGenders.includes(value.toLowerCase());
  },
  {
    message: "Invalid gender value",
  }
);

const ageGreaterThan18Schema = z.string().refine(
  (data) => {
    const today = new Date();
    const birthdate = new Date(data);
    const age = today.getFullYear() - birthdate.getFullYear();

    // Check if the calculated age is greater than 18
    return age > 18;
  },
  {
    message: "User must be 18 years or older.",
  }
);

export { passwordSchema };
export { ageGreaterThan18Schema };
export { genderSchema };
export { phoneNumberSchema };
export { Term };
export { ReviewZod };
export { emailSchema };
export { NameSchema };
export { ratingSchema };
export { HexSchema };
