"use server";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { Database } from "@/utils/supabase/supabase";

export const addPostAction = async (formData: FormData) => {
  try {
    const supabase = createServerActionClient<Database>({ cookies });
    const content = formData.get("content") as string;
    const assets: File[] = [];
    let i = 0;
    while (formData.has(`file${i}`)) {
      assets.push(formData.get(`file${i}`) as File);
      i++;
    }

    if (assets.length === 0 && content.length === 0) {
      return 0;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: post_data, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            content: content,
            user_id: user?.id,
          },
        ])
        .select();

      if (postError) {
        throw new Error(postError.message);
      }

      if (assets.length > 0) {
        for (let i = 0; i < assets.length; i++) {
          const asset = assets[i];
          const { data: fileData, error: fileError } = await supabase.storage
            .from("posts")
            .upload(
              `public/${user.id}/${post_data[0].id}/${i + 1}.${asset.name.slice(asset.name.lastIndexOf(".") + 1)}`,
              asset,
              {
                cacheControl: "3600",
                upsert: false,
              }
            );

          if (fileError) {
            throw new Error(fileError.message);
          }
        }
        await supabase
          .from("posts")
          .update({
            media_url: `posts/public/${user.id}/${post_data[0].id}/${assets.map((asset, index) => `${index + 1}.${asset.name.slice(asset.name.lastIndexOf(".") + 1)}`).join(",")}`,
          })
          .eq("id", post_data[0].id);
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  revalidatePath("/home");
};
