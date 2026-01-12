import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

import AdminAppLayout from '@/layouts/admin-layout';
import CreatorAppLayout from '@/layouts/creator-layout';
import ConsumerAppLayout from '@/layouts/consumer-layout';

interface RootLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  header?: string;
}

export default function RootLayout({ children, breadcrumbs, header }: RootLayoutProps) {
  const { auth } = usePage<PageProps>().props;

  const userRole = auth.user?.role;

  // Admin has highest priority
  if (userRole === 'admin') {
    return (
      <AdminAppLayout breadcrumbs={breadcrumbs} header={header}>
        {children}
      </AdminAppLayout>
    );
  }

  if (userRole === 'creator') {
    return (
      <CreatorAppLayout breadcrumbs={breadcrumbs} header={header}>
        {children}
      </CreatorAppLayout>
    );
  }

  // Default: Consumer
  return (
    <ConsumerAppLayout breadcrumbs={breadcrumbs} header={header}>
      {children}
    </ConsumerAppLayout>
  );
}