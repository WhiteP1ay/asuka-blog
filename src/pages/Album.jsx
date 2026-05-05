import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Album() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPhotos()
      .then(data => setPhotos(data || []))
      .catch(err => setError(err.message || '获取相册失败'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="spinner" />
      </div>
    );
  }

  if (error && photos.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="emoji">🔌</div>
          <h2>相册暂时打不开</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="album-header">
        <div className="emoji">📸</div>
        <h1>相册</h1>
        <p className="album-subtitle">一些想记住的瞬间</p>
      </div>

      {photos.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🌧️</div>
          <h2>还没有照片</h2>
          <p>等有好看的风景，再慢慢放进来吧。</p>
        </div>
      ) : (
        <div className="album-grid">
          {photos.map(photo => (
            <button
              key={photo.id}
              type="button"
              className="album-card"
              onClick={() => setActive(photo)}
            >
              <div className="album-thumb-wrapper">
                <img src={photo.coverUrl} alt={photo.title} className="album-thumb" />
              </div>
              <div className="album-card-body">
                <h3 className="album-card-title">{photo.title}</h3>
                {photo.description && (
                  <p className="album-card-desc">{photo.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div
          className="modal-overlay"
          onClick={() => setActive(null)}
        >
          <div
            className="modal album-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="album-modal-image-wrapper">
              <img
                src={active.coverUrl}
                alt={active.title}
                className="album-modal-image"
              />
            </div>
            <div className="album-modal-info">
              <h3>{active.title}</h3>
              {active.description && <p>{active.description}</p>}
              {active.createdAt && (
                <p className="album-modal-date">
                  {new Date(active.createdAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setActive(null)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

