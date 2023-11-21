// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database,
//     waitForConnections: true,
//     connectionLimit: 100,
//     multipleStatements: true
// });
// console.log('Database connection created')
// module.exports = pool

import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        // console.log(process.env.MONGO_URI_3);
        const data = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected: ${data.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
