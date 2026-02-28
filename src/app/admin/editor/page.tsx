"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author: string;
    authorSlug: string;
    image: string;
    category: string;
    tags: string[];
    content: string;
  }) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to create post");
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
      {error && (
        <div className="mb-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded text-sm">
          {error}
        </div>
      )}
      <PostEditor onSave={handleSave} saving={saving} />
    </div>
  );
}
