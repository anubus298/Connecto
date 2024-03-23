<h1 align="center">
  <br>
  <img src="https://github.com/anubus298/SafoMart/blob/SafoMart/images/safoMart.png" alt="Connecto" width="400"/>
  <br>
  Connecto
  <br>
</h1>
 
<p align="start">Connecto is a fullstack social media web app built using NextJS and Supabase.</p>

<h2  align="center"><a href="https://connecto-nine.vercel.app">Visit the website</a></h2>

<p align="">
  <a href="#key-features">Key Features</a><br>  
  <a href="#security">Security Measures</a><br>
  <a href="#built-with">Built With</a><br>
  <a href="#deep-dive">Deep Dive</a><br>  
  <a href="#state-management">State Management</a><br>
  <a href="#forms">Forms</a><br>
  <a href="#user-interface-and-design">User Interface and Design</a><br>
  <a href="#word">Word</a><br>
  <a href="#contact-me">Contact Me</a>
</p>

<p align="center">
  <img src="https://github.com/anubus298/SafoMart/blob/Connecto/assets/schema.png" width="600" />
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
- [Cypress](https://www.cypress.io)
- [Jest](https://jestjs.io/)
- [Zod](https://github.com/colinhacks/zod)
- [Emoji Picker React](https://www.npmjs.com/package/emoji-picker-react)
- [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component)
- [React Responsive](https://www.npmjs.com/package/react-responsive)

# Deep dive

## The Backend

This was my first time dealing with PostgreSQL, where I found it difficult at first. However, since I have a grasp of relational database concepts, it was just a matter of learning the SQL syntax. Supabase provides amazing features that simplify many things for me.

### Tables:

Creating tables and their relations was a continuous process. By that, I mean I started with the base tables (posts, profiles, personal_info), and every time I needed a new feature, I created the corresponding tables for it.

**Schema:**
<img src="https://github.com/anubus298/Connecto/blob/Connecto/assets/schema.png" width="600" />

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

### Authorization

When it comes to authorizations, I used the PostgreSQL RLS policies in addition to column privileges. Note that every action on a table requires user authentication, i.e., anonymous users can't interact with the database.

#### profiles

- **SELECT:** Profiles are viewable by non-blocked users.
- **UPDATE:** Users can update their own profile.

(Note: No insert policy for profiles, as rows are automatically added when a new user is registered.)

#### personal_info

- **SELECT:** Viewable only by the owner of the information.
- **UPDATE:** Update permitted only by the owner of the information.

(Note: No insert policy, similar to profiles.)

#### user_privacy_settings

- **SELECT:** Viewable for everyone.
- **UPDATE:** Permitted for the owner.

(Note: No insert policy, similar to profiles.)

#### posts

- **SELECT:** Viewable for public privacy posts and only to non-blocked users.
- **INSERT:** Allowed for everyone.
- **UPDATE:** Permitted for the owner.
- **DELETE:** Deletion permitted by the owner.

#### notifications

- **SELECT:** Notifications from non-blocked sender IDs are viewable for the recipient user ID.
- **UPDATE:** Update permitted for the owner, and only they can update the "is_seen" and "is_read" columns.

(Note: Notifications are inserted by triggers.)

#### conversations

- **SELECT:** Permitted for both conversation users.
- **INSERT:** Permitted for both conversation users when the conversation status is active.

(Note: Triggers update the status column based on special events, such as blocking/unblocking users.)

#### messages

- **SELECT:** Permitted for both conversation users.
- **INSERT:** Permitted for starting a new conversation by one of the friends.

#### likes

- **SELECT:** Permitted for non-blocked users' posts.
- **INSERT:** Permitted for non-blocked users' posts.
- **DELETE:** Permitted for the like owner.

#### friends

- **SELECT:** User's friends are visible if their friends_visibility is set to public or if the invoker is friends with the user.
- **INSERT:** Users can send requests with 'pending' status to non-existent friendships and non-blocked users.
- **UPDATE:** Users who are not the action_user_id can accept/reject the friendship by updating the status to either accepted or rejected.
- **DELETE:** Both users can delete/unfriend the friendship.

#### comments_like

- **SELECT:** Permitted for non-blocked users' comments.
- **INSERT:** Permitted for non-blocked users' posts.
- **DELETE:** Permitted for the like owner.

#### comments

- **SELECT:** Permitted for non-blocked users' posts.
- **INSERT:** Permitted for non-blocked users' posts.
- **DELETE:** Permitted for the comment owner.

#### bookmarks

- **SELECT:** Permitted for the bookmark owner.
- **INSERT:** Permitted for non-blocked users' posts.
- **DELETE:** Permitted for the bookmark owner.

## The Frontend

My frontend is built using Next.js, a powerful frameworks for creating dynamic and responsive web applications. I used Tailwind CSS for rapid styling and Ant Design for pre-designed UI components. FontAwesome adds a touch of visual flair with its extensive library of icons. Together, these technologies enable me to deliver a good looking website.

### App folder structure

```
app
├─ api
│  ├─ conversation
│  │  ├─ get
│  │  │  └─ route.ts
│  │  └─ messages
│  │     └─ route.ts
│  ├─ friends
│  │  ├─ getFriends
│  │  │  └─ route.ts
│  │  └─ search
│  │     └─ route.ts
│  ├─ post
│  │  ├─ getComments
│  │  │  └─ route.ts
│  │  └─ getPosts
│  │     └─ route.ts
│  └─ profile
│     ├─ get
│     │  └─ route.ts
│     ├─ getBookmarks
│     │  └─ route.ts
│     └─ getNotifications
│        └─ route.ts
├─ auth
│  ├─ callback
│  │  └─ route.ts
│  ├─ passwordReset
│  │  ├─ main_passwordReset.tsx
│  │  ├─ page.tsx
│  │  └─ update
│  │     └─ page.tsx
│  ├─ signIn
│  │  ├─ main_signIn.tsx
│  │  └─ page.tsx
│  ├─ signOut
│  │  └─ route.ts
│  └─ signUp
│     ├─ main_signUp.tsx
│     └─ page.tsx
├─ components
│  ├─ avatar_comp.tsx
│  ├─ blankLogo.tsx
│  ├─ left_home_panel_drawer.tsx
│  ├─ main.tsx
│  └─ navbar
│     ├─ announce_card.tsx
│     ├─ if_logged_bar.tsx
│     ├─ notifications_dropdown.tsx
│     ├─ notification_card.tsx
│     ├─ primary_navbar.tsx
│     ├─ search_bar.tsx
│     ├─ server_navbar.tsx
│     └─ suspense
│        └─ suspense_primary_navbar.tsx
├─ constructors
│  ├─ finishAccount
│  │  ├─ main_finishAccount.tsx
│  │  └─ page.tsx
│  └─ newAccount
│     ├─ main_newAccount.tsx
│     └─ page.tsx
├─ favicon.ico
├─ globals.css
├─ home
│  ├─ bookmarks
│  │  ├─ components
│  │  │  ├─ bookmark.tsx
│  │  │  └─ main_bookmarks.tsx
│  │  └─ page.tsx
│  ├─ communities
│  │  ├─ components
│  │  │  ├─ main_communities.tsx
│  │  │  └─ right_communities_panel.tsx
│  │  ├─ create
│  │  │  ├─

```

### State Management

I opted not to incorporate a state management tool like Redux or Jotai, considering it overkill for the project's scope. Instead, I leverage URL queries and database retrieval for state management. However, I did utilize React context for two specific features:

1. **Online Users:** This state keeps track of friends who are currently online.
2. **Number of Unread Messages:** It tracks the count of unread conversations for efficient user notifications.

### Forms

Forms played a crucial role in nearly every feature of the application. Leveraging the latest React features such as server actions, useState(), and useStatus(), I streamlined form handling significantly. Server actions proved to be far less time-consuming compared to router handlers, resulting in a substantial boost in my code writing efficiency. To ensure data validation, I adopted Zod, allowing me to create over 30 server actions .

### User Interface and Design

Ant Design proved to be an excellent choice for the UI library, offering a wide range of components for various use cases. I found its components to be comprehensive, eliminating the need for additional UI libraries. In terms of design, I drew inspiration from designs I encountered on Dribbble, adding my unique touch to create a visually appealing UI.
The primary color palette consisted of four colors: white 60%, black 5%, yellow 5%, and purple 30%, with purple serving as the theme color for the project.

### API Documentation

This section offers comprehensive details about the backend API, encompassing endpoints, request/response formats, and usage examples.

_Please note:_ The API design is streamlined due to leveraging features like React server components and server actions. Consequently, the focus is primarily on endpoints tailored for client-side data retrieval and interaction.

#### Endpoint: `/api/conversations/get`

- **Description**: Endpoint for retrieving conversations based on user ID and pagination.
- **Method**: `GET`
- **Request Parameters**:
  - `from` (string): Specifies the start index of the conversation range.
  - `to` (string): Specifies the end index of the conversation range.
- **Response Format**:
  - `data` (array): Array of conversation objects.
    - `conversation_id` (string): Unique identifier for the conversation.
    - `user_id` (object): Object containing information about the other user in the conversation.
      - `avatar_url` (string): URL of the user's avatar.
      - `username` (string): Username of the user.
      - `id` (string): Unique identifier of the user.
- **Usage Example**:

```bash
# Retrieve conversations
curl -X GET '/api/conversations/get?from=0&to=10' \
  -H "Authorization: Bearer {access_token}"
```

#### Endpoint: `/api/conversations/messages`

- **Description**: Endpoint for retrieving messages in a conversation based on conversation ID and pagination.
- **Method**: `GET`
- **Request Parameters**:
  - `id` (string): Specifies the conversation ID for which messages are to be retrieved.
  - `is_ascending` (string): Specifies whether messages should be retrieved in ascending order (`1`) or descending order (`0`).
  - `from` (string): Specifies the start index of the message range.
  - `to` (string): Specifies the end index of the message range.
- **Response Format**:
  - `data` (array): Array of message objects.
    - `message_id` (string): Unique identifier for the message.
    - `conversation_id` (string): Unique identifier for the conversation to which the message belongs.
    - `content` (string): Content of the message.
    - `created_at` (string): Timestamp indicating when the message was created.
    - `profiles` (object): Object containing information about the user who sent the message.
      - `user_id` (string): Unique identifier of the user.
      - `avatar_url` (string): URL of the user's avatar.
      - `username` (string): Username of the user.
- **Usage Example**:

```bash
# Retrieve messages in a conversation
curl -X GET '/api/messages?id={conversation_id}&is_ascending=1&from=0&to=20' \
  -H "Authorization: Bearer {access_token}"
```

#### Endpoint: `/api/friends/getFriends`

- **Description**: Endpoint for retrieving friends of a user based on pagination.
- **Method**: `GET`
- **Request Parameters**:
  - `from` (string): Specifies the start index of the friend list.
  - `to` (string): Specifies the end index of the friend list.
- **Response Format**:
  - `data` (array): Array of friend objects.
    - `user_id` (string): Unique identifier of the friend user.
    - `avatar_url` (string): URL of the friend's avatar.
    - `username` (string): Username of the friend.
- **Usage Example**:

```bash
# Retrieve friends list
curl -X GET '/api/friends/getFriends?from=0&to=20'
```

#### Endpoint: `/api/friends/search`

- **Description**: Endpoint for searching friend profiles based on a query string.
- **Method**: `GET`
- **Request Parameters**:
  - `query` (string): Specifies the search query.
- **Response Format**:
  - `data` (array): Array of friend profile objects matching the search query.
    - `user_id` (string): Unique identifier of the friend user.
    - `avatar_url` (string): URL of the friend's avatar.
    - `username` (string): Username of the friend.
- **Usage Example**:

```bash
# Search friend profiles
curl -X GET '/api/friends/search?query={search_query}'
```

#### Endpoint: `/api/post/getComments`

- **Description**: Endpoint for retrieving comments of a post based on post ID and pagination.
- **Method**: `GET`
- **Request Parameters**:
  - `id` (string): Specifies the post ID for which comments are to be retrieved.
  - `orderKey` (string, optional): Specifies the key to order the comments by.
  - `state` (string, optional): Specifies the state of comments to retrieve (e.g., approved or pending).
  - `from` (number, optional): Specifies the start index of the comment range.
  - `to` (number, optional): Specifies the end index of the comment range.
- **Response Format**:
  - `data` (array): Array of comment objects.
    - `comment_id` (string): Unique identifier for the comment.
    - `post_id` (string): Unique identifier for the post to which the comment belongs.
    - `content` (string): Content of the comment.
    - `created_at` (string): Timestamp indicating when the comment was created.
    - `user_id` (string): Unique identifier of the user who posted the comment.
    - `username` (string): Username of the user who posted the comment.
- **Usage Example**:

```bash
# Retrieve comments of a post
curl -X GET '/api/post/getComments?id={post_id}&orderKey={order_key}&state={state}&from={from_index}&to={to_index}'
```

#### Endpoint: `/api/post/getPosts`

- **Description**: Endpoint for retrieving posts with pagination.
- **Method**: `GET`
- **Request Parameters**:
  - `from` (number): Specifies the start index of the post range.
  - `to` (number): Specifies the end index of the post range.
  - `target` (string, optional): Specifies the target user ID to retrieve posts from.
- **Response Format**:
  - `data` (array): Array of post objects.
    - `post_id` (string): Unique identifier for the post.
    - `content` (string): Content of the post.
    - `created_at` (string): Timestamp indicating when the post was created.
    - `user_id` (string): Unique identifier of the user who posted the comment.
    - `username` (string): Username of the user who posted the comment.
    - `is_liked` (boolean): Indicates whether the post is liked by the authenticated user.
    - `is_saved` (boolean): Indicates whether the post is saved/bookmarked by the authenticated user.
- **Usage Example**:

```bash
# Retrieve posts with pagination
curl -X GET '/api/post/getPosts?from={start_index}&to={end_index}&target={user_id}'
```

#### Endpoint: `/api/profile/get`

- **Description**: Endpoint for retrieving profile information by profile ID.
- **Method**: `GET`
- **Request Parameters**:
  - `id` (string): Unique identifier of the profile to retrieve.
- **Response Format**:
  - `data` (object): Profile object containing the following fields:
    - `avatar_url` (string): URL of the profile avatar.
    - `username` (string): Username of the profile.
    - `id` (string): Unique identifier of the profile.
- **Usage Example**:

```bash
# Retrieve profile information by profile ID
curl -X GET '/api/profile/get?id={profile_id}'
```

#### Endpoint: `/api/profile/getBookmarks`

- **Description**: Endpoint for retrieving bookmarks of a user's profile.
- **Method**: `GET`
- **Request Parameters**:
  - `from` (number, optional): Starting index of the bookmarks to retrieve (default: 0).
  - `to` (number, optional): Ending index of the bookmarks to retrieve (default: 4).
- **Response Format**:
  - `data` (array): Array of bookmarked items, each containing relevant information.
- **Usage Example**:

```bash
# Retrieve bookmarks of a user's profile
curl -X GET '/api/profile/getBookmarks?from={from_index}&to={to_index}'
```

#### Endpoint: `/api/profile/getNotifications`

- **Description**: Endpoint for retrieving notifications of a user's profile.
- **Method**: `GET`
- **Request Parameters**:
  - `from` (number, optional): Starting index of the notifications to retrieve (default: 0).
  - `to` (number, optional): Ending index of the notifications to retrieve (default: 10).
- **Response Format**:

  - `data` (array): Array of notification objects, each containing relevant information.

- **Usage Example**:

```bash
# Retrieve notifications of a user's profile
curl -X GET '/api/profile/getNotifications?from={from_index}&to={to_index}'
```

# Word

"Overall, working on this project has been an immensely gratifying experience. I've learned a great deal throughout the development process, and I'm proud of the outcome. While the project is nearly complete, there are still some tests that need to be written to ensure its robustness and reliability."

[araristaf@gmail.com](mailto:araristaf@gmail.com) or [LinkedIn - Safouane el arari](https://www.linkedin.com/in/safouane-el-arari/).

# [araristaf@gmail.com](mailto:araristaf@gmail.com) or [LinkedIn - Safouane el arari](https://www.linkedin.com/in/safouane-el-arari/).
