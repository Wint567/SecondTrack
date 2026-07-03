import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

function formatNumber(value) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function LineTrendChart({
  data,
  dataKey = 'value',
  lines,
  stroke = '#34d97a',
  valueType = 'currency',
  yAxisWidth = 88,
}) {
  const valueFormatter = valueType === 'number' ? formatNumber : formatCurrency;
  const chartLines = lines ?? [{ dataKey, stroke }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" />
        <XAxis
          dataKey="date"
          stroke="#64748b"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          minTickGap={20}
        />
        <YAxis
          width={yAxisWidth}
          stroke="#64748b"
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
          tickLine={false}
          axisLine={false}
          allowDecimals={valueType !== 'number'}
        />
        <Tooltip
          formatter={(value, name) => [valueFormatter(value), name]}
          contentStyle={{ backgroundColor: '#0b1118', border: '1px solid #1f2937', borderRadius: 16 }}
          labelStyle={{ color: '#e5eaf0' }}
        />
        {chartLines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.stroke}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
