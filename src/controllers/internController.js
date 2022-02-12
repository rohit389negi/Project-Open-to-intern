//name:{mandatory},email:{mandatory,valid email,unique},mobile:{mandatory,valid mobile number,unique}, 
//collegeId:{ObjectId,ref to college model

//Create a document for an intern.
//Also save the collegeId along with the document. 
//Your request body contains the following fields - { name, mobile, email, collegeName}

//POST /functionup/interns
const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidEmail = function(value){
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value.trim()))
}
const isValidMobile = function(value){
    return (/^\d{10}$/.test(value))
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const registerIntern = async function (req, res) {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid Parameters, Please send correct intern details" })
            return
        }
        const { name, email, mobile, collegeName } = requestBody 
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "Name is required and should be valid" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: "email is required and should be valid" })
            return
        }
        if (!isValidEmail(email)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValidMobile(mobile)) {
            res.status(400).send({ status: false, message: `mobile should be a valid` })
            return
        }
        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, message: "collegeName is required and should be valid" })
            return
        }
        const isEmailAlreadyUsed = await internModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `"${email}" is already used, try different one` })
            return
        }
        const isMobileAlreadyUsed = await internModel.findOne({mobile})
        if (isMobileAlreadyUsed) {
            res.status(400).send({status:false, message :`"${mobile}" is already used, try another one`})
            return
        }
        const collegeDetails = await collegeModel.findOne({ name: collegeName, isDeleted : false })
        if (!collegeDetails) {
            res.status(404).send({ status: false, message: `No college exist by name "${collegeName}"` })
            return
        }
        const collegeId = collegeDetails._id
        const internDetails = { name, mobile, email, collegeId }
        const newIntern = await internModel.create(internDetails)
        return res.status(201).send({ status: true, message: "Intern registered successfully", newIntern })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { registerIntern }