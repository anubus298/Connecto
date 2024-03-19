describe("finish account", () => {
  // Successfully uploads avatar file and updates user profile with new username
  it("should successfully upload avatar file and update user profile", async () => {
    // Mock FormData
    const formData = new FormData();
    formData.append("avatarFile", new File(["avatar"], "avatar.png"));
    formData.append("username", "testuser");

    // Mock createServerActionClient
    const createServerActionClientMock = jest.fn().mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
      },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest
            .fn()
            .mockResolvedValue({ data: { path: "path/to/avatar" } }),
        }),
      },
      from: jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue({ data: {}, error: null }),
      }),
    });

    // Mock redirect
    const redirectMock = jest.fn();

    // Mock cookies
    const cookies = {};

    // Mock next/navigation
    const navigationMock = {
      redirect: redirectMock,
    };

    // Import finishAccountAction after mocking dependencies
    const {
      finishAccountAction,
    } = require("../../app/lib/functions/constructors/finishAccountInfo");

    // Call finishAccountAction
    await finishAccountAction(formData);

    // Assertions
    expect(createServerActionClientMock).toHaveBeenCalledWith({ cookies });
    expect(createServerActionClientMock().auth.getUser).toHaveBeenCalled();
    expect(createServerActionClientMock().storage.from).toHaveBeenCalledWith(
      "avatars"
    );
    expect(
      createServerActionClientMock().storage.from().upload
    ).toHaveBeenCalledWith("public/123/profile_v1.png", expect.any(File), {
      cacheControl: "3600",
      upsert: true,
    });
    expect(createServerActionClientMock().from).toHaveBeenCalledWith(
      "profiles"
    );
    expect(createServerActionClientMock().from().update).toHaveBeenCalledWith(
      { avatar_url: "path/to/avatar", username: "testuser" },
      { eq: { id: "123" } }
    );
    expect(redirectMock).toHaveBeenCalledWith("/");
  });
});
