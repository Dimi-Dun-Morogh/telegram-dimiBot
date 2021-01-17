const logger = {
  date: new Date().toLocaleTimeString(),
  info(namespace, message, object) {
    console.log(`${this.date} [${namespace}] [${message}]`, object || '');
  },
};

module.exports = logger;
