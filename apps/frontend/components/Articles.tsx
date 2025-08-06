import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { X, Calendar, Clock, Tag, RefreshCw, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiUtils, Article } from '../config/api';

interface ArticlesProps {
  isOpen: boolean;
  onClose: () => void;
}

const Articles: React.FC<ArticlesProps> = ({ isOpen, onClose }) => {
  const { t, lang } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 调试：监听isOpen状态变化
  useEffect(() => {
    console.log('Articles isOpen changed:', isOpen);
  }, [isOpen]);

  // 调试：监听selectedArticle状态变化
  useEffect(() => {
    console.log('Selected article changed:', selectedArticle?.title[lang as keyof typeof selectedArticle.title]);
  }, [selectedArticle, lang]);

  useEffect(() => {
    if (isOpen) {
      fetchArticles();
    }
  }, [isOpen]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await apiUtils.getArticles();
      console.log('Articles fetched:', data);
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      {/* 遮罩层 - 只在打开时显示 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out animate-in fade-in"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Articles overlay clicked');
            onClose();
          }}
        />
      )}
      
      {/* 文章侧边栏 */}
      <div className={`fixed right-0 top-0 h-full z-50 w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-gray-200/50 dark:border-gray-800 shadow-2xl transform transition-all duration-500 ease-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
        {/* 头部 */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 pt-20">
                      <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('articlesTitle')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('articlesDescription')}</p>
          </div>
                    <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Refresh articles clicked');
                fetchArticles();
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="刷新文章列表"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Articles close button clicked');
                onClose();
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700 rounded-lg p-8 hover:border-sky-500/50 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Article clicked:', article.title[lang as keyof typeof article.title]);
                    setSelectedArticle(article);
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {article.title[lang as keyof typeof article.title]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base mb-6 line-clamp-3">
                    {article.excerpt[lang as keyof typeof article.excerpt]}
                  </p>
                  
                  {/* 文章元信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-sky-900/50 text-sky-300 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 文章详情模态框 */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 fade-in">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedArticle(null);
            }}
          />
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-300/50 dark:border-gray-700 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out animate-in zoom-in-95">
            <div className="p-8">
                              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedArticle.title[lang as keyof typeof selectedArticle.title]}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(null);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                  <X size={24} />
                </button>
              </div>
              
              {/* 文章元信息区域 */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-sky-500" />
                  <span>{formatDate(selectedArticle.publishDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-sky-500" />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
              
              {/* 标签区域 */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs px-3 py-1 rounded-full font-medium hover:bg-sky-200 dark:hover:bg-sky-800/50 transition-colors duration-200 cursor-pointer"
                    title={`查看 ${tag} 相关文章`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-loose text-lg px-4 max-w-4xl mx-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 自定义标题样式
                      h1: ({children}) => <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{children}</h3>,
                      h4: ({children}) => <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{children}</h4>,
                      // 自定义段落样式
                      p: ({children}) => <p className="mb-6 text-gray-700 dark:text-gray-300 leading-8" style={{textIndent: '2em'}}>{children}</p>,
                      // 自定义列表样式
                      ul: ({children}) => <ul className="mb-4 ml-6 list-disc text-gray-700 dark:text-gray-300">{children}</ul>,
                      ol: ({children}) => <ol className="mb-4 ml-6 list-decimal text-gray-700 dark:text-gray-300">{children}</ol>,
                      li: ({children}) => <li className="mb-1">{children}</li>,
                      // 自定义代码样式
                      code: ({children, className}) => {
                        const isInline = !className;
                        const codeText = String(children);
                        const isCopied = copiedCode === codeText;
                        
                        // 尝试从className中提取语言信息
                        const language = className ? className.replace('language-', '') : '';
                        
                        return isInline ? (
                          <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm">{children}</code>
                        ) : (
                          <div className="relative group my-6">
                            {/* 代码块头部 */}
                            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-t-lg border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                {language && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium ml-2">
                                    {language.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => copyToClipboard(codeText)}
                                className="p-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="复制代码"
                              >
                                {isCopied ? (
                                  <Check size={14} className="text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy size={14} className="text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </div>
                            
                            {/* 代码内容 */}
                            <code className="block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-b-lg overflow-x-auto text-sm font-mono">
                              {children}
                            </code>
                          </div>
                        );
                      },
                      // 自定义链接样式
                      a: ({children, href}) => (
                        <a href={href} className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      // 自定义引用样式
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-sky-500 pl-4 py-2 my-4 bg-sky-50 dark:bg-sky-900/20 text-gray-700 dark:text-gray-300 italic">
                          {children}
                        </blockquote>
                      ),
                      // 自定义表格样式
                      table: ({children}) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({children}) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {selectedArticle.content[lang as keyof typeof selectedArticle.content]}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles; 