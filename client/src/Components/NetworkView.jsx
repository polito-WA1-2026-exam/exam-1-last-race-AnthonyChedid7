import { useEffect, useState } from 'react';
import API from '../API';
import NetworkMap from './NetworkMap';

function NetworkView() {
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getNetwork()
      .then((networkData) => {
        setNetwork(networkData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="card">
        <h2>Loading metro network...</h2>
      </section>
    );
  }

  if (!network) {
    return (
      <section className="card">
        <h2>Network unavailable</h2>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Metro Network</h2>

      <p className="muted">
        Study the full metro network before starting the game. During the game,
        the colored connections will disappear and you will need to recreate the route from memory.
      </p>

      <div className="stats-row">
        <div className="stat-box">
          <strong>{network.stations.length}</strong>
          <span>Stations</span>
        </div>

        <div className="stat-box">
          <strong>{network.lines.length}</strong>
          <span>Lines</span>
        </div>

        <div className="stat-box">
          <strong>{network.segments.length}</strong>
          <span>Segments</span>
        </div>
      </div>

      <h3>Metro Network Map</h3>

      <NetworkMap />
    </section>
  );
}

export default NetworkView;