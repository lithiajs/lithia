import { LoggerService } from '../interfaces';
import { colors } from '../utils';

export class Logger implements LoggerService {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private get useTimestamp(): boolean {
    return process.env.LOG_TIMESTAMP === 'true';
  }

  private get useColors(): boolean {
    return (
      process.env.NO_COLORS === 'false' || process.env.NO_COLORS === undefined
    );
  }

  private get levels(): string[] {
    const levels = process.env.LOG_LEVELS || 'debug,error,log,verbose,warn';
    return levels.split(',')?.map((level) => level.trim());
  }

  private get levelColors(): Record<string, (text: string) => string> {
    return {
      debug: colors.magenta,
      error: colors.red,
      log: colors.lightGreen,
      verbose: colors.cyan,
      warn: colors.yellow,
    };
  }

  debug(message: string, context?: string): void {
    if (this.levels.includes('debug')) {
      console.debug(
        this.formatMessage(message, 'debug', context || this.context),
      );
    }
  }

  error(message: string, context?: string): void {
    if (this.levels.includes('error')) {
      console.error(
        this.formatMessage(message, 'error', context || this.context),
      );
    }
  }

  log(message: string, context?: string): void {
    if (this.levels.includes('log')) {
      console.log(this.formatMessage(message, 'log', context || this.context));
    }
  }

  verbose(message: string, context?: string): void {
    if (this.levels.includes('verbose')) {
      console.log(
        this.formatMessage(message, 'verbose', context || this.context),
      );
    }
  }

  warn(message: string, context?: string): void {
    if (this.levels.includes('warn')) {
      console.warn(
        this.formatMessage(message, 'warn', context || this.context),
      );
    }
  }

  setContext(context: string): void {
    this.context = context;
  }

  private formatMessage(
    message: string,
    level: string,
    context?: string,
  ): string {
    const timestamp = this.useTimestamp
      ? new Date(Date.now()).toISOString()
      : undefined;

    const contextString = context ? `[${context}]` : '';
    const levelString = this.useColors
      ? this.levelColors[level](level.toUpperCase())
      : level.toUpperCase();

    return `${timestamp ? `${timestamp} ` : ''}${levelString} ${contextString} ${message || ''}`;
  }
}
