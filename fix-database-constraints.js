const { sequelize } = require('./backend/src/models');
require('dotenv').config();

async function fixDatabaseConstraints() {
  try {
    console.log('🔧 Fixing database constraints...');
    
    // Use existing sequelize connection
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Check if constraint exists before trying to remove it
    const [constraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'programmcqplatform878'}' 
      AND TABLE_NAME = 'sections' 
      AND CONSTRAINT_NAME = 'sections_ibfk_1'
    `);
    
    if (constraints.length > 0) {
      console.log('🔍 Found problematic constraint, removing...');
      await sequelize.query('ALTER TABLE sections DROP FOREIGN KEY sections_ibfk_1');
      console.log('✅ Removed problematic constraint');
    } else {
      console.log('✅ No problematic constraint found');
    }
    
    // Check and fix other common constraint issues
    const tables = ['sections', 'mcqs', 'questions', 'answers'];
    
    for (const table of tables) {
      try {
        const [tableExists] = await sequelize.query(`
          SELECT COUNT(*) as count 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'programmcqplatform878'}' 
          AND TABLE_NAME = '${table}'
        `);
        
        if (tableExists[0].count > 0) {
          console.log(`✅ Table ${table} exists`);
        } else {
          console.log(`⚠️ Table ${table} does not exist`);
        }
      } catch (error) {
        console.log(`⚠️ Issue checking table ${table}:`, error.message);
      }
    }
    
    console.log('🎉 Database constraint fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing database constraints:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the fix
fixDatabaseConstraints()
  .then(() => {
    console.log('✅ Database constraints fixed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to fix database constraints:', error);
    process.exit(1);
  });