import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import { NavItem, type BreadcrumbItem } from '@/types';
import { BarChart3, Image, LayoutGrid, Settings, Upload, User } from 'lucide-react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'My Photos',
    href: '/creator/photos',
    icon: Image,
  },
  {
    title: 'Upload Photo',
    href: '/creator/photos/create',
    icon: Upload,
  },
  {
    title: 'Analytics',
    href: '/creator/analytics',
    icon: BarChart3,
  },
  // {
  //   title: 'Profile',
  //   href: '/creator/profile',
  //   icon: User,
  // },
  // {
  //   title: 'Settings',
  //   href: '/creator/settings',
  //   icon: Settings,
  // },
];
export default ({ children, breadcrumbs, ...props }:  AppLayoutProps) => (
    <AppLayoutTemplate  mainNavItems={mainNavItems} breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
