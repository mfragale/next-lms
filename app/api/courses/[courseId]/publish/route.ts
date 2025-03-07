import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, createdById: userId },
      include: { chapters: { include: { muxData: true } } },
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    /** Should have a published chapter */
    const hasPublishedChapter = course.chapters.some((chapter: { isPublished: any }) => chapter.isPublished)

    if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const publishedCourse = await db.course.update({ where: { id: params.courseId }, data: { isPublished: true } })

    return NextResponse.json(publishedCourse)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
