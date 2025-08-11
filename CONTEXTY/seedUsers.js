const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb+srv://contextypro:Mansoor4100@cluster0.5yw2ssd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createUsers = async () => {
  try {
    // --- Admin ---
    const admin = {
      name: 'Contexty Admin',
      email: 'admin@contexty.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    };

    // --- Faculties ---
    const faculties = [
      {
        name: 'Faculty One',
        email: 'faculty1@contexty.com',
        password: await bcrypt.hash('faculty123', 10),
        role: 'teacher'
      },
      {
        name: 'Faculty Two',
        email: 'faculty2@contexty.com',
        password: await bcrypt.hash('faculty123', 10),
        role: 'faculty'
      }
    ];

    // --- Students with batch assignment ---
    const studentNames = [
      "Ashok", "meera", "rahul", "sneha", "vinay", "priya", "ankit", "deepa", "rohit", "tanya",
      "vishal", "isha", "sachin", "kavya", "harshit", "ananya", "manish", "riya", "abhishek", "nikita",
      "siddharth", "shreya", "ayush", "pooja", "naveen", "simran", "amit", "kanika", "yash", "diya",
      "gautam", "neha", "dev", "shruti", "ravi", "anusha", "suresh", "lavanya", "karthik", "nisha",
      "rahulraj", "aishwarya", "mukesh", "divya", "rajesh", "bhavana", "omkar", "rekha", "sagar"
    ];

    const students = await Promise.all(studentNames.map(async (name, index) => {
      let batch;
      if (index < 17) batch = "Batch 1";
      else if (index < 34) batch = "Batch 2";
      else batch = "Batch 3";

      const email = `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const password = await bcrypt.hash(name.charAt(0).toUpperCase() + name.slice(1) + "@123", 10);

      return {
        name,
        email,
        password,
        role: 'student',
        batch
      };
    }));

    // Insert only if not already present
    const allUsers = [admin, ...faculties, ...students];
    for (const userData of allUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`✅ Inserted: ${userData.name} (${userData.role})`);
      } else {
        console.log(`⚠️ Skipped (exists): ${userData.email}`);
      }
    }

    console.log('🎯 Seeding completed!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    mongoose.disconnect();
  }
};

createUsers();
