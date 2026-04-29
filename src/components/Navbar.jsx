import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="emoji">🌸</span>
        <span>ayanami</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">文章</Link>
        {user ? (
          <>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/new')}
            >
              ✏️ 写点什么
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={logout}
            >
              退出
            </button>
          </>
        ) : (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/login')}
          >
            登录
          </button>
        )}
      </div>
    </nav>
  );
}
