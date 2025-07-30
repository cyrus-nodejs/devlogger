import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import Navbar from '../../../components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

// -----------------------------
// TypeScript Interfaces
// -----------------------------
type CodeFrequencyWeek = [number, number, number]; // [timestamp, additions, deletions]

interface Dependency {
  packageName: string;
  requirements: string | null;
  repository: string | null;
  repository_url: string | null;
}

interface DependencyManifest {
  filename: string;
  dependencies: Dependency[];
}

interface RepoActivity {
  repo_name: string;
  repo_full_name:string;
  commits_count: number;
  code_frequency: CodeFrequencyWeek[];
  languages?: Record<string, number>;
  dependency_graph?: DependencyManifest[];
  error?: string;
}

// -----------------------------
// Color Utility
// -----------------------------
const generateColors = (count: number) =>
  Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);

const GitHubActivityCharts: React.FC = () => {
  const [repoData, setRepoData] = useState<RepoActivity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<RepoActivity[]>('/api/github-activity/')
      .then((res) => setRepoData(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch GitHub activity.');
      });
  }, []);

  const repoLabels = repoData.map((repo) => repo.repo_full_name);
  const commitCounts = repoData.map((repo) => repo.commits_count);
  const hasCommits = commitCounts.some((count) => count > 0);

  // -----------------------------
  // Language Frequency Mapping
  // -----------------------------
  const languageFrequency: Record<string, number> = {};

  repoData.forEach((repo) => {
    const langs = Object?.keys(repo?.languages || {});
    langs?.forEach((lang) => {
      languageFrequency[lang] = (languageFrequency[lang] || 0) + 1;
    });
  });

  // -----------------------------
  // Weekly Timeline Aggregation
  // -----------------------------
  const weeklyCommitsMap = new Map<number, number>();

  repoData.forEach((repo) => {
    repo.code_frequency?.forEach((week) => {
      const [timestamp, additions, deletions] = week;
      const current = weeklyCommitsMap.get(timestamp) || 0;
      weeklyCommitsMap.set(timestamp, current + additions + deletions);
    });
  });

  const timelineLabels = Array.from(weeklyCommitsMap.keys())
    .sort()
    .map((ts) => new Date(ts * 1000).toLocaleDateString());

  const timelineData = Array.from(weeklyCommitsMap.keys())
    .sort()
    .map((ts) => weeklyCommitsMap.get(ts) || 0);

  // -----------------------------
  // Dependency Group by Manifest
  // -----------------------------
 const manifestDependencyMap: Record<string, Record<string, number>> = {}; // filename -> full_name -> count

repoData.forEach((repo) => {
  const fullName = repo.repo_full_name;
  const manifests = repo.dependency_graph || [];
  manifests.forEach((manifest) => {
    const filename = manifest.filename;
    const depCount = manifest.dependencies?.length || 0;

    if (!manifestDependencyMap[filename]) {
      manifestDependencyMap[filename] = {};
    }

    manifestDependencyMap[filename][fullName] = depCount;
  });
});


  // Tooltip data: repo -> manifest -> dependency names
const tooltipDependencyMap: Record<string, Record<string, string[]>> = {};
repoData.forEach((repo) => {
  const fullName = repo.repo_full_name;
  const manifests = repo.dependency_graph || [];
  tooltipDependencyMap[fullName] = {};
  manifests.forEach((manifest) => {
    tooltipDependencyMap[fullName][manifest.filename] =
      manifest.dependencies?.map((dep) => dep.packageName) || [];
  });
});

  // -----------------------------
  // Chart Datasets
  // -----------------------------
  const pieData = {
    labels: repoLabels,
    datasets: [
      {
        label: 'Commits per Repo',
        data: commitCounts,
        backgroundColor: generateColors(repoLabels.length),
      },
    ],
  };

  const doughnutData = {
    labels: Object.keys(languageFrequency),
    datasets: [
      {
        label: 'Languages Used',
        data: Object.values(languageFrequency),
        backgroundColor: generateColors(Object.keys(languageFrequency).length),
      },
    ],
  };

  const lineData = {
    labels: timelineLabels,
    datasets: [
      {
        label: 'Code Activity Over Time (Additions + Deletions)',
        data: timelineData,
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: repoLabels,
    datasets: [
      {
        label: 'Additions',
        data: repoData.map((repo) =>
          repo.code_frequency?.reduce((sum, week) => sum + week[1], 0) || 0
        ),
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Deletions',
        data: repoData.map((repo) =>
          Math.abs(repo.code_frequency?.reduce((sum, week) => sum + week[2], 0) || 0)
        ),
        backgroundColor: '#F44336',
      },
    ],
  };


  const dependencyByManifestData = {
  labels: repoLabels,
  datasets: Object.entries(manifestDependencyMap).map(([filename, repoDepCounts], index) => ({
    label: filename,
    data: repoLabels.map((fullName) => repoDepCounts[fullName] || 0),
    backgroundColor: generateColors(Object.keys(manifestDependencyMap).length)[index],
  })),
};

    console.log('Tooltip Dependency Map:', tooltipDependencyMap);
console.log('Repo Labels:', repoLabels);
  return (
  
  <div>
    <Navbar />

    <div className="p-4 border border-t-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-Oxfordblue scrollbar-track-Deftblue border-gray-300">
      <div className="h-screen overflow-y-auto  scrollbar-thin scrollbar-thumb-Deftblue scrollbar-track-Oxfordblue py-4">
          <h2 className="text-2xl sm:text-3xl dark:text-white font-bold text-center mb-1">
              GitHub Activity Charts
            </h2>
        <div className="flex flex-col md:flex-row md:gap-4 py-4 pb-32">
          

          {/* LEFT PANEL */}
          <div className="w-full md:w-[70%]">
          
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!error && repoData.length === 0 && <p className='dark:text-white'>Loading data...</p>}
            {!error && repoData.length > 0 && !hasCommits && <p>No commits to display.</p>}

            {/* Line Chart */}
            <figure className="w-full h-72 sm:h-96 border rounded-md px-4 pb-12 mb-8 shadow" aria-labelledby="line-chart-desc">
              <figcaption id="line-chart-desc" className="text-lg sm:text-xl dark:text-white font-semibold mb-4 text-center">
                Code Activity Over Time
              </figcaption>
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
            </figure>

            {/* Bar Chart */}
            <figure className="w-full h-72 sm:h-96 border rounded-md px-4 pb-12 mb-8 shadow" aria-labelledby="bar-chart-desc">
              <figcaption id="bar-chart-desc" className="text-lg sm:text-xl dark:text-white font-semibold mb-4 text-center">
                Code Frequency (Additions & Deletions)
              </figcaption>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </figure>

            {/* Dependency Chart */}
            <figure className="w-full h-72 sm:h-96 border rounded-md px-4 pb-12 mb-8 shadow" aria-labelledby="stacked-dependency-bar-chart-desc">
              <figcaption id="stacked-dependency-bar-chart-desc" className="text-lg sm:text-xl dark:text-white font-semibold mb-4 text-center">
                Dependencies by Manifest File
              </figcaption>
              <Bar
                data={dependencyByManifestData}
                className='dark:text-white'
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const repo = context.label || '';
                          const manifest = context.dataset.label || '';
                          const deps = tooltipDependencyMap?.[repo]?.[manifest];
                          if (!deps || deps.length === 0) return `${manifest}: 0 dependencies`;
                          const visible = deps.slice(0, 5).join(', ');
                          const more = deps.length > 5 ? ` +${deps.length - 5} more` : '';
                          return `${manifest}: ${visible}${more}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: { stacked: true},
                    y: { stacked: true },
                  },
                }}
              />
            </figure>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-[30%] mt-4 md:mt-0 space-y-8">
            {/* Pie Chart */}
            {hasCommits && (
              <figure className="w-full h-96 border rounded-md px-4 pb-12 shadow" aria-labelledby="pie-chart-desc">
                <figcaption id="pie-chart-desc" className="text-lg sm:text-xl dark:text-white font-semibold mb-4 text-center">
                  Commits per Repo
                </figcaption>
                <Pie data={pieData} options={{ maintainAspectRatio: false, responsive: true }} />
              </figure>
            )}

            {/* Doughnut Chart */}
            <figure className="w-full h-72 sm:h-96 border rounded-md px-4 pb-12 shadow" aria-labelledby="doughnut-chart-desc dark:text-white">
              <figcaption id="doughnut-chart-desc" className="text-lg sm:text-xl dark:text-white font-semibold mb-4 text-center">
                Language Usage
              </figcaption>
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  
};

export default GitHubActivityCharts;
