import type { PropsWithChildren } from 'react';

import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem, type Kitchen } from '@/types';

interface AppHeaderLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    kitchen?: Kitchen;
}

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    kitchen,
}: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} kitchen={kitchen} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
