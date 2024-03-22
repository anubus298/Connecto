<h1 align="center">
  <br>
  <img src="https://github.com/anubus298/SafoMart/blob/SafoMart/images/safoMart.png" alt="Connecto" width="400"/>
  <br>
  Connecto
  <br>
</h1>
 
<p align="start">Connecto is a fullstack social media web app built using NextJS and Supabase.</p>

<h2  align="center"><a href="https://connecto-nine.vercel.app">Visit the website</a></h2>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#security-measures">Backend architecture</a> •
  <a href="#security-measures">Security Measures</a> •
  <a href="#built-with">Built With</a> •
  <a href="#additional-features">Additional Features</a> •
  <a href="#my-journey">My Journey</a> •
</p>

<p align="center">
  <img src="https://github.com/anubus298/SafoMart/blob/SafoMart/images/homePage.gif" width="600" />
</p>

# Key Features

- **User Authentication:** register, login, and utilize Google OAuth2 for secure access.
- **Posts Management:** Create, edit, delete, comment, like, and save posts.
- **News feed:** with infinite scrolling feature.
- **Friends Network:** Cultivate connections by building a network of friends and manage them with add/block functionalities.
- **Real-time Chat:** Engage in real-time conversations with friends through instant messaging.
- **Notifications and Inbox:** Stay updated with real-time notifications.
- **Search Functionality:** find users and posts with search capability.
- **Bookmarking:** Keep track of important posts by saving them for future reference.
- **Responsive Design:** across almost all devices.

# Security

- **User Authentication:** supabase authentification architecture.
- **Server Validation:** thanks to zod and Supabase.
- **Postgres Policies:** Safeguard your data by implementing access restrictions based on user roles, secure and controlled database interactions.
- **Secure API Endpoints:** Utilizing Next.js for server actions and route handlers ensures that database interactions are concealed, enhancing the security of the project's API endpoints.

# built with

This Project uses the following open source frameworks/libraries/Packages:

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FontAwesome](https://fontawesome.com/)
- [Geist UI](https://geist-ui.dev/)
- [Emoji Picker React](https://www.npmjs.com/package/emoji-picker-react)
- [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component)
- [React Responsive](https://www.npmjs.com/package/react-responsive)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io)
- [Zod](https://github.com/colinhacks/zod)

# Deep dive

## The Backend

This was my first time dealing with PostgreSQL, where I found it difficult at first. However, since I have a grasp of relational database concepts, it was just a matter of learning the SQL syntax. Supabase provides amazing features that simplify many things for me.

### Tables:

Creating tables and their relations was a continuous process. By that, I mean I started with the base tables (posts, profiles, personal_info), and every time I needed a new feature, I created the corresponding tables for it.

**Schema:**

### Triggers:

Triggers were pretty useful. Here's my list:

#### Profiles Table:

- ##### <span style="color:green">**update_friends_count_trigger:**</span> Increases or decreases the profiles.friends_count number when a friend relationship is made or removed.
- ##### <span style="color:green">**friendship_deleted_trigger:**</span> Decreases profiles.friends_count by one when a friendship is removed between two users.
- ##### <span style="color:green">**friend_request_notification:**</span> Pushes a new row to the user notifications when another user sends a friend request.
- ##### <span style="color:green">**friend_request_accepted_notification:**</span> Pushes a new row to the user notifications when another user accepts a friend request.
- ##### <span style="color:green">**delete_rejected_friendship_trigger:**</span> Deletes the friendship row when a user rejects a friend request.

#### Personal_Info Table:

- ##### <span style="color:green">**update_is_first_initialised_trigger:**</span> Updates personal_info.is_first_initialised to true when the user completes their account info.

#### Conversations Table:

- ##### <span style="color:green">**update_conversation_updated_at_trigger:**</span> Updates conversations.updated_at when a new message is sent in it.
- ##### <span style="color:green">**unblock_conversation_trigger:**</span> Sets conversations.status to NULL when a user unblocks another user, if a conversation exists between them.
- ##### <span style="color:green">**block_conversation_trigger:**</span> Sets conversations.status to 'blocked' when a user blocks another user, if a conversation exists between them.

#### Posts Table:

- ##### <span style="color:green">**shared_post_notification:**</span> Pushes a new row to the user notifications when another user shares their post.
- ##### <span style="color:green">**share_removed_trigger:**</span> Decreases posts.shares_count by one when a post is removed.
- ##### <span style="color:green">**profile_avatar_update:**</span> Pushes a new row in posts to describe avatar updates.
- ##### <span style="color:green">**post_like_notification:**</span> Pushes a new row to the user notifications when another user likes their post.
- ##### <span style="color:green">**likes_on_comment_added_trigger:**</span> Increases comments.likes_count by one when a user likes a comment.
- ##### <span style="color:green">**like_added_trigger:**</span> Increases post.likes_count by one when a user likes a post.
- ##### <span style="color:green">**increase_share_count_trigger:**</span> Increases post.shares_count by one when a user shares a post.
- ##### <span style="color:green">**decrease_likes_on_comment_count_trigger:**</span> Decreases comments.likes_count by one when a user unlikes a comment.
- ##### <span style="color:green">**decrease_likes_count_trigger:**</span> Decreases post.likes_count by one when a user unlikes a post.
- ##### <span style="color:green">**decrease_comment_count_trigger:**</span> Decreases post.comments_count by one when a comment is deleted.
- ##### <span style="color:green">**comment_added_trigger:**</span> Increases post.comments_count by one when a user comments on a post.

### Functions:

Functions provide alternative methods to perform certain tasks. Here's my list, categorized by their features:

#### Text Search Functions:

- ##### <span style="color:yellow">**search_text:**</span> Performs a text search and returns the result.
- ##### <span style="color:yellow">**get_search_profiles:**</span> Searches for usernames in profiles and returns the matching rows.
- ##### <span style="color:yellow">**get_search:**</span> Searches for content in posts and returns the matching posts.

#### Message Handling Functions:

- ##### <span style="color:yellow">**set_message_as_read:**</span> Updates the corresponding messages.is_read to true.
- ##### <span style="color:yellow">**set_recent_notifications_as_read:**</span> Updates the corresponding notifications.is_read to true.
- ##### <span style="color:yellow">**get_unread_conversations_count:**</span> Returns the number of conversations with the last non-self message as unread.
- ##### <span style="color:yellow">**get_last_message:**</span> Returns the last message of a conversation.

#### Profile and Media Functions:

- ##### <span style="color:yellow">**getmedia_url:**</span> Returns the last n URLs of the user's media files.
- ##### <span style="color:yellow">**get_non_friends:**</span> Returns the profiles of non-friends within a specified range.

### Storage:

The storage setup was pretty straightforward: you create buckets, each one with its own policies, allowed file types, and maximum upload file size. Here are my buckets:

#### <span style="color:blue">Posts Bucket</span>:

- **Max upload size:** 50MB per file
- **Allowed file types:** Images and videos
- **Policies:**
  - **DELETE:** Owners can delete files.
  - **INSERT:** Users can only insert into their own folders (user_id/post_id).
  - **SELECT:** Users can select only their own folders.

#### <span style="color:blue">Covers Bucket</span>:

- **Max upload size:** 6MB per file
- **Allowed file types:** PNG, JPG, JPEG, WEBP
- **Policies:**
  - **INSERT:** Users can only insert into their own folders (user_id/).
  - **SELECT:** Users can select only their own folders.

#### <span style="color:blue">Avatars Bucket</span>:

- **Max upload size:** 4MB per file
- **Allowed file types:** PNG, JPG, JPEG, WEBP
- **Policies:**
  - **INSERT:** Users can only insert into their own folders (user_id/).
  - **SELECT:** Users can select all files.

#### <span style="color:blue">Server Bucket (public files)</span>:

- **Max upload size:** 50MB per file
- **Allowed file types:** All
- **Policies:**
  - **SELECT:** Users can select all files.

### Authentication

Supabase provides complete authentication features that help me secure the application and manage user identities. Here's what I implemented:

#### User Authentication

Supabase offers various authentication methods to authenticate users. I used two:

- **Email/Password Authentication**: Users can sign up and log in to my application using their email address and password. Supabase handles user registration, password hashing, and session management.
- **OAuth Authentication**: Supabase supports OAuth authentication with providers such as Google, Facebook, GitHub, and others. I used only Google. Users can sign in to my application using their existing accounts with these providers.

#### Secure Authentication

Supabase takes security seriously and implements best practices to ensure secure authentication:

- **Password Hashing**: User passwords are securely hashed using industry-standard cryptographic algorithms to protect against password leaks and unauthorized access.

- **Session Security**: Supabase session tokens are encrypted and signed to prevent tampering and unauthorized access. Tokens have short expiration times to minimize the risk of session hijacking.

For detailed instructions on setting up and using Supabase Authentication, refer to the [official documentation](https://supabase.io/docs/guides/auth).

### Authorization

### API docs

[here]

# Thank You

It took a significant amount of time to complete the project, but the learning experience was invaluable. I take pride in the work I've accomplished. If you have any comments or questions, feel free to contact me through:

# [araristaf@gmail.com](mailto:araristaf@gmail.com) or [LinkedIn - Safouane el arari](https://www.linkedin.com/in/safouane-el-arari/).

[araristaf@gmail.com](mailto:araristaf@gmail.com) or [LinkedIn - Safouane el arari](https://www.linkedin.com/in/safouane-el-arari/).
