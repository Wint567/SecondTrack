import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatStatusLabel } from '../../utils/formatters';

const COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#8b5cf6', '#fb7185', '#94a3b8'];

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
          contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: 16, color: '#ffffff' }}
          labelStyle={{ color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
