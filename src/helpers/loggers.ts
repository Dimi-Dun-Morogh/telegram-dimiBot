const logger = {
  getTimeStamp: () => new Date().toLocaleTimeString('en-GB', {
    hour12: false,
  }),
  info(namespace: string, message: string, object?: any) {
    console.log(`${this.getTimeStamp()} [${namespace}] [${message}]`, object || '');
  },
};

export default logger;
