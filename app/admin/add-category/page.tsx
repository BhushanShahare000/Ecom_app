"use client";

import { gql, } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/app/lib/apollo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    client,
    onCompleted: () => {
      alert("Category created successfully!");
      router.push("/admin/add-product");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory({ variables: { name } });
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-[400px] border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white"
            >
              {loading ? "Creating..." : "Add Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
