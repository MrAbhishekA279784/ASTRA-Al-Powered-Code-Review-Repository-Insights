import { BarChart2, TrendingUp, Users, GitPullRequest, Clock, Download } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

export function ReportsView() {
  const { showToast } = useAstra();

  const stats = [
    { icon: GitPullRequest, label: 'Total Reviews', value: '128', change: '+12%' },
    { icon: Users, label: 'Active Contributors', value: '12', change: '+2' },
    { icon: TrendingUp, label: 'Avg Quality Score', value: '87', change: '+5%' },
    { icon: Clock, label: 'Avg Review Time', value: '4.2m', change: '-18%' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-5 h-5 text-astra-purple-light" />
          <h2 className="text-2xl font-light italic font-serif text-astra-text">Reports</h2>
        </div>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Analytics and insights for your repositories</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-astra-border bg-astra-elevated p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold font-sans text-astra-muted">{stat.label}</span>
                <p className="text-3xl font-bold font-mono text-astra-text mt-2">{stat.value}</p>
              </div>
              <stat.icon className="w-5 h-5 text-astra-purple-light" />
            </div>
            <span className="text-[11px] text-astra-success font-sans font-semibold mt-2 block">{stat.change} this month</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => showToast('Full report download coming soon', 'info')}
        className="flex items-center gap-2 px-6 py-3 border border-astra-border text-[11px] uppercase tracking-widest font-bold font-sans text-astra-text hover:bg-astra-hover transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Full Report
      </button>
    </div>
  );
}
