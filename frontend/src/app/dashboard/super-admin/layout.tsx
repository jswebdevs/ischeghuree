import SuperAdminSidebar from "@/components/dashboard/sidebars/SuperAdminSidebar"; // Adjust path if needed

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. bg-background handles theme responsiveness. 
    // 2. dashboard-shell locks the window to the viewport (see globals.css):
    //    the sidebar and navbar stay put and only <main> scrolls.
    <div className="dashboard-shell flex flex-1 min-h-0 bg-background w-full">
      
      <SuperAdminSidebar />
      
      {/* 3. Content column: <main> is the only scroll container. pb-20 on
          phones clears the fixed bottom nav. */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        
        {/* On mobile, add padding-top to account for the mobile admin menu bar */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 pt-16 pb-20 md:pt-6 md:p-6 lg:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}