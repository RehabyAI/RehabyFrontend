import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ScoreTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800/80">
        <p className="text-slate-500 text-sm">No historical score data available yet.</p>
      </div>
    );
  }

  // Ensure sorting by date to prevent erratic lines
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="h-72 w-full bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-300">Average Form Score Trend</h3>
          <p className="text-xs text-slate-500">Historical performance trajectory</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748B" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dy={8}
          />
          <YAxis 
            stroke="#64748B" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '12px',
              color: '#F8FAFC',
              fontSize: '11px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
            formatter={(value) => [`${value}%`, 'Avg. Score']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="average_score" 
            stroke="#14B8A6" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#scoreColor)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
