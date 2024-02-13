const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const {ObjectId}=require('mongodb')
//Importing the required functions from db.cjs
const { connectTODB, getDB } = require('./db.cjs')
const app = express ()
app.use(bodyParser.json())
app.use(cors())
let db
connectTODB(function(error){
    if(error){
        console.log('not connection')
    }else{
        //process.env.PORT:cloud service
        //8000:local machine
        const port = process.env.PORT || 8000
        app.listen(port)
        db=getDB()
        console.log(`listening on port${port}...`)
    }
})

/*
*Expense Tracker
*functioning
*CRUD: create,read,update and delete
*get-entires/get-data-GET
*add-entry-post
*edit-entry-patch
*delete-entry-delete
*/

app.post('/add-entry',function(request,response){
   db.collection('expensedata').insertOne(request.body).then(function(){
         response.status(200).json({
             "status":"entry added successfully"
         })
     }).catch(function(){
         response.status(500).json({
             "status":"Entry not added"
         })
     })
 })
 app.get('/get-entries',function(request,response){
     const entries =[]
     db.collection('expensedata')
     .find()
     .forEach(entry =>entries.push(entry))
     .then(function(){
         response.status(200).json(entries)
     }) .catch(function(){
         response.status(500).json({
             "status":"could not fetch documents"
         })
     })
        
     })
    
    app.delete('/delete-entry', function(request, response) {
        if(ObjectId.isValid(request.query.id)) {
            db.collection('expensedata').deleteOne({
                _id : new ObjectId(request.query.id)
            }).then(function() {
                response.status(200).json({
                    "status" : "Entry successfully deleted"
                })
            }).catch(function() {
                response.status(500).json({
                    "status" : "Entry not deleted"
                })
            })
        } else {
            response.status(500).json({
                "status" : "ObjectId not valid"
            })
        }
     })
     app.patch('/update-entry/:id', function(request, response) {
        if(ObjectId.isValid(request.params.id)) {
            db.collection('expensedata').updateOne(
                { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
                { $set : request.body } // The data to be updated
            ).then(function() {
                response.status(200).json({
                    "status" : "Entry updated successfully"
                })
            }).catch(function() {
                response.status(500).json({
                    "status" : "Unsuccessful on updating the entry"
                })
            })
        } else {
            response.status(500).json({
                "status" : "ObjectId not valid"
            })
        }
    })