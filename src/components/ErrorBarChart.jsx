import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function ErrorBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800/80">
        <p className="text-slate-500 text-sm">No postural errors recorded for this patient.</p>
      </div>
    );
  }

  // Format error names for clean presentation
  const formattedData = data.map(item => ({
    ...item,
    clean_name: item.error_name ? item.error_name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown'
  }));

  // Define a nice spectrum of warm colors for error severities
  const colors = ['#F43F5E', '#FB7185', '#FDA4AF', '#FECDD3', '#FFE4E6'];

  return (
    <div className="h-72 w-full bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-300">Common Postural Deviations</h3>
          <p className="text-xs text-slate-500">Frequency of specific incorrect postures</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.3} horizontal={false} />
          <XAxis 
            type="number"
            stroke="#64748B" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickCount={5}
          />
          <YAxis 
            dataKey="clean_name" 
            type="category"
            stroke="#94A3B8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            width={100}
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
            formatter={(value) => [`${value} times`, 'Occurrences']}
          />
          <Bar 
            dataKey="occurrence_count" 
            radius={[0, 8, 8, 0]}
            barSize={16}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
