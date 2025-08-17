'use client';

export function EnvironmentBanner() {
  // 本番環境では表示しない
  if (process.env.NEXT_PUBLIC_ENV === 'production' || !process.env.NEXT_PUBLIC_ENV) {
    return null;
  }

  const envName = process.env.NEXT_PUBLIC_ENV === 'preview' ? 'プレビュー環境' : '開発環境';
  const bgColor = process.env.NEXT_PUBLIC_ENV === 'preview' ? 'bg-yellow-500' : 'bg-orange-500';

  return (
    <div className={`${bgColor} text-black text-center p-2 text-sm font-bold`}>
      ⚠️ これは{envName}です - 本番環境ではありません
    </div>
  );
}