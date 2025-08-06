const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path if needed

dotenv.config();

const students = [
    { name: "Ashok", email: "arjun@example.com", password: "Arjun@123", role: "student" },
    { name: "meera", email: "meera@example.com", password: "Meera@123", role: "student" },
    { name: "rahul", email: "rahul@example.com", password: "Rahul@123", role: "student" },
    { name: "sneha", email: "sneha@example.com", password: "Sneha@123", role: "student" },
    { name: "vinay", email: "vinay@example.com", password: "Vinay@123", role: "student" },
    { name: "priya", email: "priya@example.com", password: "Priya@123", role: "student" },
    { name: "ankit", email: "ankit@example.com", password: "Ankit@123", role: "student" },
    { name: "deepa", email: "deepa@example.com", password: "Deepa@123", role: "student" },
    { name: "rohit", email: "rohit@example.com", password: "Rohit@123", role: "student" },
    { name: "tanya", email: "tanya@example.com", password: "Tanya@123", role: "student" },
    { name: "vishal", email: "vishal@example.com", password: "Vishal@123", role: "student" },
    { name: "isha", email: "isha@example.com", password: "Isha@123", role: "student" },
    { name: "sachin", email: "sachin@example.com", password: "Sachin@123", role: "student" },
    { name: "kavya", email: "kavya@example.com", password: "Kavya@123", role: "student" },
    { name: "harshit", email: "harshit@example.com", password: "Harshit@123", role: "student" },
    { name: "ananya", email: "ananya@example.com", password: "Ananya@123", role: "student" },
    { name: "manish", email: "manish@example.com", password: "Manish@123", role: "student" },
    { name: "riya", email: "riya@example.com", password: "Riya@123", role: "student" },
    { name: "abhishek", email: "abhishek@example.com", password: "Abhi@123", role: "student" },
    { name: "nikita", email: "nikita@example.com", password: "Nikita@123", role: "student" },
    { name: "siddharth", email: "siddharth@example.com", password: "Sidd@123", role: "student" },
    { name: "shreya", email: "shreya@example.com", password: "Shreya@123", role: "student" },
    { name: "ayush", email: "ayush@example.com", password: "Ayush@123", role: "student" },
    { name: "pooja", email: "pooja@example.com", password: "Pooja@123", role: "student" },
    { name: "naveen", email: "naveen@example.com", password: "Naveen@123", role: "student" },
    { name: "simran", email: "simran@example.com", password: "Simran@123", role: "student" },
    { name: "amit", email: "amit@example.com", password: "Amit@123", role: "student" },
    { name: "kanika", email: "kanika@example.com", password: "Kanika@123", role: "student" },
    { name: "yash", email: "yash@example.com", password: "Yash@123", role: "student" },
    { name: "diya", email: "diya@example.com", password: "Diya@123", role: "student" },
    { name: "gautam", email: "gautam@example.com", password: "Gautam@123", role: "student" },
    { name: "neha", email: "neha@example.com", password: "Neha@123", role: "student" },
    { name: "dev", email: "dev@example.com", password: "Dev@123", role: "student" },
    { name: "shruti", email: "shruti@example.com", password: "Shruti@123", role: "student" },
    { name: "ravi", email: "ravi@example.com", password: "Ravi@123", role: "student" },
    { name: "anusha", email: "anusha@example.com", password: "Anusha@123", role: "student" },
    { name: "suresh", email: "suresh@example.com", password: "Suresh@123", role: "student" },
    { name: "lavanya", email: "lavanya@example.com", password: "Lavanya@123", role: "student" },
    { name: "karthik", email: "karthik@example.com", password: "Karthik@123", role: "student" },
    { name: "nisha", email: "nisha@example.com", password: "Nisha@123", role: "student" },
    { name: "rahulraj", email: "rahulraj@example.com", password: "Rraj@123", role: "student" },
    { name: "aishwarya", email: "aishwarya@example.com", password: "Aishu@123", role: "student" },
    { name: "mukesh", email: "mukesh@example.com", password: "Mukesh@123", role: "student" },
    { name: "divya", email: "divya@example.com", password: "Divya@123", role: "student" },
    { name: "rajesh", email: "rajesh@example.com", password: "Rajesh@123", role: "student" },
    { name: "bhavana", email: "bhavana@example.com", password: "Bhavana@123", role: "student" },
    { name: "omkar", email: "omkar@example.com", password: "Omkar@123", role: "student" },
    { name: "rekha", email: "rekha@example.com", password: "Rekha@123", role: "student" },
    { name: "sagar", email: "sagar@example.com", password: "Sagar@123", role: "student" }
  ];


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedStudents = await Promise.all(
      students.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await User.deleteMany(); // Clears old entries (optional but helpful)
    await User.insertMany(hashedStudents);
    console.log("✅ All 50 student users inserted with hashed passwords!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error inserting users:", err);
    process.exit(1);
  });
