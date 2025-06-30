const pool = require('./config/database');

async function runMigration() {
  try {
    console.log('Running migration: Adding preferences column to users table...');
    
    // Check if preferences column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'preferences'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ preferences column already exists in users table');
      return;
    }
    
    // Add preferences column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN preferences JSONB DEFAULT '{"notifications_enabled": true, "language": "English", "voice_enabled": false, "auto_location": true, "dark_mode": false}'
    `);
    
    console.log('✅ Successfully added preferences column to users table');
    
    // Update existing users with default preferences
    await pool.query(`
      UPDATE users 
      SET preferences = '{"notifications_enabled": true, "language": "English", "voice_enabled": false, "auto_location": true, "dark_mode": false}' 
      WHERE preferences IS NULL
    `);
    
    console.log('✅ Updated existing users with default preferences');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }); 