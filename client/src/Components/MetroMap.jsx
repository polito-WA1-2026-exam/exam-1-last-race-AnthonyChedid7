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

function MetroMap({
  startStationId,
  destinationStationId,
  selectedStations,
  onStationClick,
}) {
  const routeLines = [];

  for (let i = 0; i < selectedStations.length - 1; i++) {
    const from = stationPositions[selectedStations[i]];
    const to = stationPositions[selectedStations[i + 1]];

    if (from && to) {
      routeLines.push({ from, to, key: `${selectedStations[i]}-${selectedStations[i + 1]}-${i}` });
    }
  }

  return (
    <div className="metro-map-wrapper">
      <svg className="metro-map" viewBox="0 0 620 540">
        {routeLines.map((line) => (
          <line
            key={line.key}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            className="planned-route-line"
          />
        ))}

        {Object.entries(stationPositions).map(([id, station]) => {
          const stationId = Number(id);
          let className = 'metro-station clickable-station';

          if (stationId === startStationId) className += ' start';
          if (stationId === destinationStationId) className += ' destination';
          if (selectedStations.includes(stationId)) className += ' selected-station';

          return (
            <g
              key={id}
              className="station-group"
              onClick={() => onStationClick(stationId)}
            >
              <circle
                cx={station.x}
                cy={station.y}
                r="12"
                className={className}
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
          );
        })}
      </svg>
    </div>
  );
}

export default MetroMap;
