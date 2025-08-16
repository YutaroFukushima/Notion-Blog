import React from 'react';

interface NotionBlockProps {
  block: any;
}

export default function NotionBlock({ block }: NotionBlockProps) {
  const { type } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p className="mb-4 text-gray-700 leading-relaxed">
          {block.paragraph.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
          {block.heading_1.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
          {block.heading_2.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">
          {block.heading_3.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className="mb-2 ml-6 list-disc text-gray-700">
          {block.bulleted_list_item.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="mb-2 ml-6 list-decimal text-gray-700">
          {block.numbered_list_item.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </li>
      );

    case 'code':
      return (
        <pre className="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
          <code className="text-sm font-mono text-gray-800">
            {block.code.rich_text.map((text: any) => text.plain_text).join('')}
          </code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">
          {block.quote.rich_text.map((text: any, index: number) => (
            <RichText key={index} text={text} />
          ))}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-8 border-gray-200" />;

    case 'image':
      const imageUrl = block.image.type === 'external' 
        ? block.image.external.url 
        : block.image.file.url;
      return (
        <figure className="my-6">
          <img 
            src={imageUrl} 
            alt={block.image.caption?.[0]?.plain_text || 'Image'}
            className="w-full rounded-lg shadow-md"
          />
          {block.image.caption?.length > 0 && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {block.image.caption.map((text: any, index: number) => (
                <RichText key={index} text={text} />
              ))}
            </figcaption>
          )}
        </figure>
      );

    case 'toggle':
      return (
        <details className="mb-4 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700">
            {block.toggle.rich_text.map((text: any, index: number) => (
              <RichText key={index} text={text} />
            ))}
          </summary>
          <div className="mt-2">
            {/* トグルの子要素は別途処理が必要 */}
          </div>
        </details>
      );

    case 'callout':
      return (
        <div className="flex gap-3 p-4 my-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-2xl">{block.callout.icon?.emoji || '💡'}</div>
          <div className="text-gray-700">
            {block.callout.rich_text.map((text: any, index: number) => (
              <RichText key={index} text={text} />
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="my-4 p-4 bg-gray-100 rounded text-gray-500">
          [未対応のブロックタイプ: {type}]
        </div>
      );
  }
}

// リッチテキストのレンダリング
function RichText({ text }: { text: any }) {
  if (!text) return null;

  const {
    annotations: { bold, italic, strikethrough, underline, code },
    href,
  } = text;

  let element = <span>{text.plain_text}</span>;

  if (bold) {
    element = <strong>{element}</strong>;
  }
  if (italic) {
    element = <em>{element}</em>;
  }
  if (strikethrough) {
    element = <del>{element}</del>;
  }
  if (underline) {
    element = <u>{element}</u>;
  }
  if (code) {
    element = <code className="px-1 py-0.5 bg-gray-100 rounded text-red-600 text-sm">{text.plain_text}</code>;
  }
  if (href) {
    element = (
      <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
        {element}
      </a>
    );
  }

  return element;
}
