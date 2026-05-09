import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPosts()
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container"><div className="spinner" /></div>;
  }

  if (error && posts.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="emoji">🔌</div>
          <h2>连接不上后端</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📝</div>
          <h2>还没有文章</h2>
          <p>
            点击右上角的 <Link to="/new">写点什么</Link> 开始吧
          </p>
        </div>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="post-card"
              style={{ display: 'block' }}
            >
              {post.coverUrl && (
                <img src={post.coverUrl} alt="" className="post-card-thumb" />
              )}
              <div className="post-card-header">
                <h2 className="post-card-title">{post.title}</h2>
              </div>
              {post.excerpt && (
                <p className="post-card-excerpt">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
