import { blob } from 'hub:blob'
import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

const SUPPORTED_MIMES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/x-ms-bmp', 'image/tiff', 'image/webp'] as const
type SupportedMime = typeof SUPPORTED_MIMES[number]

const MIME_ALIASES: Record<string, SupportedMime> = { 'image/jpg': 'image/jpeg' }

const MIME_TO_EXT: Record<SupportedMime, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif',
  'image/bmp': 'bmp', 'image/x-ms-bmp': 'bmp', 'image/tiff': 'tiff', 'image/webp': 'webp',
}

type JimpMime = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/bmp' | 'image/x-ms-bmp' | 'image/tiff'

const MIME_TO_JIMP: Record<SupportedMime, JimpMime> = {
  'image/png': 'image/png', 'image/jpeg': 'image/jpeg', 'image/gif': 'image/gif',
  'image/bmp': 'image/bmp', 'image/x-ms-bmp': 'image/x-ms-bmp',
  'image/tiff': 'image/tiff', 'image/webp': 'image/png',
}

const JIMP_TO_EXT: Record<JimpMime, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif',
  'image/bmp': 'bmp', 'image/x-ms-bmp': 'bmp', 'image/tiff': 'tiff',
}

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const formData = await readMultipartFormData(event)
    const file = formData?.find(i => i.name === 'file')?.data
    const fileName = formData?.find(i => i.name === 'fileName')?.data?.toString()
    const type = formData?.find(i => i.name === 'type')?.data?.toString()

    if (!file || !fileName || !type) return apiError(event, 400, 'VALIDATION_ERROR', 'Missing file or metadata')
    if (!type.startsWith('image/') || ![...SUPPORTED_MIMES, ...Object.keys(MIME_ALIASES)].includes(type)) {
      return apiError(event, 400, 'VALIDATION_ERROR', 'Unsupported image format')
    }

    const mime: SupportedMime = MIME_ALIASES[type] ?? type as SupportedMime
    const ext = MIME_TO_EXT[mime]
    const avatarFolder = `users/${session.user.id}/avatar`
    const hb = blob

    const { Jimp } = await import('jimp')
    const originalImage = await Jimp.fromBuffer(file)
    const sizes = [
      { width: 48, suffix: 'xxs' }, { width: 160, suffix: 'sm' },
      { width: 320, suffix: 'md' }, { width: 640, suffix: 'lg' },
    ]

    const fileBlob = new Blob([new Uint8Array(file)], { type: mime })
    await hb.put(`${avatarFolder}/original.${ext}`, fileBlob, { addRandomSuffix: false })

    for (const size of sizes) {
      const resized = originalImage.clone().resize({ w: size.width })
      const jimpMime = MIME_TO_JIMP[mime]
      const buffer = await resized.getBuffer(jimpMime)
      const resizedExt = JIMP_TO_EXT[jimpMime]
      await hb.put(`${avatarFolder}/${size.suffix}.${resizedExt}`, new Blob([new Uint8Array(buffer)], { type: jimpMime }), { addRandomSuffix: false })
    }

    const storedPath = `/${avatarFolder}/original.${ext}`
    await db.update(schema.users).set({ avatar: storedPath, updated_at: new Date().toISOString() }).where(eq(schema.users.id, session.user.id)).run()
    await replaceUserSession(event, { user: { ...session.user, avatar: storedPath } })

    return apiCreated(event, { src: storedPath, alt: fileName })
  } catch (err: any) {
    console.error('[API v1] POST /user/avatar error:', err?.message || err)
    return apiError(event, 500, 'INTERNAL_ERROR', 'Failed to upload avatar')
  }
})
