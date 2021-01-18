const logger = {
  getTimeStamp: () => new Date().toLocaleTimeString(),
  info(namespace, message, object) {
    console.log(`${this.getTimeStamp()} [${namespace}] [${message}]`, object || '');
  },
};

module.exports = logger;
