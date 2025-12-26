import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import createDOMPurify from 'dompurify';
import { ScrollProgress } from '../components/ScrollProgress';

// Initialize DOMPurify Factory
const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null;

// Configure marked with a custom tokenizer for math ($...$ and $$...$$)
const mathExtension = {
    name: 'math',
    level: 'inline',
    start(src: string) { 
        const match = src.match(/\$/);
        return match ? match.index : -1;
    },
    tokenizer(src: string, tokens: any) {
        const blockRule = /^\$\$([\s\S]+?)\$\$/;
        const inlineRule = /^\$([^$\n]+?)\$/;
        
        let match = blockRule.exec(src);
        if (match) {
            return {
                type: 'math',
                raw: match[0],
                text: match[1].trim(),
                display: true
            };
        }
        
        match = inlineRule.exec(src);
        if (match) {
             return {
                type: 'math',
                raw: match[0],
                text: match[1].trim(),
                display: false
            };
        }
    },
    renderer(token: any) {
        if (!katex) return token.text;
        try {
            return katex.renderToString(token.text, {
                displayMode: token.display,
                throwOnError: false,
                output: 'html'
            });
        } catch (e) {
            return token.text;
        }
    }
};

// Initialize marked with extensions
try {
    marked.use({ 
        extensions: [mathExtension as any], 
        gfm: true, 
        breaks: true 
    });
} catch (e) {
    console.warn("Marked configuration warning:", e);
}

const BlogPost = () => {
  const { id } = useParams();
  const { blogPosts } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
              <h1 className="font-serif text-2xl">Entry Not Found</h1>
              <Link to="/journal" className="text-sm underline">Return to Journal</Link>
          </div>
      )
  }

  // Markdown Renderer Logic
  const renderContent = (text: string) => {
    if (!text) return null;
    try {
        const rawHtml = marked.parse(text) as string;
        // Use sanitizer if available, otherwise raw HTML (fallback)
        const cleanHtml = DOMPurify ? DOMPurify.sanitize(rawHtml, {
             ADD_TAGS: ['iframe', 'u', 'img'], 
             ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'alt', 'width', 'height']
        }) : rawHtml;
        
        // CSS classes for styling - Matching Product Detail but optimised for long-form reading
        const proseClasses = `
            prose prose-stone prose-lg max-w-none 
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-obsidian prose-headings:mt-10 prose-headings:mb-6
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-obsidian prose-p:opacity-80 prose-p:leading-loose prose-p:mb-6
            prose-a:text-obsidian prose-a:underline prose-a:underline-offset-2 prose-a:decoration-stone-400 hover:prose-a:decoration-obsidian
            prose-strong:text-obsidian prose-strong:font-bold
            prose-em:font-serif prose-em:not-italic prose-em:bg-stone-100 prose-em:px-1
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:marker:text-stone-400 prose-li:mb-2
            
            /* Image Styling */
            prose-img:rounded-lg prose-img:shadow-sm prose-img:my-10 prose-img:w-full

            /* Blockquote Styling */
            prose-blockquote:border-l-4 prose-blockquote:border-obsidian prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:text-obsidian/90 prose-blockquote:my-10 prose-blockquote:bg-stone-50 prose-blockquote:py-4 prose-blockquote:pr-4
            
            /* Table Styling */
            prose-table:w-full prose-table:my-10 prose-table:border-collapse
            prose-thead:bg-stone-100 prose-thead:border-b-2 prose-thead:border-stone-300
            prose-th:p-4 prose-th:text-left prose-th:font-serif prose-th:text-obsidian
            prose-td:p-4 prose-td:border-b prose-td:border-stone-200 prose-td:text-sm
        `;

        return (
            <div 
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: cleanHtml }} 
            />
        );
    } catch (e) {
        return <p className="whitespace-pre-line">{text}</p>;
    }
  };

  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: post.title,
              text: post.excerpt,
              url: window.location.href,
          });
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard');
      }
  };

  return (
    <>
    <ScrollProgress className="top-[56px] md:top-[64px]" />
    <article className="min-h-screen pt-4 md:pt-10 pb-24 px-4 md:px-6 animate-fade-in">
        <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link to="/journal" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-obsidian mb-8 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Journal
            </Link>

            {/* Header */}
            <header className="mb-10">
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] md:text-xs uppercase tracking-widest text-stone-500 mb-6 border-b border-stone-200 pb-4">
                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                     <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                     <button onClick={handleShare} className="ml-auto flex items-center gap-1 hover:text-obsidian transition-colors"><Share2 className="w-3 h-3" /> Share</button>
                </div>
                
                <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight text-obsidian mb-6">
                    {post.title}
                </h1>
                
                <p className="text-lg md:text-xl text-stone-600 font-serif leading-relaxed italic">
                    {post.excerpt}
                </p>
            </header>

            {/* Cover Image */}
            <div className="w-full aspect-[16/9] overflow-hidden rounded-xl shadow-sm mb-12 bg-stone-200">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Main Content */}
            <div className="mb-16">
                {renderContent(post.content)}
            </div>

            {/* Tags & Footer */}
            <div className="border-t border-stone-200 pt-8 mt-12">
                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs border border-stone-300 px-3 py-1 rounded-full text-stone-600 hover:border-obsidian hover:text-obsidian transition-colors cursor-default">
                            #{tag}
                        </span>
                    ))}
                </div>
                
                <div className="bg-stone-50 p-8 rounded-xl text-center">
                    <h3 className="font-serif text-xl mb-2">Enjoyed this entry?</h3>
                    <p className="text-sm text-stone-500 mb-6">Subscribe to our newsletter for more essays on stillness and design.</p>
                    <div className="flex max-w-sm mx-auto gap-2">
                        <input type="email" placeholder="Email address" className="flex-1 px-4 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-obsidian" />
                        <button className="px-6 py-2 bg-obsidian text-white text-xs uppercase tracking-widest rounded hover:bg-stone-800">Join</button>
                    </div>
                </div>
            </div>
        </div>
    </article>
    </>
  );
};

export default BlogPost;