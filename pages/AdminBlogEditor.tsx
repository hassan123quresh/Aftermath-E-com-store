import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { BlogPost } from '../types';
import { ArrowLeft, Save, Image as ImageIcon, Eye, Edit3 } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import createDOMPurify from 'dompurify';

// Reuse the markdown configuration
const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null;
const mathExtension = {
    name: 'math',
    level: 'inline',
    start(src: string) { const match = src.match(/\$/); return match ? match.index : -1; },
    tokenizer(src: string, tokens: any) {
        const blockRule = /^\$\$([\s\S]+?)\$\$/;
        const inlineRule = /^\$([^$\n]+?)\$/;
        let match = blockRule.exec(src);
        if (match) return { type: 'math', raw: match[0], text: match[1].trim(), display: true };
        match = inlineRule.exec(src);
        if (match) return { type: 'math', raw: match[0], text: match[1].trim(), display: false };
    },
    renderer(token: any) {
        if (!katex) return token.text;
        try { return katex.renderToString(token.text, { displayMode: token.display, throwOnError: false, output: 'html' }); } 
        catch (e) { return token.text; }
    }
};
try { marked.use({ extensions: [mathExtension as any], gfm: true, breaks: true }); } catch (e) {}

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogPosts, addPost, updatePost } = useStore();
  
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  
  const initialPost: BlogPost = {
      id: '',
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: 'Aftermath Editorial',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      tags: [],
      isPublished: true
  };

  const [formData, setFormData] = useState<BlogPost>(initialPost);
  const [tagInput, setTagInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
      if (id) {
          const post = blogPosts.find(p => p.id === id);
          if (post) {
              setFormData(post);
          } else {
              navigate('/admin/blog');
          }
      }
  }, [id, blogPosts, navigate]);

  const handleChange = (field: keyof BlogPost, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setIsDirty(true);
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          if (!formData.tags.includes(tagInput.trim())) {
              setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
          }
          setTagInput('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const insertImageMarkdown = () => {
      const url = prompt("Enter Image URL:");
      if (url) {
          const markdown = `![Image Description](${url})`;
          setFormData(prev => ({ ...prev, content: prev.content + '\n' + markdown + '\n' }));
      }
  };

  const handleSave = () => {
      if (!formData.title || !formData.content) {
          alert('Title and Content are required.');
          return;
      }

      const postToSave = {
          ...formData,
          id: id || `blog-${Date.now()}`,
      };

      if (id) {
          updatePost(postToSave);
      } else {
          addPost(postToSave);
      }
      navigate('/admin/blog');
  };

  const renderPreview = (text: string) => {
      if (!text) return <p className="text-stone-400 italic">Start writing to see preview...</p>;
      const rawHtml = marked.parse(text) as string;
      const cleanHtml = DOMPurify ? DOMPurify.sanitize(rawHtml, { ADD_TAGS: ['iframe', 'u', 'img'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'alt', 'width', 'height'] }) : rawHtml;
      
      const proseClasses = `
            prose prose-stone max-w-none 
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-obsidian
            prose-p:text-obsidian prose-p:opacity-80 prose-p:leading-relaxed
            prose-a:text-obsidian prose-a:underline
            prose-img:rounded-lg prose-img:shadow-sm prose-img:my-6
            prose-blockquote:border-l-4 prose-blockquote:border-obsidian prose-blockquote:pl-4 prose-blockquote:italic
            prose-table:w-full prose-table:border-collapse prose-th:text-left prose-th:p-2 prose-td:p-2 prose-td:border-b
      `;
      return <div className={proseClasses} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6 sticky top-20 z-30 bg-stone-50 py-4 border-b border-stone-200">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/blog')} className="p-2 hover:bg-stone-200 rounded-full text-stone-500"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-xl md:text-2xl font-serif">{id ? 'Edit Entry' : 'New Entry'}</h1>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setViewMode('edit')} className={`px-4 py-2 text-xs uppercase tracking-widest rounded-md flex items-center gap-2 ${viewMode === 'edit' ? 'bg-stone-200 text-obsidian' : 'text-stone-500 hover:text-obsidian'}`}>
                    <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setViewMode('preview')} className={`px-4 py-2 text-xs uppercase tracking-widest rounded-md flex items-center gap-2 ${viewMode === 'preview' ? 'bg-stone-200 text-obsidian' : 'text-stone-500 hover:text-obsidian'}`}>
                    <Eye className="w-4 h-4" /> Preview
                </button>
                <button onClick={handleSave} className="ml-4 bg-obsidian text-white px-6 py-2 text-xs uppercase tracking-widest rounded-md flex items-center gap-2 hover:bg-stone-800 shadow-md">
                    <Save className="w-4 h-4" /> Save
                </button>
            </div>
        </div>

        {/* Edit Mode */}
        <div className={`${viewMode === 'edit' ? 'block' : 'hidden'} space-y-6`}>
            {/* Meta Data Panel */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Title</label>
                    <input 
                        className="w-full border border-stone-300 p-3 text-lg font-serif rounded-md focus:border-obsidian outline-none"
                        placeholder="Enter title here..."
                        value={formData.title}
                        onChange={e => handleChange('title', e.target.value)}
                    />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">
                        Cover Image URL (Thumbnail) <span className="normal-case font-medium text-stone-400 ml-1">- Rec: 16:9 Landscape (e.g. 1920x1080px)</span>
                    </label>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none font-mono"
                            placeholder="https://..."
                            value={formData.coverImage}
                            onChange={e => handleChange('coverImage', e.target.value)}
                        />
                        {formData.coverImage && <img src={formData.coverImage} className="w-12 h-12 object-cover rounded border" alt="preview" />}
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Author</label>
                    <input 
                        className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                        value={formData.author}
                        onChange={e => handleChange('author', e.target.value)}
                    />
                </div>
                <div>
                     <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Read Time</label>
                    <input 
                        className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                        value={formData.readTime}
                        onChange={e => handleChange('readTime', e.target.value)}
                        placeholder="e.g. 5 min read"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Excerpt (Short description)</label>
                    <textarea 
                        className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none h-20"
                        value={formData.excerpt}
                        onChange={e => handleChange('excerpt', e.target.value)}
                    />
                </div>

                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Tags (Press Enter to add)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                            <span key={tag} className="bg-stone-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                                {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <input 
                        className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagAdd}
                        placeholder="Type tag and hit enter..."
                    />
                </div>

                 <div>
                    <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Status</label>
                    <select 
                        className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none bg-white"
                        value={formData.isPublished ? 'true' : 'false'}
                        onChange={e => handleChange('isPublished', e.target.value === 'true')}
                    >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>
            </div>

            {/* Markdown Editor */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                <div className="bg-stone-50 border-b border-stone-200 p-2 flex gap-2">
                    <button onClick={insertImageMarkdown} className="flex items-center gap-1 px-3 py-1.5 hover:bg-stone-200 rounded text-xs font-medium text-stone-600">
                        <ImageIcon className="w-3 h-3" /> Insert Image
                    </button>
                    <div className="ml-auto text-[10px] text-stone-400 p-2 uppercase tracking-wide">Markdown Supported</div>
                </div>
                <textarea 
                    className="flex-1 w-full p-6 font-mono text-sm focus:outline-none resize-none"
                    value={formData.content}
                    onChange={e => handleChange('content', e.target.value)}
                    placeholder="# Write your masterpiece..."
                />
            </div>
        </div>

        {/* Preview Mode */}
        <div className={`${viewMode === 'preview' ? 'block' : 'hidden'} bg-white p-8 md:p-12 rounded-xl border border-stone-200 shadow-sm min-h-[500px]`}>
            <div className="text-center mb-10 border-b border-stone-100 pb-10">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">{new Date(formData.date).toLocaleDateString()} • {formData.readTime}</p>
                <h1 className="font-serif text-4xl md:text-6xl mb-6">{formData.title}</h1>
                <p className="text-xl font-serif text-stone-500 italic">{formData.excerpt}</p>
            </div>
            {formData.coverImage && (
                <img src={formData.coverImage} alt="Cover" className="w-full h-64 md:h-96 object-cover rounded-xl mb-12" />
            )}
            {renderPreview(formData.content)}
        </div>
    </div>
  );
};

export default AdminBlogEditor;