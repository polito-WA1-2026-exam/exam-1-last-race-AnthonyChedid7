import { useEffect, useState } from 'react';
import API from './API';
import './App.css';
import LoginForm from './components/LoginForm';
import NetworkView from './components/NetworkView';
import GamePage from './components/GamePage';
import RankingPage from './components/RankingPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('instructions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getUserInfo()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(credentials) {
    const loggedUser = await API.logIn(credentials);
    setUser(loggedUser);
    setPage('setup');
  }

  async function handleLogout() {
    await API.logOut();
    setUser(null);
    setPage('instructions');
  }

  if (loading) {
    return <main className="app">Loading...</main>;
  }

  return (
    <main className="app">
      <nav className="navbar">
        <h1>Last Race</h1>
        </nav>

        <div className="game-menu">
          <button onClick={() => setPage('instructions')}>Home</button>

          {user && (
            <>
              <button onClick={() => setPage('setup')}>Map</button>
              <button onClick={() => setPage('game')}>Play</button>
              <button onClick={() => setPage('ranking')}>Ranking</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
       </div>
     

      {!user && <LoginForm onLogin={handleLogin} />}

      {page === 'instructions' && (
        <section className="card">
          <h2>Home</h2>
          <p>
           How good is your memory? 
           Last Race is a memory based metro game. 
           Before starting your game,  go to the Map tab to memorize the lines and stations. 
           Then start a new game where you will be given starting point and ending point stations, and 
           you have to find a valid track from your start to end stations. You can pass through 
           different metro lines but if you select 2 stations that have no metro between them you 
           will therefore lose. A station cannot be selected twice and you have to submit your route 
           before your time finishes. 
           A valid route earns points, while random journey events may increase or decrease your final score.
           Compete against other players and climb the leaderboard to become the best metro planner.
          </p>
        </section>
      )}

      {page === 'setup' && user && <NetworkView />}

      {page === 'game' && user && <GamePage />}

      {page === 'ranking' && user && <RankingPage />}
    </main>
  );
}

export default App;
