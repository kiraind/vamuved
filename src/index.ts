import express from 'express'

async function main () {
  const app = express()
  const port = parseInt(process.env.PORT ?? '3000')

  app.get('/', (req, res) => {
    res.send('Nothing here')
  })

  app.listen(port, () => {
    console.log(`VamUved listening at http://localhost:${port}`)
  })
}

main().catch(e => console.error(e))
