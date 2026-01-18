import { type ReactNode } from 'react';

import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type Kitchen } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    kitchen?: Kitchen;
}

export default ({ children, breadcrumbs, kitchen, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} kitchen={kitchen} {...props}>
        {children}
    </AppLayoutTemplate>
);
