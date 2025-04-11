import mongoose from "mongoose";

const mongoDbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      autoIndex: true,
    });
    console.log(`mongodb connected successfully`.bgGreen.white);
  } catch (error) {
    console.log(`error.message`.bgRed.bold);
  }
};

export default mongoDbConnection;
