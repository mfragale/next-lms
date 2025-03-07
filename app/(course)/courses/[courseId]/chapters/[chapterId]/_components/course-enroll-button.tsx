'use client'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

type CourseEnrollButtonProps = {
  price: number
  courseId: string
}

export default function CourseEnrollButton({ price, courseId }: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      window.location.assign(response.data.url)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full md:w-auto" size="sm" onClick={onClick} disabled={isLoading}>
      Enroll for {formatPrice(price)}
    </Button>
  )
}
