import { Catch, HttpException } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString()
    })
  }
}
