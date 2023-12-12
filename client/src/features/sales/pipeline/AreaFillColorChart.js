import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GradientAreaFillColorChart = ({ opportunityData }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={opportunityData}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            {opportunityData.map(({ name, color }, index) => (
              <stop
                key={name}
                offset={`${(index / (opportunityData.length - 1)) * 100}%`}
                stopColor={color}
                stopOpacity={1}
              />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default GradientAreaFillColorChart;
