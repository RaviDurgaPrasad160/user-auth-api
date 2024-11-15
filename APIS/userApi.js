const exp = require('express')
const userApp = exp.Router()

// importing bcryptjs to hash password
const bcryptjs = require('bcryptjs')

// importing jsonwebtoken to create token
let jwt = require('jsonwebtoken')

// importing expressAsyncHandler
const expressAsyncHandler = require('express-async-handler')

// to extract body of request
userApp.use(exp.json())

// route to handle login request
userApp.use('/loginuser', expressAsyncHandler(async(req,res)=>{
    // get userCollection Obj
    let userCollectionObj = req.app.get('userCollectionObj')
    // getting login credentials
    let loginCredentials = req.body
    let userofDB = await userCollectionObj.findOne({username:loginCredentials.username})
    if(userofDB == null){
        res.send({message:"Invalid username or password"})
    }
    // if username match
    else {
        // to compare passwords
        let status = await bcryptjs.compare(loginCredentials.password, userofDB.password)
        // if password does not match
        if(status === false){
            res.send({message:"Invalid username or password"})
        }
        // if psssword match
        else {
            // create token
            let token = jwt.sign({message:userofDB.username}, "abcdef", {expiresIn:60})
            res.send({message:"login success", payload:token, userObj:userofDB})
        }
    }
    
}))

// route to handle create-user
userApp.use('/create-user', expressAsyncHandler(async(req,res)=>{
    // get userCollection Obj
    let userCollectionObj = req.app.get('userCollectionObj')
    //get user from client
    let newUserObj = req.body
    // to check whether new user exist or not
    let userofDB = await userCollectionObj.findOne({username:newUserObj.username})
    // if username  exist
    if(userofDB !== null){
       res.send({message:"user already exist"})
    }
    // if username does not existed
    else{
         // password hashing
         let hashedPassword = await bcryptjs.hash(newUserObj.password,6)
         
        //  assign hashed password
        newUserObj.password = hashedPassword;
        // insert newUser
        await userCollectionObj.insertOne(newUserObj)

        res.send({message:"new user created"})
    }

}))

// route to handle update-user 
userApp.use('/update-user', expressAsyncHandler(async(req,res)=>{

}))

// route to handle delete route
userApp.use('remove-user', expressAsyncHandler(async(req,res)=>{

}))

module.exports = userApp

