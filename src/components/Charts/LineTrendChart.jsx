import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export function LineTrendChart({ data, dataKey = 'value', stroke = '#38bdf8' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
        <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value)} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: 16 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
