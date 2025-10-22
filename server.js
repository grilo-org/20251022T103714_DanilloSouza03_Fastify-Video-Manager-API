import { fastify } from 'fastify'
import { DatabaseMemory } from './database-memory.js'
import { title } from 'node:process'
import { DatabasePostgres } from './database-postgres.js'

const app = fastify()

// const db = new DatabaseMemory()

const db = new DatabasePostgres()

app.get('/', () => {
  return 'API no ar!'
})

app.get('/videos', (request) => {
  const search = request.query.search

  const videos = db.list(search)

  return videos
})

app.post('/video', (request, reply) => {
  const {title, description, duration} = request.body

  db.create({
    title: title,
    description: description,
    duration: parseInt(duration)
  })

  return reply.status(201).send()
})

app.put('/video/:id', (request, reply) => {
  const {title, description, duration} = request.body
  const idVideo = request.params.id

  db.update(idVideo, {
    title: title,
    description: description,
    duration: duration
  })

  return reply.status(204).send()
})

app.delete('/video/:id', (request, reply) => {
  const videoId = request.params.id
  db.delete(videoId)
  return reply.status(204).send()
})

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
})