import Link from 'next/link';
import { BlogPost } from '@/lib/notion';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.publishedDate 
    ? new Date(post.publishedDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="block p-6">
        <div className="flex items-center justify-between mb-2">
          <time className="text-sm text-gray-500">{formattedDate}</time>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        
        {post.summary && (
          <p className="text-gray-600 line-clamp-3">
            {post.summary}
          </p>
        )}
        
        <div className="mt-4">
          <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            続きを読む →
          </span>
        </div>
      </Link>
    </article>
  );
}
