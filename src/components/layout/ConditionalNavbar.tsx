'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

export function ConditionalNavbar() {
    const pathname = usePathname();

    // Don't render Navbar on admin routes
    if (pathname.startsWith('/admin')) {
        return null;
    }

    return <Navbar />;
}
