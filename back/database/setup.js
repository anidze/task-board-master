const { getConnection } = require('../config/database');

const createTables = async () => {
  try {
    const pool = await getConnection();
    
    console.log('🚀 Setting up database tables...');

    // Create Tasks table without foreign key constraint for now
    const createTasksTable = `
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
      BEGIN
          CREATE TABLE [dbo].[Tasks] (
              [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
              [Title] NVARCHAR(255) NOT NULL,
              [Description] NVARCHAR(MAX),
              [Status] NVARCHAR(50) NOT NULL DEFAULT 'To Do',
              [Priority] NVARCHAR(50) DEFAULT 'Medium',
              [Icon] NVARCHAR(10) DEFAULT '📚',
              [UserEmail] NVARCHAR(255) NOT NULL,
              [CreatedAt] DATETIME2 DEFAULT GETDATE(),
              [UpdatedAt] DATETIME2 DEFAULT GETDATE()
          );
          PRINT 'Tasks table created successfully';
      END
    `;

    await pool.request().query(createTasksTable);

    // Create indexes
    const createIndexes = `
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_UserEmail')
      BEGIN
          CREATE INDEX [IX_Tasks_UserEmail] ON [dbo].[Tasks] ([UserEmail]);
      END
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_Status')
      BEGIN
          CREATE INDEX [IX_Tasks_Status] ON [dbo].[Tasks] ([Status]);
      END
    `;

    await pool.request().query(createIndexes);

    // Create view for statistics
    const createView = `
      CREATE OR ALTER VIEW [dbo].[TaskStats] AS
      SELECT 
          u.FullName as UserName,
          u.Email as UserEmail,
          ISNULL(COUNT(t.TaskID), 0) as TotalTasks,
          ISNULL(SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END), 0) as CompletedTasks,
          ISNULL(SUM(CASE WHEN t.Status = 'In Progress' THEN 1 ELSE 0 END), 0) as InProgressTasks,
          ISNULL(SUM(CASE WHEN t.Status = 'To Do' THEN 1 ELSE 0 END), 0) as ToDoTasks,
          ISNULL(SUM(CASE WHEN t.Status = 'Won''t do' THEN 1 ELSE 0 END), 0) as WontDoTasks
      FROM [dbo].[Register_Tab] u
      LEFT JOIN [dbo].[Tasks] t ON u.Email = t.UserEmail
      GROUP BY u.Email, u.FullName;
    `;

    await pool.request().query(createView);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables: Tasks, Register_Tab');
    console.log('📈 Views: TaskStats');

    // Add some sample data if tasks table is empty
    const checkTasks = await pool.request().query('SELECT COUNT(*) as count FROM Tasks');
    if (checkTasks.recordset[0].count === 0) {
      // Get first user email for sample data
      const users = await pool.request().query('SELECT TOP 1 Email FROM Register_Tab');
      if (users.recordset.length > 0) {
        const userEmail = users.recordset[0].Email;
        
        const insertSample = `
          INSERT INTO [dbo].[Tasks] ([Title], [Description], [Status], [Priority], [Icon], [UserEmail])
          VALUES 
              ('Task in Progress', 'Working on important project features', 'In Progress', 'High', '⏰', '${userEmail}'),
              ('Task Completed', 'Successfully finished the previous milestone', 'Completed', 'Medium', '🏋️‍♂️', '${userEmail}'),
              ('Task Won''t Do', 'Decided not to proceed with this feature', 'Won''t do', 'Low', '🍸', '${userEmail}'),
              ('Task To Do', 'Work on a Challenge on devChallenges.io, learn TypeScript.', 'To Do', 'Medium', '📚', '${userEmail}');
        `;
        
        await pool.request().query(insertSample);
        console.log('✅ Sample tasks added');
      }
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  }
};

// Run setup if called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };