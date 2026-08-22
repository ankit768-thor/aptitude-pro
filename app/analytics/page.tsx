import { getAnalyticsData } from "@/lib/actions/analytics";
import AccuracyOverTimeChart from "@/components/charts/AccuracyOverTimeChart";
import SpeedOverTimeChart from "@/components/charts/SpeedOverTimeChart";
import TopicPerformanceChart from "@/components/charts/TopicPerformanceChart";
import CompanyReadinessChart from "@/components/charts/CompanyReadinessChart";
import DifficultyPerformanceChart from "@/components/charts/DifficultyPerformanceChart";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Performance Analytics</h1>
      <p className="mt-1 text-sm text-slate-500">
        See whether your gap is knowledge, accuracy, speed, or test pressure.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChartCard title="Accuracy Over Time" subtitle="Last 30 days">
          <AccuracyOverTimeChart data={data.accuracyOverTime} />
        </ChartCard>
        <ChartCard title="Speed Over Time" subtitle="Avg seconds per question, last 30 days">
          <SpeedOverTimeChart data={data.speedOverTime} />
        </ChartCard>
        <ChartCard title="Topic Performance" subtitle="Accuracy by topic">
          <TopicPerformanceChart data={data.topicPerformance} />
        </ChartCard>
        <ChartCard title="Company Readiness" subtitle="Overall readiness by target company">
          <CompanyReadinessChart data={data.companyReadiness} />
        </ChartCard>
        <ChartCard title="Difficulty Performance" subtitle="Accuracy by question difficulty" className="md:col-span-2">
          <DifficultyPerformanceChart data={data.difficultyPerformance} />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className ?? ""}`}>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
      <div className="mt-4 h-56">{children}</div>
    </div>
  );
}
