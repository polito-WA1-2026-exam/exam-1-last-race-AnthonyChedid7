const SERVER_URL = 'http://localhost:3001/api';

/* Authentication */

async function logIn(credentials) {
  const response = await fetch(`${SERVER_URL}/sessions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok)
    throw new Error('Login failed');

  return await response.json();
}

async function getUserInfo() {
  const response = await fetch(`${SERVER_URL}/sessions/current`, {
    credentials: 'include',
  });

  if (!response.ok)
    throw new Error('User not authenticated');

  return await response.json();
}

async function logOut() {
  const response = await fetch(`${SERVER_URL}/sessions/current`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok)
    throw new Error('Logout failed');
}

/* Network */

async function getNetwork() {
  const response = await fetch(`${SERVER_URL}/network`, {
    credentials: 'include',
  });

  if (!response.ok)
    throw new Error('Cannot load network');

  return await response.json();
}

/* Events */

async function getEvents() {
  const response = await fetch(`${SERVER_URL}/events`, {
    credentials: 'include',
  });

  if (!response.ok)
    throw new Error('Cannot load events');

  return await response.json();
}

/* Games */

async function startGame() {
  const response = await fetch(`${SERVER_URL}/games/start`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok)
    throw new Error('Cannot start game');

  return await response.json();
}

async function submitGame(gameId, route) {
    console.log('API sending:', JSON.stringify({ route }));
  const response = await fetch(`${SERVER_URL}/games/${gameId}/submit`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ route }),
  });

  if (!response.ok)
    throw new Error('Cannot submit game');

  return await response.json();
}

/* Ranking */

async function getRanking() {
  const response = await fetch(`${SERVER_URL}/ranking`);

  if (!response.ok)
    throw new Error('Cannot load ranking');

  return await response.json();
}



const API = {
  logIn,
  logOut,
  getUserInfo,
  getNetwork,
  getEvents,
  startGame,
  submitGame,
  getRanking,
};



export default API;