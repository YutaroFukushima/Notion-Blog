import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPublishedSlugs } from '@/lib/notion';
import NotionBlock from '@/components/NotionBlock';

// ISR: 24時間ごとに再検証
export const revalidate = 86400;

// 動的ルートのパラメータ型
interface PageProps {
  params: {
    slug: string;
  };
}

// ビルド時に生成する記事のパスを指定
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// メタデータの生成
export async function generateMetadata({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);
  
  if (!result) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: result.post.title,
    description: result.post.summary || `${result.post.title}の記事`,
  };
}

import Link from 'next/link';

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

export default async function PostPage({ params }: PageProps) {
  const result = await getPostBySlug(params.slug);

  if (!result) {
    notFound();
  }

  const { post, blocks } = result;

  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const lastEditedDate = new Date(post.lastEditedTime).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto">
      {/* 記事ヘッダー */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {formattedDate && (
            <time dateTime={post.publishedDate || ''}>
              公開日: {formattedDate}
            </time>
          )}
          <span>最終更新: {lastEditedDate}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.summary && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-gray-300 text-gray-700">
            {post.summary}
          </div>
        )}
      </header>

      {/* 記事本文 */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {blocks.map((block: any) => (
            <NotionBlock key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* 記事フッター */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 記事一覧に戻る
          </Link>
          
          <div className="text-sm text-gray-500">
            この記事は{post.tags.length > 0 ? post.tags.join(', ') : '未分類'}に関する内容です
          </div>
        </div>
      </footer>
    </article>
  );
}
