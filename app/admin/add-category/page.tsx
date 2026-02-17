"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/app/lib/apollo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Tag, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

interface Category {
  id: string;
  name: string;
}

interface GetCategoriesData {
  categories: Category[];
}

export default function AddCategoryPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    } else if (sessionStatus === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/");
    }
  }, [sessionStatus, session, router]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const { data: catData, loading: catLoading, refetch } = useQuery<GetCategoriesData>(GET_CATEGORIES, { client });

  if (sessionStatus === "loading" || (sessionStatus === "authenticated" && (session?.user as any)?.role !== "ADMIN")) {
    return <div className="min-h-screen flex items-center justify-center">Verifying Authorisation...</div>;
  }

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    client,
    onCompleted: () => {
      setStatus({ type: 'success', message: "Category established successfully!" });
      setName("");
      refetch();
      setTimeout(() => setStatus(null), 3000);
    },
    onError: (err) => {
      setStatus({ type: 'error', message: err.message });
      setTimeout(() => setStatus(null), 5000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory({ variables: { name } });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 transition-colors">
      <div className="flex items-center gap-4 mb-10 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Catalog <span className="text-indigo-600 dark:text-indigo-400">Architecture</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Add Form */}
        <div className="lg:col-span-1">
          <Card className="border-none bg-white dark:bg-gray-900 shadow-2xl shadow-indigo-900/5 dark:shadow-none rounded-3xl overflow-hidden border dark:border-gray-800 transition-all sticky top-28">
            <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">Add Category</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define a new segment for your product catalog.</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Footwear, Electronics"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 dark:text-gray-100 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-xs font-bold">{status.message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-8 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] border-none"
                >
                  {loading ? "Establishing..." : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Entry
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push("/admin/add-product")}
                  variant="outline"
                  className="w-full border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl py-6 font-bold text-sm transition-all"
                >
                  Continue to Products
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-500" />
              Existing Departments
            </h2>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              {catData?.categories?.length || 0} Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800/50 rounded-3xl animate-pulse" />
              ))
            ) : catData?.categories?.map((cat: any) => (
              <Card key={cat.id} className="border-none bg-white dark:bg-gray-900/50 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-tighter">ID: {cat.id.split('-')[0]}...</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
