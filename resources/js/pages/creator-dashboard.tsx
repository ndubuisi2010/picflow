import { Head } from '@inertiajs/react'
import CreatorLayout from '@/layouts/creator-layout'

import {
  Card,
  CardContent,
  CardDescription,
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

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

import {
  Image,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react'

// ==================================================
// Chart.js registration (MANDATORY)
// ==================================================
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
)

// ==================================================
// Types
// ==================================================
interface MonthlyData {
  month: string
  photos: number
  views: number
  likes: number
  comments: number
}

interface TopPhoto {
  id: number
  title: string
  thumbnail: string
  views: number
  likes_count: number
  comments_count: number
}

interface DashboardProps {
  totalPhotos: number
  totalViews: number
  totalLikes: number
  totalComments: number
  monthlyData: MonthlyData[]
  topPhotos: TopPhoto[]
}

// ==================================================
// Component
// ==================================================
export default function CreatorDashboard({
  totalPhotos,
  totalViews,
  totalLikes,
  totalComments,
  monthlyData,
  topPhotos,
}: DashboardProps) {

  // ==================================================
  // Chart Data (Chart.js format)
  // ==================================================
  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Photos',
        data: monthlyData.map(item => item.photos),
        backgroundColor: '#2563eb',
        borderRadius: 6,
      },
      {
        label: 'Views',
        data: monthlyData.map(item => item.views),
        backgroundColor: '#16a34a',
        borderRadius: 6,
      },
      {
        label: 'Likes',
        data: monthlyData.map(item => item.likes),
        backgroundColor: '#dc2626',
        borderRadius: 6,
      },
      {
        label: 'Comments',
        data: monthlyData.map(item => item.comments),
        backgroundColor: '#9333ea',
        borderRadius: 6,
      },
    ],
  }

  // ==================================================
  // Chart Options (Chart.js v4)
  // ==================================================
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  }

  return (
    <CreatorLayout>
      <Head title="Analytics Dashboard" />

      <div className="space-y-8 p-4 md:p-8">

        {/* ================= Header ================= */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your content performance over the last 12 months
          </p>
        </div>

        {/* ================= KPI Cards ================= */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Photos" value={totalPhotos} icon={<Image />} />
          <StatCard title="Total Views" value={totalViews} icon={<Eye />} />
          <StatCard title="Total Likes" value={totalLikes} icon={<Heart />} />
          <StatCard title="Total Comments" value={totalComments} icon={<MessageCircle />} />
        </div>

        {/* ================= Chart ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Engagement trends for the last 12 months
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[420px] w-full">
              <Bar data={data} options={options} />
            </div>
          </CardContent>
        </Card>

        {/* ================= Table ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Most Viewed Photos</CardTitle>
            <CardDescription>
              Your best-performing content
            </CardDescription>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {topPhotos.map((photo, index) => (
                  <TableRow key={photo.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <img
                        src={photo.thumbnail}
                        alt={photo.title}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    </TableCell>

                    <TableCell className="max-w-xs truncate font-medium">
                      {photo.title}
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      {photo.views.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right">
                      {photo.likes_count.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right">
                      {photo.comments_count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </CreatorLayout>
  )
}

// ==================================================
// Reusable Stat Card
// ==================================================
function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="text-muted-foreground h-4 w-4">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
