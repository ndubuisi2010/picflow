import { Head, Link, usePage } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AppearanceToggleTab from '@/components/appearance-tabs';
// import { Toaster } from '@/components/ui/toaster';
// import { PageProps } from '@/types';

interface AuthLayoutProps {
  header?: string;
  children: React.ReactNode;
}

export default function ConsumerLayout({ header, children }: AuthLayoutProps) {
  const { auth } = usePage().props;

  return (
    <>
      <Head title={header || 'Dashboard'} />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              PIXORA
            </Link>

            <div className="flex items-center gap-6">
              {/* Theme Toggle */}
              <AppearanceToggleTab />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {auth.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                      <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/logout" method="post" as="button" className="w-full">
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Subheader */}
        {header && (
          <div className="border-b bg-muted/40">
            <div className="container mx-auto px-4 py-3">
              <h1 className="text-xl font-semibold">{header}</h1>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>

        {/* <Toaster /> */}
      </div>
    </>
  );
}