'use client';

import { useFetch } from '@/lib/hooks';
import { blogAPI } from '@/lib/api';
import { Card, Loader, EmptyState, Badge } from '@/components/common/UI';
import Link from 'next/link';

export default function BlogPage() {
  const { data: postsData, loading, error } = useFetch(() => blogAPI.getPublic());
  const posts = Array.isArray(postsData) ? postsData : [];

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Our Blog</h1>
          <p className="text-gray-300 mt-2">Latest articles and industry insights</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <Loader />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error loading blog posts</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <EmptyState
              icon="📝"
              title="No Blog Posts Yet"
              description="Check back soon for insightful articles and industry updates."
            />
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-48 object-cover w-full"
                    />
                  ) : (
                    <div className="bg-gray-300 h-48 flex items-center justify-center text-6xl">
                      📰
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    {post.category && (
                      <Badge variant="info">{post.category}</Badge>
                    )}
                    <h3 className="text-xl font-bold mt-2 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : 'Recently added'}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Read more →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
