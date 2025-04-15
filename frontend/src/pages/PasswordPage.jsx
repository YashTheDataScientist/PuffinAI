import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordPage.css';

function PasswordPage() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      localStorage.setItem('authenticated', 'true');
      navigate('/');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="password-container">
      <div className="password-box">
        <h2>Enter Access Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordPage;
