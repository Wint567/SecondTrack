import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatStatusLabel } from '../../utils/formatters';

const COLORS = ['#34d97a', '#3b82f6', '#8b5cf6', '#c9a94f', '#b87469', '#64748b'];

export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, formatStatusLabel(name)]}
          contentStyle={{ backgroundColor: '#0b1118', border: '1px solid #1f2937', borderRadius: 16, color: '#ffffff' }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
