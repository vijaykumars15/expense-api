const {MongoClient}=require('mongodb')
let db
function connectTODB(callback){
     MongoClient.connect('mongodb+srv://vijay:vijay@cluster0.kigt8oz.mongodb.net/expenses?retryWrites=true&w=majority').then(function(client){
        db=client.db()
        callback()
    }).catch(function(error){
        callback(error)
    })
}
function getDB(){
    return db

}
//exporting the required functions
module.exports={connectTODB,getDB}