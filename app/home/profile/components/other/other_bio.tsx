"use client";

function Other_bio({ bio }: { bio: string | null }) {
  return (
    <div className="flex justify-center ">
      {bio && (
        <div className="relative px-2 py-1 bg-gray-200 rounded-sm w-[280px]">
          <h6 className="text-center select-none">{bio}</h6>
        </div>
      )}
    </div>
  );
}

export default Other_bio;
