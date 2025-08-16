import { getPublishedPosts } from '@/lib/notion';
import PostCard from '@/components/PostCard';

// ISR: 1時間ごとに再検証
export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          日々の出来事をアウトプットしていきます。
        </p>
      </section>

      {/* 記事一覧 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          最新の記事
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              まだ記事がありません。
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}