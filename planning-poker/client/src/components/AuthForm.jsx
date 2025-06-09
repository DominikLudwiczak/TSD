import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Wyczyść błąd przy zmianie
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { login: formData.username, password: formData.password }
        : formData;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api${endpoint}`,
        payload
      );

      // Zapisz token do localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Powiadom rodzica o udanym logowaniu
      onAuthSuccess(response.data.user, response.data.token);

    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.error || 
        `Błąd ${isLogin ? 'logowania' : 'rejestracji'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      displayName: ''
    });
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isLogin ? '🔐 Logowanie' : '📝 Rejestracja'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nazwa użytkownika:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="np. john_doe"
          />
        </div>

        {/* Email - tylko przy rejestracji */}
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="john@example.com"
            />
          </div>
        )}

        {/* Display Name - tylko przy rejestracji */}
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Wyświetlana nazwa (opcjonalne):
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="John Doe"
            />
          </div>
        )}

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hasło:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="6"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="minimum 6 znaków"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: 'red',
            backgroundColor: '#ffeaea',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading 
            ? `${isLogin ? 'Logowanie' : 'Rejestracja'}...` 
            : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')
          }
        </button>
      </form>

      {/* Toggle Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666' }}>
          {isLogin ? 'Nie masz konta?' : 'Masz już konto?'}
        </p>
        <button
          type="button"
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isLogin ? 'Utwórz nowe konto' : 'Zaloguj się'}
        </button>
      </div>

      {/* Quick Access Option */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          Lub kontynuuj bez rejestracji:
        </p>
        <button
          onClick={() => onAuthSuccess(null, null)} // Przejdź do starego systemu
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Użyj szybkiego dostępu (nick + pokój)
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
