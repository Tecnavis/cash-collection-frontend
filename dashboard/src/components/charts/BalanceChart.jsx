import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DigiContext } from '../../context/DigiContext';

const BalanceChart = () => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);

  // Updated data with "sales" and "purchases"
  const data = [
    {
      name: "Friday",
      sales: 31,
      purchases: 11
    },
    {
      name: "Saturday",
      sales: 40,
      purchases: 32
    },
    {
      name: "Sunday",
      sales: 28,
      purchases: 45
    },
    {
      name: "Monday",
      sales: 51,
      purchases: 32
    },
    {
      name: "Tuesday",
      sales: 42,
      purchases: 34
    },
    {
      name: "Wednesday",
      sales: 109,
      purchases: 52
    },
    {
      name: "Thursday",
      sales: 100,
      purchases: 41
    },
  ];

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3" stroke={`${isLightTheme ? 'rgb(0 0 0 / 20%)':'rgba(255, 255, 255, 0.2)'}`} />
        <XAxis dataKey="name" stroke={`${isLightTheme? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`}/>
        <YAxis stroke={`${isLightTheme? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`}/>
        <Tooltip />
        <Legend />
        {/* Updated Bar components to use "sales" and "purchases" */}
        <Bar dataKey="sales" stackId="stack" fill="#0D99FF" />
        <Bar dataKey="purchases" stackId="stack" fill="#a9b4cc" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
