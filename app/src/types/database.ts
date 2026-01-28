// Database schema types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'super_admin' | 'office_admin' | 'partner' | 'end_user';
          is_verified: boolean;
          avatar_url: string | null;
          notification_settings: Record<string, any> | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
      };
    };
  };
}
