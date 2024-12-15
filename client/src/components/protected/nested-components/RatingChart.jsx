import { useEffect, useState } from 'react'; 
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; 
import { useRatings } from '@/hooks/dashboard/useRatings.jsx'; 


const COLORS = ['#00FF00', '#4cdc55', '#FFBB28', '#FF8042', '#FF0000'];

const RADIAN = Math.PI / 180;

// Custom label renderer
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const RatingChart = ({ ratingsRange, fiveStar, fourStar, threeStar, twoStar, oneStar }) => { 
  const { ratings, getRatings } = useRatings(ratingsRange); 
  console.log(ratings); 

  /** Stars */ 
  console.log(fiveStar, fourStar, threeStar, twoStar, oneStar); 
  /** End of Stars */ 

  const data = [
    { name: 'Group A', value: ratings?.data?.total_results['5_star'] || fiveStar },
    { name: 'Group B', value: ratings?.data?.total_results['4_star'] || fourStar },
    { name: 'Group C', value: ratings?.data?.total_results['3_star'] || threeStar },
    { name: 'Group D', value: ratings?.data?.total_results['2_star'] || twoStar }, 
    { name: 'Group E', value: ratings?.data?.total_results['1_star'] || oneStar }, 
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RatingChart;
