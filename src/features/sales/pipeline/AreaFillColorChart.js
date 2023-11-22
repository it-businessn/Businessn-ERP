import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  linearGradient,
  stop,
} from "recharts";

const GradientAreaFillColorChart = () => {
  const data = [
    { name: "January", value: 10 },
    { name: "February", value: 25 },
    { name: "March", value: 18 },
    { name: "April", value: 32 },
    { name: "May", value: 20 },
  ];

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((entry) => entry.value));
    const dataMin = Math.min(...data.map((entry) => entry.value));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop
              offset={`${gradientOffset() * 100}%`}
              stopColor="#8884d8"
              stopOpacity={0.2}
            />
            <stop
              offset={`${gradientOffset() * 100}%`}
              stopColor="red"
              stopOpacity={0.2}
            />
            <stop offset="95%" stopColor="red" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={false} />
        <YAxis tick={false} />
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
