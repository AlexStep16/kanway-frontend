import PQueue from 'p-queue'

const CONCURRENCY = 1

class RequestQueueService {
  private queues = new Map<string, PQueue>()
  private bulkQueue = new PQueue({ concurrency: 1 })

  private async _waitForIdToBecomeFree(id: string): Promise<void> {
    const queue = this.queues.get(id)

    if (queue) {
      await queue.onIdle()
    }
  }

  public enqueue<T>(id: string, coreAction: () => Promise<T>): Promise<T> {
    if (!this.queues.has(id)) {
      this.queues.set(id, new PQueue({ concurrency: CONCURRENCY }))
    }

    const queue = this.queues.get(id)!

    const resultPromise = queue.add(coreAction)

    resultPromise.finally(() => {
      if (queue.size === 0 && queue.pending === 0) {
        this.queues.delete(id)
      }
    })

    return resultPromise
  }

  public async enqueueBulk<T>(ids: string[], coreAction: () => Promise<T>): Promise<T> {
    const atomicCoreAction = async () => {
      await Promise.all(ids.map((id) => this._waitForIdToBecomeFree(id)))

      const corePromise = coreAction()

      ids.forEach((id) => {
        const queue = this.queues.get(id)

        if (!queue) {
          this.queues.set(id, new PQueue({ concurrency: CONCURRENCY }))
        }

        const updatedQueue = this.queues.get(id)!

        updatedQueue.add(() => corePromise.then(() => {}).catch(() => {}))
      })

      return corePromise
    }

    return this.bulkQueue.add(atomicCoreAction)
  }
}

export const requestQueueService = new RequestQueueService()
