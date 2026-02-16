"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { User, LogOut, Mail, Shield, Package, ShoppingCart, Search, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/app/context/Cartcontext";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const { count } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const user = session?.user as any;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHomePage = pathname === "/";
    const showSolidHeader = !isHomePage || isScrolled || isMenuOpen;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (status === "unauthenticated") {
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                router.push("/login");
            }
        }
    }, [status, router]);

    const navLinks = [
        { name: "Products", href: "/products" },
        { name: "Categories", href: "/categories" },
        { name: "Deals", href: "/deals" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${showSolidHeader ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3" : "bg-transparent py-5"}`}>
            <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group relative z-110">
                    <div className="bg-blue-600 p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        Ecom
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-6">
                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-blue-300 dark:focus-within:border-blue-700 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95 bg-gray-100 dark:bg-gray-800 rounded-full"
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>

                    {/* Cart */}
                    <Link href="/cart" className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95">
                        <ShoppingCart className="w-6 h-6" />
                        {count > 0 && (
                            <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-900">
                                {count}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown / Auth Actions */}
                    {status === "loading" ? (
                        <div className="h-10 w-10 md:w-32 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    ) : status === "authenticated" ? (
                        <div className="hidden md:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all p-0">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={user?.image || ""} alt={user?.name} />
                                            <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-64 mt-2 rounded-2xl p-2 shadow-2xl border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden" align="end">
                                    <DropdownMenuLabel className="p-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100">{user?.name}</p>
                                            <p className="text-xs leading-none text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="mx-1 dark:bg-gray-800" />

                                    <div className="p-1">
                                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400 py-2.5">
                                            <Link href="/profile" className="flex items-center gap-3">
                                                <User className="w-4 h-4" /> <span>My Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400 py-2.5">
                                            <Link href="/orders" className="flex items-center gap-3">
                                                <Package className="w-4 h-4" /> <span>My Orders</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {user?.role === "ADMIN" && (
                                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400 py-2.5">
                                                <Link href="/admin" className="flex items-center gap-3">
                                                    <Shield className="w-4 h-4" /> <span>Admin Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </div>

                                    <DropdownMenuSeparator className="mx-1 dark:bg-gray-800" />

                                    <div className="p-1">
                                        <DropdownMenuItem
                                            onClick={() => signOut({ callbackUrl: "/login" })}
                                            className="rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-500 py-2.5 flex items-center gap-3"
                                        >
                                            <LogOut className="w-4 h-4" /> <span>Logout</span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2"
                            >
                                Login
                            </Link>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full px-6 transition-all shadow-lg shadow-blue-200 dark:shadow-none text-white font-bold">
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative z-110"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white dark:bg-gray-950 z-100 transition-all duration-500 md:hidden ${isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
                <div className="flex flex-col h-full pt-28 px-8 pb-12 overflow-y-auto">
                    {/* Search (Mobile) */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-5 py-4 mb-10 group focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all">
                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none text-base ml-3 w-full text-gray-900 dark:text-gray-100 placeholder-gray-400"
                        />
                    </div>

                    {/* Nav Links */}
                    <div className="flex flex-col gap-6 mb-12">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Navigation</p>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-8">
                        {status === "loading" ? (
                            <div className="w-full h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                        ) : status === "authenticated" ? (
                            <div className="grid gap-4">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user?.image || ""} />
                                        <AvatarFallback className="bg-blue-600 text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">{user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">View Account Settings</p>
                                    </div>
                                </Link>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                    >
                                        <Package className="w-6 h-6 mb-2" />
                                        <span className="text-xs font-bold">Orders</span>
                                    </Link>
                                    {user?.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                        >
                                            <Shield className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold">Admin</span>
                                        </Link>
                                    )}
                                </div>

                                <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="w-full flex items-center justify-center gap-2 py-5 text-red-600 dark:text-red-400 font-bold border-2 border-red-50 dark:border-red-900/20 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                                >
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">Get Started</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center py-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all"
                                    >
                                        Join Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
