const { SupabaseClient } = require("@supabase/supabase-js");

import { getMyProfile } from "@/app/lib/functions/getMyProfile";

describe("testing getMyprofile", () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = new SupabaseClient(supabaseUrl, supabaseKey);
  let user_id = "";
  beforeAll(async () => {
    const {
      data: { user },
    } = await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
    user_id = user.id;
  });
  it("returns null when no user_id provided", async () => {
    const profile = await getMyProfile(supabase, undefined);
    expect(profile).toEqual(null);
  });
});
