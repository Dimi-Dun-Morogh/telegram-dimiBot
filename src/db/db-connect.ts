import mongoose from 'mongoose';

import config from '../config/database';

export const connectDb = async () => {
  try {
    await mongoose.connect(config.url!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
