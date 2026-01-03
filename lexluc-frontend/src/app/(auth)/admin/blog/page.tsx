'use client';

import { useState } from 'react';
import { useFetch, useMutation, useToast } from '@/lib/hooks';
import { blogAPI } from '@/lib/api';
import { clearCache } from '@/lib/api';
import { Button, Input, Textarea, Card, Badge } from '@/components/common/UI';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Modal } from '@/components/common/UI';
import { generateSlug, ensureSlug } from '@/lib/slug';

export default function AdminBlogPage() {
  const { data: postsData, loading, refetch } = useFetch(() => blogAPI.getAdmin());
  const posts = Array.isArray(postsData) ? postsData : [];
  const { success, error: showError } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
  });

  const createMutation = useMutation((data) => blogAPI.create(data));
  const updateMutation = useMutation((data) => blogAPI.update(editingId!, data));

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image: '',
      category: '',
      isPublished: false,
      metaTitle: '',
      metaDescription: '',
    });
    setShowModal(true);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      image: post.image || '',
      category: post.category || '',
      isPublished: post.isPublished,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Post title is required');
      return;
    }

    if (!formData.content.trim()) {
      showError('Content is required');
      return;
    }

    // Filter out properties that shouldn't be sent to API
    const submitData = {
      title: formData.title,
      slug: ensureSlug(formData.slug, formData.title),
      content: formData.content,
      excerpt: formData.excerpt,
      image: formData.image,
      category: formData.category,
      isPublished: formData.isPublished,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
    };

    try {
      if (editingId) {
        await updateMutation.mutate(submitData);
        success('Post updated successfully');
      } else {
        await createMutation.mutate(submitData);
        success('Post created successfully');
      }
      setShowModal(false);
      // Clear cache to ensure public page shows updated posts
      clearCache();
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogAPI.delete(id);
      success('Post deleted successfully');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete post');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts Management</h1>
        <Button onClick={handleAdd}>+ New Post</Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-24 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center text-gray-600">
          <p>No blog posts yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <Badge variant={post.isPublished ? 'success' : 'warning'}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {post.category && (
                    <p className="text-sm text-gray-500 mb-2">Category: {post.category}</p>
                  )}
                  <p className="text-gray-600 text-sm mb-3">
                    {post.excerpt || post.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-400">
                    {post.publishedAt
                      ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}`
                      : post.createdAt
                      ? `Created: ${new Date(post.createdAt).toLocaleDateString()}`
                      : 'Recently created'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Post' : 'New Blog Post'}
        actions={
          <div className="flex gap-2">
            <Button
              type="submit"
              form="blog-form"
              loading={createMutation.loading || updateMutation.loading}
              className="flex-1"
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form id="blog-form" onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Post Title"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              // Auto-generate slug from title if slug is empty
              const newSlug = !formData.slug ? generateSlug(title) : formData.slug;
              setFormData({ ...formData, title, slug: newSlug });
            }}
            required
          />

          <Input
            label="Slug"
            help="URL-friendly name (auto-generated from title if empty)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
          />

          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <ImageUpload
            label="Featured Image"
            folder="lexluc/blog"
            preview={formData.image}
            onUpload={(url) => setFormData({ ...formData, image: url })}
          />

          <Textarea
            label="Excerpt"
            help="Short summary (appears in listings)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Content"
            help="Full blog post content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            required
          />

          <Input
            label="Meta Title"
            help="SEO title tag"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />

          <Input
            label="Meta Description"
            help="SEO meta description"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Publish this post</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
