"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        alert("Payment successful! 🎉");
        const timer = setTimeout(() => router.push("/orders"), 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-white dark:bg-gray-950 transition-colors">
            <h1 className="text-3xl font-semibold text-green-600 dark:text-green-400 mb-2 transition-colors">
                ✅ Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
                Thank you for your purchase. Redirecting to your orders...
            </p>
        </div>
    );
}
