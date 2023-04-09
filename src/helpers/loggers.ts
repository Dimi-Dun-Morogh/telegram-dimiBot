class Logger {
  readonly locale:string;

  constructor(locale:string) {
    this.locale = locale;
  }

  private getTimeStamp() {
    return new Date().toLocaleTimeString(this.locale, {
      hour12: false,
    });
  }

  info(namespace: string, message: string, object?: any) {
    console.log(`${this.getTimeStamp()} [INFO] [${namespace}] [${message}]`, object || '');
  }

  error(namespace: string, message: string | any, object?: any) {
    console.error(`${this.getTimeStamp()} [ERROR] [${namespace}] [${message}]`, object || '');
  }
}

const logger = new Logger('en-GB');

export default logger;
