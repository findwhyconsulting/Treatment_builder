import mongoose from 'mongoose';

const config = require ("./Config")

const db=require('./Config').get(process.env.NODE_ENV).DB;

// Use the full connection string for DigitalOcean MongoDB (MongoDB Atlas format)
const mongodburl = db.CONNECTION_STRING || `mongodb://${db.HOST}:${db.PORT}/${db.DATABASE}`;
console.log('MongoDB URL:', mongodburl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Log URL without exposing credentials

export const mongoconnection = async()=>{
    try{
        // For MongoDB Atlas/DigitalOcean, credentials are in the connection string
        const connectionOptions = {
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        
        await mongoose.connect(mongodburl, connectionOptions);
        console.log("DigitalOcean MongoDB Database Connected Successfully!");
    }
    catch(e){
        console.log('Database connection error:', e)
        throw e.message;
    }
} 