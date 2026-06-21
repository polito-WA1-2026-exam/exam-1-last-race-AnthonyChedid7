

const stationPositions = {
  1: { x: 380, y: 210, label: 'Duomo' },
  2: { x: 290, y: 210, label: 'Cordusio' },
  3: { x: 200, y: 210, label: 'Cairoli' },
  4: { x: 110, y: 210, label: 'Cadorna' },
  5: { x: 110, y: 110, label: 'Conciliazione' },

  6: { x: 110, y: 320, label: "Sant'Ambrogio" },
  7: { x: 220, y: 320, label: "Sant'Agostino" },
  8: { x: 330, y: 320, label: 'Porta Genova' },
  9: { x: 440, y: 320, label: 'Romolo' },

  10: { x: 380, y: 300, label: 'Missori' },
  11: { x: 380, y: 390, label: 'Crocetta' },
  12: { x: 380, y: 470, label: 'Porta Romana' },
  13: { x: 500, y: 470, label: 'Lodi' },

  14: { x: 500, y: 110, label: 'San Babila' },
  15: { x: 110, y: 430, label: 'Dateo' },
};

const lineColors = {
  1: '#ef4444',
  2: '#22c55e',
  3: '#facc15',
  4: '#3b82f6',
};

const segments = [
  [1, 1, 2, 1],
  [2, 2, 3, 1],
  [3, 3, 4, 1],
  [4, 4, 5, 1],

  [5, 4, 6, 2],
  [6, 6, 7, 2],
  [7, 7, 8, 2],
  [8, 8, 9, 2],

  [9, 1, 10, 3],
  [10, 10, 11, 3],
  [11, 11, 12, 3],
  [12, 12, 13, 3],

  [13, 14, 1, 4],
  [14, 1, 6, 4],
  [15, 6, 15, 4],
];

function NetworkMap() {
  return (
    <div className="metro-map-wrapper">
      <svg className="metro-map" viewBox="0 0 620 540">
        {segments.map(([segmentId, station1Id, station2Id, lineId]) => {
          const p1 = stationPositions[station1Id];
          const p2 = stationPositions[station2Id];

          return (
            <line
              key={segmentId}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className="network-line"
              style={{ stroke: lineColors[lineId] }}
            />
          );
        })}

        {Object.entries(stationPositions).map(([id, station]) => (
          <g key={id}>
            <circle
              cx={station.x}
              cy={station.y}
              r="12"
              className="network-station"
            />

            <text
              x={station.x}
              y={station.y - 18}
              textAnchor="middle"
              className="metro-label"
            >
              {station.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="map-legend">
        <span><b style={{ background: '#ef4444' }}></b>M1 Red</span>
        <span><b style={{ background: '#22c55e' }}></b>M2 Green</span>
        <span><b style={{ background: '#facc15' }}></b>M3 Yellow</span>
        <span><b style={{ background: '#3b82f6' }}></b>M4 Blue</span>
      </div>
    </div>
  );
}

export default NetworkMap;