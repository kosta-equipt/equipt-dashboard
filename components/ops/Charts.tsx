'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartColours } from '@/lib/ops/palette'

type CategoryDatum = { key: string; value: number; colour: string }

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(20,48,77,0.12)',
  boxShadow: '0 1px 2px rgba(20,48,77,0.04), 0 4px 16px rgba(20,48,77,0.08)',
  fontSize: 12,
  background: '#FFFFFF',
  color: '#1C1C1E',
} as const

const AXIS_PROPS = {
  stroke: '#7A7A80',
  fontSize: 11,
  tickLine: false,
  axisLine: { stroke: '#E6E1D8' },
} as const

function ChartFrame({
  title,
  children,
  empty,
}: {
  title: string
  children: React.ReactNode
  empty: boolean
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card dark:border-line-dark dark:bg-linen-dark">
      <p className="text-[11px] font-medium uppercase tracking-wider2 text-muted dark:text-muted-dark">
        {title}
      </p>
      <div className="mt-3 h-72 w-full">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-muted dark:text-muted-dark">
            No data for this view yet.
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export function ChartPie({ title, data }: { title: string; data: CategoryDatum[] }) {
  const filtered = data.filter((d) => d.value > 0)
  return (
    <ChartFrame title={title} empty={filtered.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: '#7A7A80' }}
          />
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="key"
            outerRadius="75%"
            stroke="none"
          >
            {filtered.map((d) => (
              <Cell key={d.key} fill={d.colour} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

export function ChartDonut({ title, data }: { title: string; data: CategoryDatum[] }) {
  const filtered = data.filter((d) => d.value > 0)
  const total = filtered.reduce((acc, d) => acc + d.value, 0)
  return (
    <ChartFrame title={title} empty={filtered.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 11, color: '#7A7A80' }}
          />
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="key"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="none"
          >
            {filtered.map((d) => (
              <Cell key={d.key} fill={d.colour} />
            ))}
          </Pie>
          {total > 0 && (
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#14304D"
              style={{ fontSize: 22, fontWeight: 600 }}
            >
              {total}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

export type BarDatum = { label: string; value: number }

export function ChartBar({ title, data }: { title: string; data: BarDatum[] }) {
  const empty = data.length === 0 || data.every((d) => d.value === 0)
  return (
    <ChartFrame title={title} empty={empty}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D8" vertical={false} />
          <XAxis dataKey="label" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(20,48,77,0.04)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={d.label}
                fill={i === data.length - 1 ? '#D4A745' : '#14304D'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

export type LineDatum = { date: string; [series: string]: string | number }

export function ChartLine({
  title,
  data,
  series,
}: {
  title: string
  data: LineDatum[]
  series: string[]
}) {
  const empty = data.length === 0 || series.length === 0
  const colours = chartColours(series.length)
  return (
    <ChartFrame title={title} empty={empty}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D8" vertical={false} />
          <XAxis dataKey="date" {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            verticalAlign="bottom"
            iconType="line"
            wrapperStyle={{ fontSize: 11, color: '#7A7A80' }}
          />
          {series.map((s, i) => (
            <Line
              key={s}
              type="monotone"
              dataKey={s}
              stroke={colours[i]}
              strokeWidth={2}
              dot={{ r: 2, fill: colours[i] }}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}
