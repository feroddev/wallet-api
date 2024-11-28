import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const { message } = exception.getResponse() as any

    return response.status(status).json({
      status,
      message: message || exception.message || 'Internal server error',
      timestamp: new Date().toISOString()
    })
  }
}
