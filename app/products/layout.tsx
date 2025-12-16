import Header from "@/components/Header";

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Global Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 px-8 py-10">{children}</main>
        </div>
    );
}
