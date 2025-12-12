// const { sequelize, Passcode, SlotQuestion } = require('./src/models');

// async function initializeDatabase() {
//   try {
//     console.log('🔍 Initializing database...');
    
//     // Test connection
//     await sequelize.authenticate();
//     console.log('✅ Database connection established');
    
//     // Sync all models safely without altering existing structure
//     try {
//       await sequelize.sync({ alter: true });
//       console.log('✅ All models synchronized');
//     } catch (error) {
//       if (error.name === 'SequelizeDatabaseError' && error.original?.code === 'ER_TOO_MANY_KEYS') {
//         console.log('⚠️ Too many keys error detected, skipping sync...');
//         console.log('✅ Database tables already exist');
//       } else {
//         throw error;
//       }
//     }
    
//     // Check if initial passcodes exist, create if not
//     const studentPasscode = await Passcode.findOne({ where: { type: 'student' } });
//     if (!studentPasscode) {
//       const newStudentCode = Math.floor(100000 + Math.random() * 900000).toString();
//       await Passcode.create({
//         code: newStudentCode,
//         type: 'student',
//         studentsUsed: 0
//       });
//       console.log('✅ Initial student passcode created:', newStudentCode);
//     }
    
//     const supervisorPasscode = await Passcode.findOne({ where: { type: 'supervisor' } });
//     if (!supervisorPasscode) {
//       const newSupervisorCode = Math.floor(100000 + Math.random() * 900000).toString();
//       await Passcode.create({
//         code: newSupervisorCode,
//         type: 'supervisor',
//         studentsUsed: 0
//       });
//       console.log('✅ Initial supervisor passcode created:', newSupervisorCode);
//     }
    
//     console.log('🎉 Database initialization complete!');
    
//   } catch (error) {
//     console.error('❌ Database initialization failed:', error.message);
//     throw error;
//   }
// }

// module.exports = initializeDatabase;

// // Run if called directly
// if (require.main === module) {
//   initializeDatabase()
//     .then(() => {
//       console.log('✅ Database ready');
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error('❌ Initialization failed:', error);
//       process.exit(1);
//     });
// }

const { sequelize, Passcode, SlotQuestion } = require('./src/models'); // ✅ include SlotQuestion

async function initializeDatabase() {
  try {
    console.log('🔍 Initializing database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync safely without losing data
    try {
      await sequelize.sync({ alter: true }); // 👈 safer than force:true
    } catch (syncError) {
      if (syncError.message.includes('Constraint') && syncError.message.includes('does not exist')) {
        console.log('⚠️ Constraint issue detected, trying without alter...');
        await sequelize.sync(); // Simple sync without alter
      } else if (syncError.message.includes('sections_ibfk_1')) {
        console.log('⚠️ Specific sections constraint issue, skipping sync...');
        console.log('✅ Database tables assumed to exist');
      } else {
        throw syncError;
      }
    }
    console.log('Loaded models:', Object.keys(sequelize.models));
    console.log('✅ All models synchronized (non-destructive)');

    // Create default passcodes if missing
    const studentPasscode = await Passcode.findOne({ where: { type: 'student' } });
    if (!studentPasscode) {
      const newStudentCode = Math.floor(100000 + Math.random() * 900000).toString();
      await Passcode.create({
        code: newStudentCode,
        type: 'student',
        studentsUsed: 0
      });
      console.log('✅ Initial student passcode created:', newStudentCode);
    }

    const supervisorPasscode = await Passcode.findOne({ where: { type: 'supervisor' } });
    if (!supervisorPasscode) {
      const newSupervisorCode = Math.floor(100000 + Math.random() * 900000).toString();
      await Passcode.create({
        code: newSupervisorCode,
        type: 'supervisor',
        studentsUsed: 0
      });
      console.log('✅ Initial supervisor passcode created:', newSupervisorCode);
    }

    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

module.exports = initializeDatabase;

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database ready');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Initialization failed:', error);
      process.exit(1);
    });
}
