"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/PostEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<{
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
  } | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setInitial(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Post not found");
        setLoading(false);
      });
  }, [slug]);

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
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to save");
      return;
    }

    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-meta-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      {error && (
        <div className="mb-4 px-4 py-2 bg-brand-red/10 text-brand-red rounded text-sm">
          {error}
        </div>
      )}
      {initial && <PostEditor initial={initial} onSave={handleSave} saving={saving} isEditing />}
    </div>
  );
}
