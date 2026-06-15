'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, Search, Tag, ArrowRight, Clock, Heart, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';

const BLOGS = [
  {
    id: 1,
    title: 'Mastering Emotional Intelligence: A Guide to Better Decision Making',
    excerpt: 'Learn how emotional intelligence can transform your approach to strategic thinking and help you excel in SmartLeague challenges.',
    author: 'Dr. Anil Sharma',
    date: '2024-04-18',
    readTime: 8,
    category: 'Strategy',
    image: 'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 342,
    featured: true,
  },
  {
    id: 2,
    title: 'The Psychology Behind Strategic Choices',
    excerpt: 'Dive deep into the psychological principles that influence strategic decision-making and cognitive biases to watch out for.',
    author: 'Prof. Maya Patel',
    date: '2024-04-15',
    readTime: 12,
    category: 'Psychology',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 287,
    featured: true,
  },
  {
    id: 3,
    title: 'How to Improve Your Ranking: Tips from Top 10 Students',
    excerpt: 'Real strategies from Nepal\'s top-ranked SmartLeague students. Find out what separates the leaders from the rest.',
    author: 'SmartLeague Team',
    date: '2024-04-12',
    readTime: 6,
    category: 'Tips & Tricks',
    image: 'https://images.pexels.com/photos/3938715/pexels-photo-3938715.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 512,
    featured: true,
  },
  {
    id: 4,
    title: 'Understanding Cognitive Biases in Decision Making',
    excerpt: 'Explore the most common cognitive biases that affect our choices and learn how to recognize them in real-time.',
    author: 'Dr. Rajesh Kumar',
    date: '2024-04-10',
    readTime: 10,
    category: 'Psychology',
    image: 'https://images.pexels.com/photos/8566532/pexels-photo-8566532.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 198,
    featured: false,
  },
  {
    id: 5,
    title: 'Challenge Breakdown: Analyzing Past Weekly Challenges',
    excerpt: 'A detailed analysis of the strategies used in winning last month\'s challenges. Learn from the best approaches.',
    author: 'SmartLeague Team',
    date: '2024-04-08',
    readTime: 7,
    category: 'Analysis',
    image: 'https://images.pexels.com/photos/3182815/pexels-photo-3182815.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 156,
    featured: false,
  },
  {
    id: 6,
    title: 'Building Consistency: Maintaining Your Winning Streak',
    excerpt: 'Discover the daily habits and mental routines of students who maintain long participation streaks.',
    author: 'Priya Sharma',
    date: '2024-04-05',
    readTime: 5,
    category: 'Tips & Tricks',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 234,
    featured: false,
  },
];

type CategoryFilter = 'all' | 'Strategy' | 'Psychology' | 'Tips & Tricks' | 'Analysis';

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await db.getBlogs();
        setBlogsList(data);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories: { id: CategoryFilter; label: string; color: string }[] = [
    { id: 'all', label: 'All Articles', color: 'bg-slate-100' },
    { id: 'Strategy', label: 'Strategy', color: 'bg-blue-100' },
    { id: 'Psychology', label: 'Psychology', color: 'bg-purple-100' },
    { id: 'Tips & Tricks', label: 'Tips & Tricks', color: 'bg-emerald-100' },
    { id: 'Analysis', label: 'Analysis', color: 'bg-amber-100' },
  ];

  const categoryColors: Record<string, string> = {
    Strategy: 'bg-blue-50 text-blue-700 border-blue-200',
    Psychology: 'bg-purple-50 text-purple-700 border-purple-200',
    'Tips & Tricks': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Analysis: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const filtered = blogsList.filter((blog) => {
    const matchesCategory = activeCategory === 'all' || blog.category === activeCategory;
    const matchesSearch = !search || blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.filter((b) => b.featured);
  const regular = filtered.filter((b) => !b.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Learning Hub</h1>
          </div>
          <p className="text-blue-100 mt-2">Insights, strategies, and tips from experts and top students</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 border-slate-200 rounded-xl focus:border-blue-500 pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={activeCategory === cat.id ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-black text-slate-900 mb-4">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={blog.image_url || blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${categoryColors[blog.category]} border text-xs font-semibold`}>
                        {blog.category}
                      </Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime} min read
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-sm md:text-base">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm line-clamp-2 mb-4">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">{blog.author}</span>
                        <span className="text-xs text-slate-500">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <button className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{blog.likes}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {regular.length > 0 && (
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">All Articles</h2>
            <div className="grid gap-4">
              {regular.map((blog) => (
                <article
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="flex gap-6">
                    <div className="hidden md:block flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={blog.image_url || blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <Badge className={`${categoryColors[blog.category]} border text-xs font-semibold w-fit`}>
                          {blog.category}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTime} min
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-slate-500">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">{blog.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                          <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{blog.likes}</span>
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-slate-900 mb-1">No articles found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200 mt-12 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 border border-blue-200">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">1,200+</div>
                <p className="text-slate-600">Active readers exploring strategies</p>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">45+</div>
                <p className="text-slate-600">Expert articles published</p>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-2">New Weekly</div>
                <p className="text-slate-600">Fresh content every week</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Want to contribute?</h3>
              <p className="text-slate-600 mb-4">Share your insights with the SmartLeague community</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Submit Your Article
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="relative h-64 overflow-hidden bg-slate-100 flex-shrink-0">
              <img
                src={selectedBlog.image_url || selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-800 shadow-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <Badge className={`${categoryColors[selectedBlog.category]} border text-xs font-semibold mb-2`}>
                  {selectedBlog.category}
                </Badge>
                <h2 className="text-xl md:text-2xl font-black leading-tight text-white drop-shadow-sm">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{selectedBlog.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(selectedBlog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedBlog.read_time || selectedBlog.readTime || 5} min read</span>
              </div>
              <div className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {selectedBlog.content || selectedBlog.excerpt}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={async () => {
                    try {
                      const updated = await db.updateBlog(selectedBlog.id, { likes: (selectedBlog.likes || 0) + 1 });
                      if (updated) {
                        setSelectedBlog(updated);
                        setBlogsList(prev => prev.map(b => b.id === selectedBlog.id ? updated : b));
                      }
                    } catch (e) { }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm transition-colors"
                >
                  <Heart className="w-4 h-4 fill-red-600" />
                  <span>{selectedBlog.likes || 0} Likes</span>
                </button>
                <Button onClick={() => setSelectedBlog(null)} variant="outline">Close Article</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
