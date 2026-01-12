import AdminLayout from '@/layouts/admin-layout'
import { Head } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
]

interface DashboardProps {
  stats: {
    totalCreators: number
    totalConsumers: number
    totalPhotos: number
    totalViews: number
    totalLikes: number
    totalComments: number
  }
  monthlyData: {
    month: string
    photos: number
    views: number
    likes: number
    comments: number
  }[]
  topPhotos: {
    id: number
    title: string
    thumbnail: string
    views: number
    likes_count: number
    comments_count: number
    creator: {
      name: string
    }
  }[]
}

export default function Dashboard({
  stats,
  monthlyData,
  topPhotos,
}: DashboardProps) {
  // ===================== LINE CHART =====================
  const lineChartData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: 'Views',
        data: monthlyData.map((m) => m.views),
        borderColor: 'hsl(220, 80%, 55%)',
        backgroundColor: 'hsl(220, 80%, 55%, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Likes',
        data: monthlyData.map((m) => m.likes),
        borderColor: 'hsl(120, 70%, 45%)',
        backgroundColor: 'hsl(120, 70%, 45%, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Comments',
        data: monthlyData.map((m) => m.comments),
        borderColor: 'hsl(0, 70%, 50%)',
        backgroundColor: 'hsl(0, 70%, 50%, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  }

  // ===================== BAR CHART =====================
  const barChartData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      { label: 'Photos', data: monthlyData.map((m) => m.photos), backgroundColor: 'hsl(220, 80%, 55%)' },
      { label: 'Views', data: monthlyData.map((m) => m.views), backgroundColor: 'hsl(120, 70%, 45%)' },
      { label: 'Likes', data: monthlyData.map((m) => m.likes), backgroundColor: 'hsl(0, 70%, 50%)' },
      { label: 'Comments', data: monthlyData.map((m) => m.comments), backgroundColor: 'hsl(45, 90%, 55%)' },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  }

  // ===================== PIE CHART =====================
  const pieChartData = {
    labels: ['Creators', 'Consumers'],
    datasets: [
      {
        label: 'Users',
        data: [stats.totalCreators, stats.totalConsumers],
        backgroundColor: ['hsl(220, 80%, 55%)', 'hsl(0, 70%, 50%)'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 1,
      },
    ],
  }

  const pieChartOptions = { responsive: true }

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />

      <div className="space-y-6 p-4">
        {/* ===================== STATS ===================== */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Creators" value={stats.totalCreators} />
          <StatCard title="Consumers" value={stats.totalConsumers} />
          <StatCard title="Photos" value={stats.totalPhotos} />
          <StatCard title="Views" value={stats.totalViews} />
          <StatCard title="Likes" value={stats.totalLikes} />
          <StatCard title="Comments" value={stats.totalComments} />
        </div>

        {/* ===================== LINE + BAR CHARTS SIDE BY SIDE ===================== */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Platform Engagement (Line)</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={lineChartData} options={lineChartOptions} />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Monthly Stats (Bar)</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={barChartData} options={barChartOptions} />
            </CardContent>
          </Card>
        </div>

        {/* ===================== PIE CHART SMALL ===================== */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={pieChartData} options={pieChartOptions} />
            </CardContent>
          </Card>
        </div>

        {/* ===================== TOP PHOTOS ===================== */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPhotos.map((photo) => (
                  <TableRow key={photo.id}>
                    <TableCell className="flex items-center gap-3">
                      <img
                        src={photo.thumbnail}
                        alt={photo.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <span className="font-medium">{photo.title}</span>
                    </TableCell>
                    <TableCell>{photo?.creator?.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{photo.views}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{photo.likes_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{photo.comments_count}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

/* ===================== SMALL COMPONENT ===================== */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}
