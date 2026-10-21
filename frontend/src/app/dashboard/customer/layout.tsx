import CustomerSidebar from "@/components/dashboard/sidebars/CustomerSidebar"; // Adjust path if needed

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-shell flex flex-1 min-h-0 bg-background w-full">

            <CustomerSidebar />

            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* On mobile, add padding-top to account for the mobile menu bar */}
                <main className="flex-1 min-h-0 overflow-y-auto p-4 pt-16 pb-20 md:pt-6 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

        </div>
    );
}