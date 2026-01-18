import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    kitchens: Kitchen[];
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Kitchen {
    id: number;
    name: string;
    owner_id: number;
    owner: User;
    members?: User[];
    recipes?: Recipe[];
    members_count?: number;
    recipes_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Recipe {
    id: number;
    kitchen_id: number;
    created_by: number;
    title: string;
    description: string;
    image_path: string | null;
    image_url: string | null;
    kitchen?: Kitchen;
    creator?: User;
    ingredients?: Ingredient[];
    created_at: string;
    updated_at: string;
}

export interface Ingredient {
    id: number;
    recipe_id: number;
    amount: string;
    title: string;
    description: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface KitchenInvitation {
    id: number;
    kitchen_id: number;
    email: string;
    token: string;
    expires_at: string;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
}
