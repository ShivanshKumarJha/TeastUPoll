import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PollChart = ({ data, options }) => {
  // Prepare chart data
  const chartData = options.map((option, index) => ({
    name: option,
    votes: data?.filter(a => a.answer === index).length || 0,
  }));

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={value => [`${value} votes`, '']}
            labelFormatter={value => `Option: ${value}`}
          />
          <Bar dataKey="votes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollChart;
