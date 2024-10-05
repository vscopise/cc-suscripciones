// Usuario 
export interface plaUser {
    id: number;
    email: string;
    uuid: string;
    external_id: string;
    picture: string;
    admin: boolean;
    plan_admin: boolean;
    exhibition_mode: boolean;
    only_sees_readable: number;
    sessions_limit: number | null;
    user_plans: any[];
    role: string;
    can_be_edited: boolean;
    created_at_date_string: string;
    impersonation_url: string;
    user_plans_count: number,
    sessions: {
        user_id: number;
        seconds_reading: string;
        sessions: number;
    } | null;
    purchased_issues_with_cancelled_count: number,
    acquired_content_count: number,
    anonymized: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}