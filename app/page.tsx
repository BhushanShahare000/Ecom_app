import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:h-[85vh] flex items-center overflow-hidden pt-20 lg:pt-0">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-blue-50/50 dark:bg-blue-900/10 -skew-x-12 transform origin-top translate-x-32 -z-10 transition-colors hidden lg:block" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl -z-10 animate-pulse transition-colors" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left duration-1000 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors mb-2">
              <Zap className="w-3 h-3" /> New Season Arrival
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-[1.1] tracking-tighter transition-colors">
              Elevate Your <br className="hidden sm:block" />
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Lifestyle</span> Style
            </h1>
            <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-colors">
              Discover our curated collection of premium essentials designed for modern living. Quality craftsmanship meets contemporary design.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 border-none">
                <Link href="/products" className="flex items-center gap-2">
                  Shop Collection <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12 pt-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">25k+</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 transition-colors">Happy Customers</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">4.9/5</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 transition-colors">Average Rating</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">120+</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 transition-colors">Premium Brands</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 lg:block">
            <div className="relative w-full aspect-square max-w-[300px] sm:max-w-md lg:max-w-xl mx-auto">
              {/* Decorative Rings */}
              <div className="absolute inset-0 border-2 border-blue-100 dark:border-blue-900/30 rounded-full scale-110 animate-[spin_20s_linear_infinite] transition-colors hidden sm:block" />
              <div className="absolute inset-4 border border-blue-50 dark:border-blue-900/20 rounded-full scale-125 transition-colors hidden sm:block" />

              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl rotate-3 sm:rotate-6 lg:rotate-3 hover:rotate-0 transition-transform duration-700 bg-gray-100 dark:bg-gray-800">
                <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                  alt="Hero Product"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Cards - Minimal version for mobile */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-10 sm:-left-10 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 font-bold transition-colors text-sm sm:text-base">
                    40%
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 leading-none transition-colors text-xs sm:text-sm">Summer Sale</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 pt-1 transition-colors uppercase tracking-widest font-bold">Limited Offer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 lg:p-14 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-50 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 transition-all">
          <div className="flex items-center gap-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 transition-colors text-lg sm:text-base">Fast Delivery</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Worldwide shipping in 3 days</p>
            </div>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 transition-colors shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 transition-colors text-lg sm:text-base">Secure Payment</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">100% encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 transition-colors text-lg sm:text-base">Easy Returns</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">30-day hassle-free returns</p>
            </div>
          </div>
          <div className="flex items-center gap-5 sm:flex-col sm:items-start lg:flex-row lg:items-center">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 transition-colors text-lg sm:text-base">24/7 Support</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Expert assistance anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Shop by Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md transition-colors text-sm md:text-base">Browse through our most popular niches and find exactly what you need.</p>
          </div>
          <Button variant="link" className="text-blue-600 dark:text-blue-400 font-bold p-0 flex items-center gap-2 transition-colors uppercase text-sm tracking-widest">
            Explore All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
