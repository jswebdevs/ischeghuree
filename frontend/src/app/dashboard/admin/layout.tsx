"use client";

import AdminSidebar from "@/components/dashboard/sidebars/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // 1. bg-background handles theme responsiveness (dark/light mode).
        // 2. dashboard-shell locks the window to the viewport (see globals.css):
    //    the sidebar and navbar stay put and only <main> scrolls.
        <div className="dashboard-shell flex flex-1 min-h-0 bg-background w-full">

            {/* Specifically use the Admin-level sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">

                {/* RESPONSIVE PADDING:
            - pt-16: Accounts for the 14h mobile top bar + 2px buffer on phones.
            - md:pt-6: Standard padding on desktop where the sidebar is sticky.
        */}
                <main className="flex-1 min-h-0 overflow-y-auto p-4 pt-16 pb-20 md:pt-6 md:p-6 lg:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}