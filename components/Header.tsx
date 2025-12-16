"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Mail, Shield } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/Cartcontext";
import Link from "next/link";

export default function Header() {
    const { count } = useCart();
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user as any;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading")
        return (
            <div className="flex justify-center items-center h-16 bg-white border-b">
                <p className="text-gray-500 text-sm">Loading user...</p>
            </div>
        );

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                <span className="text-2xl font-semibold text-blue-600">MyApp</span>
            </div>
            <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {count}
                    </span>
                )}
            </Link>
            {/* Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full">
                        <Avatar>
                            <AvatarImage src={user?.image || ""} alt={user?.name} />
                            <AvatarFallback>
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-72 mt-2">
                    <DropdownMenuLabel className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Profile
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <div className="px-3 py-2 space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{user?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="capitalize">{user?.role?.toLowerCase()}</span>
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        asChild
                        className="text-red-600 cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Logout
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
}
