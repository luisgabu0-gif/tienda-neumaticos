const SPOKE_COUNT = 5;
const TREAD_COUNT = 28;
const CENTER = 100;
const TIRE_OUTER = 92;
const TIRE_INNER = 66;
const RIM_RADIUS = 58;
const HUB_RADIUS = 15;

function round(value) {
  return Math.round(value * 100) / 100;
}

function polar(radius, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return [
    round(CENTER + radius * Math.cos(rad)),
    round(CENTER + radius * Math.sin(rad)),
  ];
}

export default function TireImage({ color = "#1e3a8a", className = "" }) {
  const treads = Array.from({ length: TREAD_COUNT }, (_, i) => {
    const angle = (360 / TREAD_COUNT) * i;
    const [x1, y1] = polar(TIRE_OUTER - 3, angle);
    const [x2, y2] = polar(TIRE_INNER + 5, angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />
    );
  });

  const spokes = Array.from({ length: SPOKE_COUNT }, (_, i) => {
    const angle = (360 / SPOKE_COUNT) * i - 90;
    const [x1, y1] = polar(HUB_RADIUS + 3, angle);
    const [x2, y2] = polar(RIM_RADIUS - 3, angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#e2e8f0"
        strokeWidth="9"
        strokeLinecap="round"
      />
    );
  });

  const lugNuts = Array.from({ length: SPOKE_COUNT }, (_, i) => {
    const angle = (360 / SPOKE_COUNT) * i - 90 + 36;
    const [x, y] = polar(HUB_RADIUS + 6, angle);
    return <circle key={i} cx={x} cy={y} r="2.5" fill="#1e293b" opacity="0.6" />;
  });

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Ilustración de neumático"
    >
      <circle cx={CENTER} cy={CENTER} r={TIRE_OUTER} fill="#1a1a1e" />
      <circle cx={CENTER} cy={CENTER} r={TIRE_INNER} fill="#232327" />
      {treads}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RIM_RADIUS}
        fill={color}
        stroke="#00000030"
        strokeWidth="2"
      />
      {spokes}
      <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} fill="#e2e8f0" />
      <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS - 5} fill="#94a3b8" />
      {lugNuts}
    </svg>
  );
}
