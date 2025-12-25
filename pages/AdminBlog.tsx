import React from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const AdminBlog = () => {
  const { blogPosts, deletePost } = useStore();

  const handleDelete = (id: string) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
          deletePost(id);
      }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Journal Entries</h1>
        
        <Link 
            to="/admin/blog/new"
            className="flex items-center gap-2 bg-obsidian text-white px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest rounded-full shadow-md hover:bg-stone-800"
        >
            <Plus className="w-4 h-4" /> <span className="hidden md:inline">New Entry</span><span className="md:hidden">Add</span>
        </Link>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden rounded-lg shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
                        <th className="p-4 font-normal">Cover</th>
                        <th className="p-4 font-normal">Title</th>
                        <th className="p-4 font-normal">Date</th>
                        <th className="p-4 font-normal">Author</th>
                        <th className="p-4 font-normal">Status</th>
                        <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogPosts.map(post => (
                        <tr key={post.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="p-4">
                                <img src={post.coverImage} alt="" className="w-12 h-8 object-cover bg-stone-200 rounded-sm" />
                            </td>
                            <td className="p-4 font-medium text-sm">
                                {post.title}
                            </td>
                            <td className="p-4 text-stone-500 text-xs md:text-sm">{post.date}</td>
                            <td className="p-4 text-sm">{post.author}</td>
                             <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase font-bold ${post.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                                    {post.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Link to={`/journal/${post.id}`} target="_blank" className="inline-block text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                                <Link to={`/admin/blog/edit/${post.id}`} className="inline-block text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></Link>
                                <button onClick={() => handleDelete(post.id)} className="text-stone-400 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                    {blogPosts.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-stone-500 text-sm">No journal entries found. Create one to get started.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;