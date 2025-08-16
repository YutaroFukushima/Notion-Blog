import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion クライアントの初期化
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// 型定義
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedDate: string | null;
  tags: string[];
  summary: string;
  lastEditedTime: string;
}

// Notionのページオブジェクトをブログ記事に変換
function pageToPost(page: any): BlogPost | null {
  // DatabaseObjectResponseを除外（objectプロパティでチェック）
  if (page.object !== 'page' || !('properties' in page)) {
    return null;
  }

  const properties = page.properties as any;

  // プロパティの安全な取得
  const title = properties['タイトル']?.title?.[0]?.plain_text || 'Untitled';
  const slug = properties['slug']?.rich_text?.[0]?.plain_text || '';
  const published = properties['公開状態']?.checkbox || false;
  const publishedDate = properties['公開日']?.date?.start || null;
  const tags = properties['タグ']?.multi_select?.map((tag: any) => tag.name) || [];
  const summary = properties['概要']?.rich_text?.[0]?.plain_text || '';

  if (!slug) {
    return null;
  }

  return {
    id: page.id,
    title,
    slug,
    published,
    publishedDate,
    tags,
    summary,
    lastEditedTime: page.last_edited_time,
  };
}

// 公開済みの記事一覧を取得
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: '公開状態',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: '公開日',
          direction: 'descending',
        },
      ],
    });

    const posts = response.results
      .filter((result): result is PageObjectResponse => result.object === 'page')
      .map(pageToPost)
      .filter((post): post is BlogPost => post !== null);

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// slugから記事を取得
export async function getPostBySlug(slug: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: '公開状態',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    const post = pageToPost(page);
    
    if (!post) {
      return null;
    }

    // ページの内容（ブロック）を取得
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
      page_size: 100,
    });

    return {
      post,
      blocks: blocks.results,
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

// すべての公開記事のslugを取得（静的生成用）
export async function getAllPublishedSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map(post => post.slug);
}
