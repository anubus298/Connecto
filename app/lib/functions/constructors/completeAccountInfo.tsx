import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  phoneNumberSchema,
  NameSchema,
  ageGreaterThan18Schema,
} from "../../zod/schemas";
export const completeAccountInfoAction = async (formData: FormData) => {
  "use server";
  const full_name = formData.get("full_name") as string;
  const address = formData.get("address") as string;
  const phone_number = formData.get("phone_number") as string;
  const birthday = formData.get("birthday") as string;
  // zod validation
  try {
    NameSchema.parse(full_name);
  } catch (_) {
    return redirect("/constructors/newAccount?message=Invalid Full name");
  }
  try {
    phoneNumberSchema.parse(phone_number);
  } catch (_) {
    return redirect("/constructors/newAccount?message=Invalid phone number");
  }
  try {
    ageGreaterThan18Schema.parse(birthday);
  } catch (_) {
    return redirect(
      "/constructors/newAccount?message=age must be greater than 18"
    );
  }
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("personal_info")
    .update({
      birthday: birthday,
      full_name: full_name,
      address: address,
      phone_number: phone_number,
      is_first_initialised: true,
    })
    .eq("id", user?.id as string)
    .select();
  if (error) {
    return redirect(
      "/constructors/newAccount?message=error accrued : " +
        error.message +
        " " +
        user?.id
    );
  }
  return redirect("/constructors/finishAccount");
};
