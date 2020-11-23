import express from 'express'

type SendNotificationHandler = (channelId: string, text?: string) => Promise<void>

export default class WebService {
  private sendNotificationHandler?: SendNotificationHandler

  setSendNotificationHandler (handler: SendNotificationHandler): void {
    this.sendNotificationHandler = handler
  }

  start (): void {
    const app = express()
    const port = parseInt(process.env.PORT ?? '3000')

    app.get('/', (req, res) => {
      res.send('Nothing here')
    })

    app.get('/send/:channelId/:text?', async (req, res) => {
      const { channelId, text } = req.params

      if (channelId) {
        try {
          await this.sendNotificationHandler!(channelId, text)

          res.send('Notification send')
        } catch (e) {
          res.status(403)
          res.send(e.message)
        }
      } else {
        res.status(400)
        res.send('Invalid format')
      }
    })

    app.listen(port, () => {
      console.log(`VamUved listening at http://localhost:${port}`)
    })
  }
}
