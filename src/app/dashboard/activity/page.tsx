"use client";

import React, { useEffect, useState } from "react";
import { Activity, GitCommit, GitPullRequest, Calendar } from "lucide-react";
import AdvancedPagination from '@/components/ui/advanced-pagination';
import GitCommandsLoader from '@/components/ui/git-commands-loader';

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  repo?: string;
  target?: string;
  time: string;
  timestamp: string;
  user?: {
    name: string;
    githubUsername?: string;
    avatar?: string;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const ITEMS_PER_PAGE = 20;
  useEffect(() => {
    void fetchActivities();
  }, [currentPage]);

  useEffect(() => {
    const stream = new EventSource('/api/stream/dashboard');
    const handleVersions = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as { versions?: { 'activity-feed'?: number } };
      if (payload.versions?.['activity-feed'] !== undefined) {
        void fetchActivities();
      }
    };

    stream.addEventListener('versions', handleVersions);
    return () => stream.close();
  }, [currentPage]);

  const fetchActivities = async () => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      
      // Fresh data fetch with timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`/api/dashboard/global-activities?limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
        signal: controller.signal
      });
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
      setTotalActivities(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
      setHasMore(data.hasMore || false);
    } catch (err) {
      // Handle abort error silently (timeout)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
        return;
      }
      
      // Only log non-abort errors
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(false);
    }
  };


  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commit':
        return <GitCommit className="w-4 h-4 text-[#0B874F]" />;
      case 'pull_request':
        return <GitPullRequest className="w-4 h-4 text-[#F5A623]" />;
      case 'issue':
        return <Activity className="w-4 h-4 text-[#E74C3C]" />;
      case 'event_join':
        return <Calendar className="w-4 h-4 text-[#9B59B6]" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'commit':
        return 'bg-[#0B874F]/20 border-[#0B874F]/30';
      case 'pull_request':
        return 'bg-[#F5A623]/20 border-[#F5A623]/30';
      case 'issue':
        return 'bg-[#E74C3C]/20 border-[#E74C3C]/30';
      case 'event_join':
        return 'bg-[#9B59B6]/20 border-[#9B59B6]/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return <GitCommandsLoader />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-black/60 to-[#0B874F]/10 backdrop-blur-sm border border-[#0B874F]/30 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Activity className="w-10 h-10 mr-4 text-[#0B874F]" />
              Community Activity
            </h1>
            <p className="text-gray-300 text-lg">
                     See what everyone in the community is working on - commits, PRs, and issues
            </p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          
        </div>
      </div>

      {/* Activity Feed */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
                    key={`${activity.id || 'act'}-${activity.timestamp || 't'}-${index}`}
              className={`group bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm border rounded-xl p-6 hover:border-[#0B874F]/60 hover:shadow-lg hover:shadow-[#0B874F]/10 transition-all duration-300 hover:scale-[1.02] ${getActivityColor(activity.type)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar or Activity Icon */}
                <div className="flex-shrink-0 mt-1">
                  {activity.user?.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0B874F]/30 group-hover:border-[#0B874F] transition-colors duration-300">
                      <img 
                        src={activity.user.avatar || (activity.user.githubUsername ? `https://github.com/${activity.user.githubUsername}.png` : '')} 
                        alt={activity.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : activity.user?.githubUsername ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0B874F]/30 group-hover:border-[#0B874F] transition-colors duration-300">
                      <img 
                        src={`https://github.com/${activity.user.githubUsername}.png`} 
                        alt={activity.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                  <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getActivityIcon(activity.type)}
                  </div>
                  )}
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-base group-hover:text-gray-100 transition-colors duration-300">
                        {activity.user && (
                          <span className="font-semibold text-[#0B874F] group-hover:text-[#0ea55c] transition-colors duration-300">
                            {activity.user.name}
                            {activity.user.githubUsername && (
                              <span className="text-gray-400 font-normal"> (@{activity.user.githubUsername})</span>
                            )}
                          </span>
                        )}
                        {activity.user && ' '}
                        {activity.message}
                      </p>
                      
                      <div className="flex items-center space-x-3 mt-2">
                        {activity.repo && (
                          <>
                            <span className="text-[#0B874F] text-sm font-medium bg-[#0B874F]/10 px-2 py-1 rounded-md">
                              {activity.repo}
                            </span>
                          </>
                        )}
                        {activity.target && activity.target !== activity.repo && (
                          <>
                            <span className="text-[#0B874F] text-sm font-medium bg-[#0B874F]/10 px-2 py-1 rounded-md">
                              {activity.target}
                            </span>
                          </>
                        )}
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </div>
                    </div>
                    
                    {/* Activity Type Badge */}
                    <span className="flex-shrink-0 ml-4 px-3 py-1 bg-black/40 border border-white/10 rounded-full text-sm font-medium text-gray-300 capitalize group-hover:bg-[#0B874F]/20 group-hover:text-[#0B874F] transition-all duration-300">
                      {activity.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-[#0B874F]/30 rounded-lg p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Activity Yet</h3>
          <p className="text-gray-500">
            Start contributing to see activity here!
          </p>
        </div>
      )}

      {/* Advanced Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <AdvancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showQuickJump={true}
            maxVisiblePages={5}
          />
        </div>
      )}

      {/* Pagination Info */}
      {totalActivities > 0 && (
        <div className="text-center mt-4 text-gray-400 text-sm">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalActivities)} of {totalActivities} activities
        </div>
      )}
    </div>
  );
}
