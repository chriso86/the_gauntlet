import {LoggerGateway} from "../gateways/logger.gateway";
import {LogEventModel} from "../models/log-event.model";

export class LoggerService {
    loggerGateway: LoggerGateway = new LoggerGateway();

    logEvent(action: string, userId: string) {
        const logEvent = new LogEventModel(
            new Date(),
            userId || 'NODATA',
            action
        );

        this.loggerGateway.logEvent(logEvent);
    }
}
