import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Notion Blog',
  description: 'Notion APIで構築したブログ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b">
            <nav className="container-custom py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  My Notion Blog
                </Link>
                <div className="flex gap-6">
                  <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Home
                  </Link>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-grow container-custom py-8">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-gray-900 text-white mt-12">
            <div className="container-custom py-8">
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  © 2024 My Notion Blog. Built with Next.js & Notion API
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
