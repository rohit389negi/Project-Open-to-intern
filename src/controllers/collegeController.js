//name:{mandatory, unique},fullName:{mandatory},logoLink:{mandatory}

//Create a college 

const validUrl = require('valid-url');
const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0   
}

//POST /functionup/colleges
const createCollege = async function(req,res){
    try{
        const requestBody = req.body
        if(!isValidRequestBody(requestBody)){
            return
        }
        const {name, fullName, logoLink} = requestBody
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "Name is required and should be valid Name" })
            return
        }
        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: "fullName is required and should be valid fullName" })
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: "logoLink is required and should be valid" })
            return
        }
        if (!validUrl.isUri(logoLink)) {
            res.status(400).send({ status: false, message: "Invalid logoLink " })
            return
        }
        const isNameAlreadyUsed = await collegeModel.findOne({name})
        if (isNameAlreadyUsed) {
            res.status(400).send({ status: false, message: "Name is already in use" })
            return
        }
        const data = {name, fullName, logoLink}
        const collegeDetails = await collegeModel.create(data)
        return res.status(201).send({status:true, message:'College created successfully', data:collegeDetails})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

// Returns the college details for the requested college 
// (Expect a query parameter by the name collegeName. 
// This is anabbreviated college name. For example iith)
// Returns the list of all interns who have applied for internship at this college.

// GET /functionup/collegeDetails

const getCollegeDetails = async function(req,res){
    try{
        const name = req.query.collegeName
        if (!isValid(name)){
            res.status(400).send({ status: true, message: "college name is required for college details and should be abbreviated with no spaces" })
            return
        }
        name.toLowerCase()
        const college = await collegeModel.findOne({name, isDeleted:false})
        if(!college){
            return 
        }
        const collegeId = college._id
        const internsDetails = await internModel.find({collegeId, isDeleted:false})
        if (internsDetails.length == 0) {
            const interns = "No one applied for internship"
            const { fullName, logoLink } = collegeDetails
            const data = { name, fullName, logoLink, interns }
            return res.status(200).send({ status: true, data: data })
        }
        const interns = internsDetails
        const { fullName, logoLink } = collegeDetails
        const data = { name, fullName, logoLink, interns }
        return res.status(200).send({ status: true, data: data })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {createCollege, getCollegeDetails}