'use client'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Course } from '@prisma/client'
import axios from 'axios'
import { PencilIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

type CategoryFormProps = {
  initialData: Course
  courseId: string
  options: Array<{ label: string; value: string }>
}

const formSchema = z.object({
  categoryId: z.string().min(1),
})

type FormSchema = z.infer<typeof formSchema>

export default function CategoryForm({ initialData, courseId, options }: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId ?? '' },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong! 3')
    }
  }

  const selectedOption = options.find((option) => option.value === initialData?.categoryId)

  return (
    <div className="bg-slate-100 mt-6 md:mt-0 p-4 border rounded-md">
      <div className="flex justify-between items-center font-medium">
        Course Category
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <PencilIcon className="mr-2 w-4 h-4" />
              Edit Category
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p className={cn('mt-2 text-sm', { 'italic text-muted-foreground': !initialData.categoryId })}>
          {selectedOption?.label ?? 'No Category'}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
