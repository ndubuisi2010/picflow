import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import creators from '@/routes/admin/creators';
import { NavItem, type BreadcrumbItem } from '@/types';
import { BarChart3, LayoutGrid, Users } from 'lucide-react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: 'Creators',
    href: creators.index(),
    icon: Users,
  },
//   {
//     title: 'Photos',
//     href: photos.index(),
//     icon: Image,
//   },
  {
    title: 'Analytics',
    href: '/admin/analytics', // or add a Wayfinder route later
    icon: BarChart3,
  },
//   {
//     title: 'Settings',
//     href: settings(),
//     icon: Settings,
//   },
];
export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate mainNavItems={mainNavItems} breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
