/* eslint no-console: "off" */
const mongoose = require('mongoose');

module.exports = function(dbUri) {
    
    const promise = mongoose.connect(dbUri);
    
    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected',  () => {  
        console.log('Mongoose default connection open to ' + dbUri);
    });
    
    // If the connection throws an error
    mongoose.connection.on('error', (err) => {  
        console.log('Mongoose default connection error: ' + err);
    }); 
    
    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {  
        console.log('Mongoose default connection disconnected'); 
    });
    
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', () => {  
        mongoose.connection.close(() => { 
            console.log('Mongoose default connection disconnected through app termination'); 
            process.exit(0); 
        }); 
    });

    return promise;
};