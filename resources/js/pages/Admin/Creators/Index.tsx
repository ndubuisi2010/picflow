import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

import AdminLayout from '@/layouts/admin-layout'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'

import {
  create,
  destroy,
  edit,
  index,
  show,
  updateStatus,
} from '@/routes/admin/creators'

import MyModal from '@/components/my-modal'

// =================================================
// Types
// =================================================
interface Creator {
  id: number
  name: string
  email: string
  creator_status: 'pending' | 'active' | 'suspended'
  photos_count: number
  created_at: string
}

interface CreatorsIndexProps {
  creators: {
    data: Creator[]
    current_page: number
    last_page: number
  }
  filters: {
    search?: string
    status?: string
  }
}

// =================================================
// Component
// =================================================
export default function CreatorsIndex({
  creators,
  filters,
}: CreatorsIndexProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [creatorToDelete, setCreatorToDelete] = useState<Creator | null>(null)

  const handleStatusChange = (creatorId: number, status: string) => {
    router.patch(updateStatus(creatorId), {
      creator_status: status,
    })
  }

  const openDeleteModal = (creator: Creator) => {
    setCreatorToDelete(creator)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setCreatorToDelete(null)
  }

  const confirmDelete = () => {
    if (!creatorToDelete) return

    router.delete(destroy(creatorToDelete.id), {
      onFinish: closeDeleteModal,
    })
  }

  return (
    <AdminLayout>
      <Head title="Creators" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Creators</CardTitle>
              <Button asChild>
                <Link href={create()}>Create Creator</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* ================= Filters ================= */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Input
                placeholder="Search by name or email..."
                defaultValue={filters.search ?? ''}
                onChange={(e) =>
                  router.get(
                    index(),
                    { search: e.target.value, status: filters.status },
                    { preserveState: true, replace: true }
                  )
                }
                className="max-w-sm"
              />

              <Select
                value={filters.status ?? 'all'}
                onValueChange={(value) =>
                  router.get(
                    index(),
                    { status: value === 'all' ? null : value, search: filters.search },
                    { preserveState: true, replace: true }
                  )
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ================= Table ================= */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {creators.data.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell className="font-medium">
                      {creator.name}
                    </TableCell>
                    <TableCell>{creator.email}</TableCell>
                    <TableCell>{creator.photos_count}</TableCell>

                    {/* ===== Status Select ===== */}
                    <TableCell>
                      <Select
                        value={creator.creator_status}
                        onValueChange={(value) =>
                          handleStatusChange(creator.id, value)
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="pending">
                            <Badge variant="secondary">Pending</Badge>
                          </SelectItem>
                          <SelectItem value="active">
                            <Badge>Active</Badge>
                          </SelectItem>
                          <SelectItem value="suspended">
                            <Badge variant="destructive">Suspended</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      {new Date(creator.created_at).toLocaleDateString()}
                    </TableCell>

                    {/* ===== Actions ===== */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={show(creator.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link href={edit(creator.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteModal(creator)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ================= Delete Modal ================= */}
      <MyModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Creator Deletion"
      >
        <p className="mb-4">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {creatorToDelete?.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </MyModal>
    </AdminLayout>
  )
}
