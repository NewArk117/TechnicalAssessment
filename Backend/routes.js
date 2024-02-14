const express = require("express")
const router = express.Router()
const cors = require("cors")

router.use(cors())

//Importing Jobs Controller Method
// const UserController = require("./controllers/UserController")

// router.route("/PromoteTask2Done").post(TaskController.PromoteTask2Done)

const UploadController = require("./controllers/UploadController")
router.post("/sendData", UploadController.sendData)
router.get("/getData", UploadController.getData)
module.exports = router
