import fastify from 'fastify'
import fs from 'node:fs'

export const app = fastify()

app.get('/video', async (request, reply) => {
  const videoPath = new URL('../public/video.mp4', import.meta.url).pathname

  if (!fs.existsSync(videoPath)) {
    return reply.status(404).send('Video not found')
  }

  const stat = fs.statSync(videoPath)
  const fileSize = stat.size
  const range = request.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1
    const stream = fs.createReadStream(videoPath, { start, end })

    reply
      .code(206)
      .headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      })

    return stream
  }
  else {
    reply
      .code(200)
      .headers({
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      })

    return fs.createReadStream(videoPath)
  }
})
