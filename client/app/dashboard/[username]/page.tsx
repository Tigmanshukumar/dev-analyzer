'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProfileAnalysis } from '@/services/api';

export default function Dashboard() {
  const { username } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await getProfileAnalysis(username as string);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch analysis');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-8 text-xl font-mono">Analyzing {username}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Error!</h2>
        <p className="text-xl mb-8">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-slate-700 pb-12">
          <img 
            src={data.avatar_url} 
            alt={data.name || data.username} 
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-xl"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-blue-400 mb-2">{data.name || data.username}</h1>
            <p className="text-xl text-slate-400 mb-4">@{data.username}</p>
            <p className="text-lg max-w-2xl">{data.bio}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Public Repos</p>
            <p className="text-3xl font-bold">{data.public_repos}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Followers</p>
            <p className="text-3xl font-bold">{data.followers}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Following</p>
            <p className="text-3xl font-bold">{data.following}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Languages</p>
            <p className="text-3xl font-bold">
              {Array.from(new Set(data.repos.map((r: any) => r.language).filter(Boolean))).length}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.repos.map((repo: any) => (
            <div key={repo.name} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{repo.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{repo.description || 'No description available.'}</p>
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="px-2 py-1 rounded bg-slate-700 text-emerald-400">{repo.language || 'Unknown'}</span>
                <span className="flex items-center gap-1">⭐ {repo.stars}</span>
                <span className="flex items-center gap-1">🍴 {repo.forks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
