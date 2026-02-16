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
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your profile...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] px-6 text-center">
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-full mb-6 text-red-600 dark:text-red-400">
                    <Shield className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{error.message}</p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 rounded-full px-8">Try Again</Button>
            </div>
        );

    const user = data?.me;
    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Profile Information */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm transition-all text-center">
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 mx-auto border-4 border-blue-50 dark:border-blue-900 shadow-xl mb-6">
                            <AvatarImage src={session?.user?.image || ""} alt={user.name} />
                            <AvatarFallback className="bg-blue-600 text-white text-4xl font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{user.name}</h2>
                            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase">{user.role}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                                <span className="text-sm truncate w-full text-left">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                                <span className="text-sm text-left">Account Security: <span className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-[10px]">High</span></span>
                            </div>
                        </div>

                        <Button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            variant="outline"
                            className="w-full mt-10 rounded-2xl py-6 border-red-50 dark:border-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Dashboard Stats & Quick Links */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Personal <span className="text-blue-600 dark:text-blue-400">Dashboard</span></h1>
                        <p className="text-gray-500 dark:text-gray-400">Welcome back! Manage your orders, addresses, and account security here.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/orders" className="group p-8 bg-blue-600 rounded-4xl text-white shadow-xl shadow-blue-200 dark:shadow-none hover:scale-[1.02] transition-all duration-300">
                            <ShoppingCart className="w-10 h-10 mb-6 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-2xl font-bold mb-2">My Orders</h3>
                            <p className="text-blue-100 text-sm">View order history and tracking status.</p>
                        </Link>

                        <div className="p-8 bg-white dark:bg-gray-900 rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
                            <User className="w-10 h-10 mb-6 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Personal Info</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Update your name, email, and password.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-8 md:p-10 transition-colors">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                            Recent Activity
                        </h4>
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4 pb-6 border-b border-gray-200/50 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0 animate-pulse" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Profile successfully updated</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Successfully modified your personal information on {new Date().toLocaleDateString()}.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
