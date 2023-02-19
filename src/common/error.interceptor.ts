import {
    BadRequestException,
    CallHandler,
    ConflictException,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
    NotFoundException,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger('ErrorInterceptor');
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                this.logger.error({ ...err });
                if (err instanceof TimeoutError) {
                    throw new RequestTimeoutException();
                }
                if (err.name === 'EntityNotFound') {
                    throw new NotFoundException(err.message);
                }
                if (err.code === '23505') {
                    throw new ConflictException(err.detail);
                }
                if (err.code === '23503') {
                    throw new BadRequestException(err.detail);
                }
                throw err;
            }),
        );
    }
}