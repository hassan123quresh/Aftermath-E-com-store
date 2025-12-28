import React, { useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

const Blog = () => {
  const { blogPosts } = useStore();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publishedPosts = blogPosts.filter(post => post.isPublished);

  return (
    <div className="min-h-screen pt-4 md:pt-8 pb-24 px-4 md:px-6 max-w-7xl mx-auto animate-fade-in bg-stone-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 border-b border-obsidian/10 pb-6">
        <div>
            <h1 className="text-4xl md:text-6xl font-serif text-obsidian mb-2">
            The Journal
            </h1>
            <p className="text-xs md:text-sm text-stone-500 max-w-md leading-relaxed">
                Essays on design, stillness, and the architecture of daily life.
            </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {publishedPosts.map((post, idx) => (
          <Link 
            key={post.id} 
            to={`/journal/${post.id}`} 
            className="group block animate-fade-in-up flex flex-col h-full"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
          >
            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden mb-6 bg-stone-300 rounded-lg">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/5 transition-colors duration-500"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-stone-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl leading-tight text-obsidian mb-3 group-hover:underline underline-offset-4 decoration-1 decoration-stone-300 transition-all">
                {post.title}
              </h3>
              
              <p className="text-sm text-stone-600 leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-stone-300 flex items-center justify-between text-obsidian">
                 <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] bg-stone-100 px-2 py-1 rounded text-stone-500 uppercase tracking-wider">{tag}</span>
                    ))}
                 </div>
                 <span className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                 </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {publishedPosts.length === 0 && (
          <div className="py-24 text-center opacity-50 font-serif text-obsidian">
              No journal entries found.
          </div>
      )}
    </div>
  );
};

export default Blog;