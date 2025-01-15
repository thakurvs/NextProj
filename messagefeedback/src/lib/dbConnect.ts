import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const Connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    //if connection is already established then return the connection, to prevent it from being created again and again and choking the server
    if(Connection.isConnected) {  
        console.log("Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        console.log("db is", db);

        Connection.isConnected = db.connections[0].readyState; //return the array of connections with ready state 
        console.log("Connection status:", Connection.isConnected);
        console.log("Connected to MongoDB Successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default dbConnect;

