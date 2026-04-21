'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PerformancePoint } from '@/types/sheets'

type TrendChartProps = {
  title: string
  data: PerformancePoint[]
  dataKey: keyof Omit<PerformancePoint, 'date'>
  colour: string
}

export function TrendChart({ title, data, dataKey, colour }: TrendChartProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-base font-semibold text-midnight">
          {title}
        </h3>
        <span className="text-xs text-muted">{data.length} points</span>
      </div>
      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No data yet — fill in the Performance tab to see trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#E6E1D8" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#7A7A80', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#7A7A80', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #E6E1D8',
                  fontSize: 12,
                  background: '#FFFFFF',
                }}
                labelStyle={{ color: '#14304D', fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colour}
                strokeWidth={2}
                dot={{ r: 3, fill: colour, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
