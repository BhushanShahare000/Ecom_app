"use client";

import Link from "next/link";
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand & Mission */}
                <div className="space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg shadow-blue-200 dark:shadow-none">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">
                            Ecom<span className="text-blue-600 dark:text-blue-400">.</span>
                        </span>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs transition-colors">
                        Revolutionizing your shopping experience with premium products and seamless technology. Quality you can trust, delivered to your doorstep.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <a href="#" className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:scale-110 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-gray-400 dark:text-gray-500">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:scale-110 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-gray-400 dark:text-gray-500">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:scale-110 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-gray-400 dark:text-gray-500">
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="text-center sm:text-left mt-4 sm:mt-0">
                    <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-8">Shop Selection</h4>
                    <ul className="space-y-5">
                        <li><Link href="/products" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Products</Link></li>
                        <li><Link href="/categories" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Featured Categories</Link></li>
                        <li><Link href="/deals" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Special Deals</Link></li>
                        <li><Link href="/new-arrivals" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="text-center sm:text-left">
                    <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-8">Customer Care</h4>
                    <ul className="space-y-5">
                        <li><Link href="/help" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
                        <li><Link href="/shipping" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shipping Info</Link></li>
                        <li><Link href="/returns" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Returns & Exchanges</Link></li>
                        <li><Link href="/contact" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
                    <h4 className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em] mb-8">Get in Touch</h4>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 justify-center sm:justify-start">
                            <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                123 E-Commerce Ave,<br />Digital City, 10101
                            </span>
                        </li>
                        <li className="flex items-center gap-4 justify-center sm:justify-start">
                            <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-4 justify-center sm:justify-start">
                            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">support@ecom.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 border-t border-gray-100 dark:border-gray-900 flex flex-col lg:flex-row justify-between items-center gap-6">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-center lg:text-left">
                    © {new Date().getFullYear()} Ecom Inc. Crafted with passion for a premium shopping experience.
                </p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                    <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
                    <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
                    <Link href="/cookies" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}
