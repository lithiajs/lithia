import moment from 'moment';
import picocolors from 'picocolors';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

enum LevelColors {
  info = 'blue',
  warn = 'yellow',
  error = 'red',
  debug = 'magenta',
}

type LoggerOptions = {
  context?: string;
};

export class Logger {
  private static staticInstanceRef = new Logger();

  get timestamp() {
    return process.env['ASTEROIDE_LOGGER_TIMESTAMP'] === 'true';
  }

  get context() {
    return typeof this.options === 'string'
      ? this.options
      : this.options?.context;
  }

  constructor(private readonly options?: string | LoggerOptions) {}

  private getTimestamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  log(level: LogLevel | string, message: string) {
    console.log(this.buildMessage(level, message));
  }

  static log(level: LogLevel | string, message: string) {
    Logger.staticInstanceRef.log(level, message);
  }

  info(message: string) {
    this.log('info', message);
  }

  static info(message: string) {
    Logger.staticInstanceRef.info(message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  static warn(message: string) {
    Logger.staticInstanceRef.warn(message);
  }

  error(message: string) {
    this.log('error', message);
  }

  static error(message: string) {
    Logger.staticInstanceRef.error(message);
  }

  debug(message: string) {
    this.log('debug', message);
  }

  static debug(message: string) {
    Logger.staticInstanceRef.debug(message);
  }

  private buildMessage(level: LogLevel | string, message: string) {
    const timestamp = this.timestamp ? this.colourTimestamp() : '';
    const context = this.context ? this.colourContext() : '';

    if (Object.keys(LevelColors).includes(level)) {
      return `${timestamp}${context}${this.colourLevel(level)}: ${this.colourMessage(level as LogLevel, message)}`;
    }

    return `${timestamp}${context}${this.colourLevel(level)}: ${this.colourMessage('info', message)}`;
  }

  private colourTimestamp() {
    return picocolors.gray(`[${this.getTimestamp()}] `);
  }

  private colourContext() {
    return picocolors.yellow(`[${this.context}] `);
  }

  private colourLevel(level: string) {
    return picocolors.gray(level.toUpperCase());
  }

  private colourMessage(level: LogLevel, message: string) {
    return picocolors[LevelColors[level]](message);
  }
}
