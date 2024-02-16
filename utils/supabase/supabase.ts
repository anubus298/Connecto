export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          comment_id: number
          content: string
          created_at: string
          likes_count: number
          post_id: number
          replies_count: number
          user_id: string
        }
        Insert: {
          comment_id?: number
          content: string
          created_at?: string
          likes_count?: number
          post_id: number
          replies_count?: number
          user_id: string
        }
        Update: {
          comment_id?: number
          content?: string
          created_at?: string
          likes_count?: number
          post_id?: number
          replies_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments_like: {
        Row: {
          comment_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_like_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "comments_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          conversation_id: string
          created_at: string
          status: Database["public"]["Enums"]["conversation_status"] | null
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          conversation_id?: string
          created_at?: string
          status?: Database["public"]["Enums"]["conversation_status"] | null
          user_id_1: string
          user_id_2: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          status?: Database["public"]["Enums"]["conversation_status"] | null
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          action_timestamp: string | null
          action_user_id: string
          created_at: string
          friendship_id: number
          status: string
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          action_timestamp?: string | null
          action_user_id: string
          created_at?: string
          friendship_id?: number
          status: string
          user_id_1: string
          user_id_2: string
        }
        Update: {
          action_timestamp?: string | null
          action_user_id?: string
          created_at?: string
          friendship_id?: number
          status?: string
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_action_user_id_fkey"
            columns: ["action_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      group_admins: {
        Row: {
          admin_id: number
          created_at: string
          group_id: number
          user_id: string
        }
        Insert: {
          admin_id?: number
          created_at?: string
          group_id: number
          user_id: string
        }
        Update: {
          admin_id?: number
          created_at?: string
          group_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_admins_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      group_members: {
        Row: {
          created_at: string
          group_id: number
          group_member_id: number
          status: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: number
          group_member_id?: number
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: number
          group_member_id?: number
          status?: Database["public"]["Enums"]["group_member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      group_members_pending: {
        Row: {
          created_at: string
          group_id: number
          group_member_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: number
          group_member_id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: number
          group_member_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_pending_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_pending_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      group_posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          group_id: number
          id: number
          likes_count: number | null
          media_url: string | null
          share_source: number | null
          shares_count: number | null
          type: Database["public"]["Enums"]["group_post_type"]
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          group_id: number
          id?: number
          likes_count?: number | null
          media_url?: string | null
          share_source?: number | null
          shares_count?: number | null
          type?: Database["public"]["Enums"]["group_post_type"]
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          group_id?: number
          id?: number
          likes_count?: number | null
          media_url?: string | null
          share_source?: number | null
          shares_count?: number | null
          type?: Database["public"]["Enums"]["group_post_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_share_source_fkey"
            columns: ["share_source"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          cover_url: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          id: number
          logo_url: string | null
          members_count: number
          name: string
          privacy: Database["public"]["Enums"]["group_privacy"]
          rules: string[] | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: number
          logo_url?: string | null
          members_count?: number
          name: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          rules?: string[] | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: number
          logo_url?: string | null
          members_count?: number
          name?: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          rules?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          created_at: string
          like_id: number
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          like_id?: number
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          like_id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          is_read: boolean
          message_id: number
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          is_read?: boolean
          message_id?: number
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          is_read?: boolean
          message_id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          comments_count: number
          content_comment_id: number | null
          content_post_id: number | null
          created_at: string
          is_read: boolean
          is_seen: boolean
          likes_count: number
          notification_id: number
          recipient_user_id: string
          sender_id: string
          type: string
          updated_at: string
        }
        Insert: {
          comments_count?: number
          content_comment_id?: number | null
          content_post_id?: number | null
          created_at?: string
          is_read?: boolean
          is_seen?: boolean
          likes_count?: number
          notification_id?: number
          recipient_user_id: string
          sender_id: string
          type: string
          updated_at?: string
        }
        Update: {
          comments_count?: number
          content_comment_id?: number | null
          content_post_id?: number | null
          created_at?: string
          is_read?: boolean
          is_seen?: boolean
          likes_count?: number
          notification_id?: number
          recipient_user_id?: string
          sender_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_content_comment_id_fkey"
            columns: ["content_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "notifications_content_post_id_fkey"
            columns: ["content_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      personal_info: {
        Row: {
          address: string | null
          birthday: string | null
          created_at: string
          full_name: string | null
          id: string
          is_first_initialised: boolean | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_first_initialised?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_first_initialised?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_info_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          id: number
          likes_count: number | null
          media_url: string | null
          share_source: number | null
          shares_count: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: number
          likes_count?: number | null
          media_url?: string | null
          share_source?: number | null
          shares_count?: number | null
          type?: string
          user_id?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: number
          likes_count?: number | null
          media_url?: string | null
          share_source?: number | null
          shares_count?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_share_source_fkey"
            columns: ["share_source"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          friends_count: number
          id: string
          is_first_initialised: boolean
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          friends_count?: number
          id: string
          is_first_initialised?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          friends_count?: number
          id?: string
          is_first_initialised?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_group_admin: {
        Args: {
          new_admin_id: string
          target_group_id: number
          invoker_id: string
        }
        Returns: undefined
      }
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_post: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_posts_assets: {
        Args: {
          url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object:
        | {
            Args: {
              bucket: string
              object: string
            }
            Returns: Record<string, unknown>
          }
        | {
            Args: {
              object: string
            }
            Returns: Record<string, unknown>
          }
      get_non_friends: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          updated_at: string
          username: string
          avatar_url: string
          is_first_initialised: boolean
          bio: string
          cover_url: string
          friends_count: number
        }[]
      }
      get_unread_conversations_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      getmedia_url: {
        Args: {
          t_user_id: string
          limit_count: number
        }
        Returns: {
          urls: string
          id: number
        }[]
      }
      search_friend_profile: {
        Args: {
          name_search: string
        }
        Returns: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          friends_count: number
          id: string
          is_first_initialised: boolean
          updated_at: string | null
          username: string | null
        }[]
      }
      set_recent_notifications_as_read: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      conversation_status: "active" | "blocked"
      friend_type: "pending" | "accepted" | "rejected" | "blocked"
      group_member_status: "active" | "suspended" | "banned"
      group_post_type: "default" | "shared"
      group_privacy: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
