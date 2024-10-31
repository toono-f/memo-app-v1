"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./actions";

type Article = {
  id: number;
  title: string;
  content: string;
};

export default function MarkdownEditor() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const fetchedArticles = await getArticles();
    setArticles(fetchedArticles);
  }

  async function handleSaveArticle() {
    if (currentArticle) {
      await updateArticle(currentArticle.id, title, content);
    } else {
      await createArticle(title, content);
    }
    setCurrentArticle(null);
    setTitle("");
    setContent("");
    fetchArticles();
  }

  function handleEditArticle(article: Article) {
    setCurrentArticle(article);
    setTitle(article.title);
    setContent(article.content);
  }

  async function handleDeleteArticle(id: number) {
    await deleteArticle(id);
    fetchArticles();
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        マークダウンエディター
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-lift border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✏️</span>
              <span>エディター</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-all-ease focus:ring-2 focus:ring-primary"
            />
            <Textarea
              placeholder="マークダウンでコンテンツを入力..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="transition-all-ease focus:ring-2 focus:ring-primary resize-none"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveArticle} className="hover-scale w-full">
              {currentArticle ? "✨ 更新" : "💾 保存"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover-lift border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👀</span>
              <span>プレビュー</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className="bg-secondary/50 rounded-lg p-4">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold my-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold my-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold my-2">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-bold my-2">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="text-sm font-bold my-2">{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="text-xs font-bold my-2">{children}</h6>
                  ),
                  p: ({ children }) => <p className="my-2">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="list-disc ml-6 my-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-6 my-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isSingleLine = !className;
                    if (isSingleLine) {
                      return (
                        <code
                          className="bg-gray-100 rounded px-1 py-0.5"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-gray-100 rounded p-4 my-2 overflow-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  },
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  hr: () => <hr className="my-4 border-t border-gray-300" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-50">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover-lift border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📚</span>
            <span>記事リスト</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all-ease"
              >
                <span className="font-medium">{article.title}</span>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEditArticle(article)}
                    variant="outline"
                    className="hover-scale"
                  >
                    ✏️ 編集
                  </Button>
                  <Button
                    onClick={() => handleDeleteArticle(article.id)}
                    variant="destructive"
                    className="hover-scale"
                  >
                    🗑️ 削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
