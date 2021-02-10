import mongoose from 'mongoose';

import config from '../config/database';

export const connectDb = () =>
  mongoose.connect(config.url!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
