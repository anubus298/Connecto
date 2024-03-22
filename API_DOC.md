### API Documentation

This section provides detailed information about the backend API, including endpoints, request/response formats, and usage examples.

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
