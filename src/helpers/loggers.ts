const logger = {
  getTimeStamp: () => new Date().toLocaleTimeString('en-GB', {
    hour12: false,
  }),
  info(namespace: string, message: string, object?: any) {
    console.log(`${this.getTimeStamp()} [INFO] [${namespace}] [${message}]`, object || '');
  },
  error(namespace: string, message: string, object?: any) {
    console.log(`${this.getTimeStamp()} [ERROR] [${namespace}] [${message}]`, object || '');
  },
};

export default logger;
