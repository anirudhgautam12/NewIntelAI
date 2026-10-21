import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters.js';

/**
 * Visualizes POSITIVE, NEUTRAL, and NEGATIVE scores on a horizontal bar chart
 */
const SentimentChart = ({ scores }) => {
  if (!scores) return null;

  // Format Recharts data model
  const data = [
    { name: 'Positive', value: scores.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: scores.neutral || 0, color: '#f59e0b' },
    { name: 'Negative', value: scores.negative || 0, color: '#ef4444' }
  ];

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full min-h-[240px]">
      
      {/* Header element */}
      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4">
        <BarChart3 className="w-5 h-5 text-brand-accent shrink-0" />
        <h3 className="text-base font-bold text-gray-100 font-heading font-heading">Sentiment Scores</h3>
      </div>
      
      {/* Chart container */}
      <div className="flex-1 w-full h-[150px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
          >
            <XAxis type="number" hide domain={[0, 1.0]} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111a36',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '11px'
              }}
              formatter={(val) => [formatPercentage(val), 'Probability']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default SentimentChart;
