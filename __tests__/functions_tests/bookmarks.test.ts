import { getBookmarks } from "@/app/lib/functions/getBookmarks";

const { SupabaseClient } = require("@supabase/supabase-js");

describe("bookmark function", () => {
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
  it("should return null when user_id is not provided", async () => {
    const bookmarks = await getBookmarks(supabase, 0, 10);
    expect(bookmarks).toBeNull();
  });

  it("should return bookmarks with post details including user_id, username and avatar_url when user_id is provided", async () => {
    const bookmarks = await getBookmarks(supabase, 0, 10, user_id);
    expect(bookmarks?.[0].user_id).toEqual(user_id);
  });
});
