const exp = require('express')
const app = exp()
const mclient = require('mongodb').MongoClient

//DB url
const DBurl = "mongodb+srv://ravi2003:ravi2003@cluster0.psgg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// connect with mongodb server
mclient.connect(DBurl)
.then((client)=>{
    // get DB object
    let dbobj = client.db('ravi2003')

    // get collection object
    let userCollectionObj = dbobj.collection('usercollection')

    // sharing collection obj to api
    app.set('userCollectionObj',userCollectionObj)

    console.log("DB connection is success")

})
.catch((err)=>console.log(`error in DB connection ${err}`))


// importing userApp
const userApp = require('./APIS/userApi')

// middleware to 
app.use('/user-api', userApp)


// middleware to handle invalid paths
app.use((req,res,next)=>{
    res.send({message:`path ${req.url} is invalid path`})
})

// middleawre to handle with errors
app.use((error,req,res,next)=>{
    res.send({message:`${error.message}`})
})
app.listen(4000, ()=> console.log("Server started on port 4000"))