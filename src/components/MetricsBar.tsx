import { ShieldAlert, Zap, FileCode2, CheckCircle2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const MOCK_DATA_RED = [{ v: 4 }, { v: 2 }, { v: 5 }, { v: 3 }, { v: 6 }, { v: 4 }, { v: 7 }];
const MOCK_DATA_ORANGE = [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 3 }, { v: 6 }, { v: 5 }];
const MOCK_DATA_YELLOW = [{ v: 5 }, { v: 4 }, { v: 6 }, { v: 3 }, { v: 4 }, { v: 2 }, { v: 5 }];
const MOCK_DATA_GREEN = [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }];

function MetricCard({ title, icon: Icon, value, highlight, highlightColor, data, chartColor }: any) {
  return (
    <div className="flex-1 bg-astra-elevated border border-astra-border rounded-none p-5 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-astra-border pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-astra-text font-sans">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-light italic font-serif flex items-baseline gap-2 text-astra-text">
            <span>{value}</span>
            <span className="text-[14px] not-italic font-sans font-bold uppercase tracking-widest text-astra-muted">{highlight}</span>
          </span>
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#5C574B] mt-2">{highlightColor}</span>
        </div>
        <div className="w-20 h-10 grayscale opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke="currentColor" 
                className={chartColor}
                strokeWidth={1.5}
                fillOpacity={1} 
                fill={`url(#grad-${title})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function MetricsBar() {
  return (
    <div className="flex gap-4">
      <MetricCard 
        title="Security" 
        icon={ShieldAlert} 
        value="2" 
        highlight="Issues" 
        highlightColor="1 Critical" 
        data={MOCK_DATA_RED} 
        chartColor="text-astra-critical" 
      />
      <MetricCard 
        title="Performance" 
        icon={Zap} 
        value="3" 
        highlight="Suggestions" 
        highlightColor="Improve efficiency" 
        data={MOCK_DATA_ORANGE} 
        chartColor="text-astra-major" 
      />
      <MetricCard 
        title="Code Smells" 
        icon={FileCode2} 
        value="4" 
        highlight="Detected" 
        highlightColor="Clean code issues" 
        data={MOCK_DATA_YELLOW} 
        chartColor="text-astra-minor" 
      />
      <MetricCard 
        title="Test Coverage" 
        icon={CheckCircle2} 
        value="78%" 
        highlight="" 
        highlightColor="Good coverage" 
        data={MOCK_DATA_GREEN} 
        chartColor="text-astra-success" 
      />
    </div>
  );
}
