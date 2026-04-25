import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from "cors";

let app = express()

app.use(cors());

let __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

let userSchema = mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    farmSize: String,
    zone: String,
    role: String,
    password: String   
})
let User = mongoose.model("users", userSchema)

mongoose.connect("mongodb+srv://Sanskriti:Shona2005@cluster0.pnshuyn.mongodb.net/agricultureDB")
.then(() => console.log("Database connected"))
.catch(err => console.log(err))

app.post("/register", async (req, res) => {

    console.log("REGISTER DATA:", req.body)   

    let data = req.body

    if (!data.password || data.password.length !== 5) {
        return res.send("Password must be exactly 5 characters")
    }
    
    if (data.name && data.name.toLowerCase().trim() === "admin" && data.phone === "9999999999") {

        data.role = "admin"
        data.farmSize = ""
        data.zone = ""
        data.address = ""

    } else {
        if (!data.phone || !data.address || !data.farmSize || !data.zone) {
            return res.send("All farmer fields are required")
        }

        data.role = "farmer"
    }

    let existingUser = await User.findOne({ phone: data.phone })

    if (existingUser) {
        return res.send("User already registered")
    }

    await User.create(data)

    res.send("User registered successfully")
})

app.post("/login", async (req, res) => {

    let { name, phone, password, passkey } = req.body

    if (name && name.toLowerCase().trim() === "admin") {

        let admin = await User.findOne({ phone: phone, role: "admin" })

        if (!admin) {
            return res.json({ message: "Admin not found" })
        }

        if (admin.password !== password) {
            return res.json({ message: "Incorrect password" })
        }

        if (!passkey) {
            return res.json({ message: "Passkey required" })
        }

        if (passkey !== "5463") {
            return res.json({ message: "Invalid passkey" })
        }

        return res.json({
            message: "Admin login successful",
            role: "admin",
            name: admin.name,
            phone: admin.phone
        })
    }

    let user = await User.findOne({ phone: phone })

    if (!user) {
        return res.json({ message: "User not found" })
    }

    if (user.password !== password) {
        return res.json({ message: "Incorrect password" })
    }

    return res.json({
        message: "Farmer login successful",
        role: "farmer",
        name: user.name,
        phone: user.phone
    })
})

// ------------------- POWER -------------------
let powerSchema = mongoose.Schema({
    zone: String,
    startTime: String,
    endTime: String
})
let Power = mongoose.model("power", powerSchema)


// ------------------- USAGE -------------------
let usageSchema = mongoose.Schema({
    phone: String,
    units: Number,
    date: String
})
let Usage = mongoose.model("usage", usageSchema)


// ------------------- VOLTAGE -------------------
let voltageSchema = mongoose.Schema({
    zone: String,
    voltage: Number,
    date: String
})
let Voltage = mongoose.model("voltage", voltageSchema)


// ------------------- COMPLAINT -------------------
let complaintSchema = mongoose.Schema({
    phone: String,
    message: String,
    reply: String  
})
let Complaint = mongoose.model("complaints", complaintSchema)

// ------------------- FARMER DASHBOARD -------------------
app.post("/farmerDashboard", async (req, res) => {

    let user = await User.findOne({ phone: req.body.phone })

    if (!user) {
        return res.send("User not found")
    }

    let power = await Power.findOne({ zone: user.zone })
    let usage = await Usage.find({ phone: user.phone })
    let voltage = await Voltage.find({ zone: user.zone })
    let complaints = await Complaint.find({ phone: user.phone })

    res.send({
        name: user.name,
        zone: user.zone,
        farmSize: user.farmSize,
        power: power ? power : "No schedule available",
        usage: usage.length ? usage : "No usage data",
        voltage: voltage.length ? voltage : "No voltage data",
        complaints: complaints
    })
})

// ------------------- GET USAGE -------------------
app.post("/getUsage", async (req, res) => {

    let result = await Usage.find({ phone: req.body.phone })

    res.send(result)
})


// ------------------- GET VOLTAGE -------------------
app.post("/getVoltage", async (req, res) => {

    let result = await Voltage.find({ zone: req.body.zone })

    res.send(result)
})

// ------------------- ADD COMPLAINT -------------------
app.post("/addComplaint", async (req, res) => {

    await Complaint.create(req.body)

    res.send("Complaint submitted")
})


////////////////////////////////////// ADMIN ////////////////////////////////////

// ------------------- SET POWER -------------------
app.post("/setPower", async (req, res) => {
    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    let { zone, startTime, endTime } = req.body

    // update if already exists
    let existing = await Power.findOne({ zone })

    if (existing) {
        await Power.updateOne({ zone }, { $set: { startTime, endTime } })
        return res.send("Power schedule updated")
    }

    await Power.create({ zone, startTime, endTime })

    res.send("Power schedule added")
})

// ------------------- ADD USAGE (ADMIN) -------------------
app.post("/addUsage", async (req, res) => {

    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    await Usage.create({
        phone: req.body.farmerPhone,
        units: req.body.units,
        date: req.body.date
    })

    res.send("Usage added")
})

// ------------------- ADD VOLTAGE (ADMIN) -------------------
app.post("/addVoltage", async (req, res) => {

    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    await Voltage.create(req.body)

    res.send("Voltage added")
})

// ------------------- GET ALL FARMERS -------------------
app.post("/getFarmers", async (req, res) => {
    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    let farmers = await User.find({ role: "farmer" })

    res.send(farmers)
})

// ------------------- GET FARMER USAGE -------------------
app.post("/getFarmerUsage", async (req, res) => {

    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    let { phone } = req.body

    let usage = await Usage.find({ phone })

    res.send(usage)
})

// ------------------- GET COMPLAINTS -------------------
app.post("/getComplaints", async (req, res) => {
    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    let complaints = await Complaint.find()

    res.send(complaints)
})

// ------------------- REPLY TO COMPLAINT -------------------
app.post("/replyComplaint", async (req, res) => {

    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    let { id, reply } = req.body

    await Complaint.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { reply: reply } }
    )

    res.send("Reply sent")
})

let announcementSchema = mongoose.Schema({
    message: String,
    date: String
})

let Announcement = mongoose.model("announcements", announcementSchema)

// ------------------- ADD ANNOUNCEMENT -------------------
app.post("/addAnnouncement", async (req, res) => {

    if (req.body.phone !== "9999999999") {
        return res.send("Only admin allowed")
    }

    await Announcement.create({
        message: req.body.message,
        date: new Date().toLocaleDateString()
    })

    res.send("Announcement added")
})

// ------------------- GET ANNOUNCEMENTS -------------------
app.get("/getAnnouncements", async (req, res) => {

    let data = await Announcement.find()

    res.send(data)
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
