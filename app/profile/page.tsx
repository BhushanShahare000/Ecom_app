"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { useEffect } from "react";
import { client } from "@/app/lib/apollo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/Cartcontext";
import Link from "next/link";
const ME_QUERY = gql`
  query {
    me {
      id
      name
      email
      role
    }
  }
`;

type MeData = {
    me: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
};

export default function ProfilePage() {
    const { count } = useCart();
    const { data: session, status } = useSession();
    const { data, loading, error } = useQuery<MeData>(ME_QUERY, { client });
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Loading profile...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading profile: {error.message}</p>
            </div>
        );

    const user = data?.me;
    if (!user)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">No user data found.</p>
            </div>
        );

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100">
            {/* Logo / Brand */}
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
                            <AvatarImage src={session?.user?.image || ""} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
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
                            <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="capitalize">{user.role.toLowerCase()}</span>
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
