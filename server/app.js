require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// database
const connectDB = require('./db/connect');

//  routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const pdfRouter = require('./routes/pdfRoutes');
const feedbackRouter = require('./routes/feedbackRoutes');

// middleware
const {authenticateUser} = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const globalRateLimiter = require("./middleware/globalRateLimiter");
require("./workers/pdfWorker");


app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(globalRateLimiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user',authenticateUser, userRouter);
app.use('/api/v1',authenticateUser,pdfRouter)
app.use('/api/v1', feedbackRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
