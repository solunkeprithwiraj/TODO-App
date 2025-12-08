'use client'

import { useParams } from 'next/navigation'
import UserTasks from '@/components/AdminPanel/uaserTasks'

export default function UserTasksPage() {
  const params = useParams()
  return <UserTasks userId={params.userId as string} />
}

