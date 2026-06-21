import { useEffect, useState } from 'react';
import API from '../API';
import MetroMap from './MetroMap';

function GamePage() {
  const [network, setNetwork] = useState(null);
  const [game, setGame] = useState(null);
  const [stationRoute, setStationRoute] = useState([]);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.getNetwork()
      .then(setNetwork)
      .catch(() => setError('Could not load network'));
  }, []);

  useEffect(() => {
    if (!game || result) return;

    if (timeLeft <= 0) {
      handleSubmitRoute();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((old) => old - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, game, result]);

  async function handleStartGame() {
    setLoading(true);
    setError('');
    setResult(null);
    setTimeLeft(90);

    try {
      const newGame = await API.startGame();
      setGame(newGame);
      setStationRoute([newGame.start_station_id]);
    } catch {
      setError('Could not start game');
    } finally {
      setLoading(false);
    }
  }

  function handleStationClick(stationId) {
    if (result) return;

    setStationRoute((oldRoute) => {
      const lastStation = oldRoute[oldRoute.length - 1];

      if (stationId === lastStation && oldRoute.length > 1) {
        setError('');
        return oldRoute.slice(0, -1);
      }

      if (oldRoute.includes(stationId)) {
        setError('You cannot use the same station twice.');
        return oldRoute;
      }

      setError('');
      return [...oldRoute, stationId];
    });
  }

  function undoLastStation() {
    setStationRoute((oldRoute) => {
      if (oldRoute.length <= 1) return oldRoute;
      return oldRoute.slice(0, -1);
    });
  }

  function clearRoute() {
    if (!game) return;
    setStationRoute([game.start_station_id]);
  }

  function findSegmentBetweenStations(stationA, stationB) {
    return network.segments.find(
      (segment) =>
        (segment.station1_id === stationA && segment.station2_id === stationB) ||
        (segment.station1_id === stationB && segment.station2_id === stationA)
    );
  }

  function convertStationsToSegments() {
    const segmentRoute = [];

    for (let i = 0; i < stationRoute.length - 1; i++) {
      const segment = findSegmentBetweenStations(stationRoute[i], stationRoute[i + 1]);

      if (!segment) {
        return null;
      }

      segmentRoute.push(segment.id);
    }

    return segmentRoute;
  }

  async function handleSubmitRoute() {
    if (!game || result) return;

    const segmentRoute = convertStationsToSegments();

    console.log('Station route:', stationRoute);
    console.log('Segment route:', segmentRoute);

    setLoading(true);
    setError('');

    try {
      const routeToSubmit = segmentRoute || [];
      const gameResult = await API.submitGame(game.id, routeToSubmit);
      setResult(gameResult);
    } catch {
      setError('Could not submit route');
    } finally {
      setLoading(false);
    }
  }

  function getStationName(id) {
    return network?.stations?.find((station) => station.id === id)?.name || id;
  }

  if (!network) {
    return (
      <section className="card">
        <h2>Loading game...</h2>
      </section>
    );
  }

  return (
    <section className="card game-card">
      <h2>Last Race</h2>

      {!game && (
        <>
          <p className="muted">
            Start a new race. Memorize the network in the map page, then click
            stations in order to recreate your route.
          </p>

          <button className="primary-btn" onClick={handleStartGame} disabled={loading}>
            {loading ? 'Starting...' : 'Start Game'}
          </button>
        </>
      )}

      {game && !result && (
        <>
          <div className="play-layout">
            <div className="play-map-panel">
              <h3>Planning Map</h3>

              <MetroMap
                startStationId={game.start_station_id}
                destinationStationId={game.destination_station_id}
                selectedStations={stationRoute}
                onStationClick={handleStationClick}
              />
            </div>

            <div className="game-control-panel">
              <div className="mission-box start-box">
                <span>Start</span>
                <strong>{getStationName(game.start_station_id)}</strong>
              </div>

              <div className="mission-box destination-box">
                <span>Destination</span>
                <strong>{getStationName(game.destination_station_id)}</strong>
              </div>

              <div className="mission-box">
                <span>Time Left</span>
                <strong className={timeLeft <= 10 ? 'danger-text' : ''}>
                  {timeLeft}s
                </strong>
              </div>

              <div className="mission-box">
                <span>Coins</span>
                <strong>20</strong>
              </div>

              <button onClick={undoLastStation} disabled={stationRoute.length <= 1}>
                Undo Last
              </button>

              <button onClick={clearRoute} disabled={stationRoute.length <= 1}>
                Clear Route
              </button>

              <button
                className="primary-btn"
                onClick={handleSubmitRoute}
                disabled={loading || stationRoute.length <= 1}
              >
                {loading ? 'Submitting...' : 'Submit Route'}
              </button>
            </div>
          </div>

          <h3>Selected Station Route</h3>

          <div className="route-preview">
            {stationRoute.map((stationId, index) => (
              <div className="route-step station-route-step" key={`${stationId}-${index}`}>
                <strong>{index + 1}</strong>
                <span>{getStationName(stationId)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {game && result && (
        <div className="result-panel">
          <h3>{result.valid ? 'Valid Route' : 'Invalid Route'}</h3>

          <div className="score-box">
            <span>Final Score</span>
            <strong>{result.final_score}</strong>
          </div>

          {result.steps?.length > 0 && (
            <>
              <h3>Journey Events</h3>

              <div className="events-list">
                {result.steps.map((step, index) => (
                  <div className="journey-step" key={index}>
                    <strong>
                      {step.from} → {step.to}
                    </strong>

                    <span>{step.event}</span>

                    <em className={step.effect >= 0 ? 'positive' : 'negative'}>
                      {step.effect >= 0 ? '+' : ''}
                      {step.effect}
                    </em>

                    <small>Coins: {step.coins_after_step}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="primary-btn" onClick={handleStartGame}>
            Play Again
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default GamePage;