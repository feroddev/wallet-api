import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' }
      ]
    })

    this.configurarLogs()
  }

  private configurarLogs() {
    const prismaClient = this as any

    prismaClient.$on('error', (e: any) => {
      this.logger.error(`Prisma Error: ${e.message}`)
    })

    prismaClient.$on('info', (e: any) => {
      this.logger.log(`Prisma Info: ${e.message}`)
    })

    prismaClient.$on('warn', (e: any) => {
      this.logger.warn(`Prisma Warning: ${e.message}`)
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Prisma conectado com sucesso')
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Prisma desconectado com sucesso')
  }

  async executeWithExtendedTimeout<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = Date.now()
    try {
      const result = await operation()
      const duration = Date.now() - startTime
      this.logger.log(`Operação concluída em ${duration}ms`)
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      this.logger.error(`Erro na operação após ${duration}ms: ${error.message}`)
      throw error
    }
  }
}
