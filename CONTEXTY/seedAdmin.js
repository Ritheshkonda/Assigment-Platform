const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(
  'mongodb+srv://contextypro:Mansoor4100@cluster0.5yw2ssd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = new User({
        name: 'Contexty Admin',
        email: 'admin@contexty.com',
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log('✅ Admin user added to users collection!');
    }
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
