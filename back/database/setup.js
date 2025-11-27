const { getConnection } = require('../config/database');

const createTables = async () => {
  try {
    const pool = await getConnection();
    
    console.log('🚀 Setting up database tables with separate categories...');

    // Drop existing view and tables first
    const dropExisting = `
      -- Drop view first
      IF OBJECT_ID('dbo.TaskStats', 'V') IS NOT NULL
      BEGIN
          DROP VIEW [dbo].[TaskStats];
          PRINT 'TaskStats view dropped';
      END

      -- Drop existing tables if they exist
      IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL
      BEGIN
          DROP TABLE [dbo].[Tasks];
          PRINT 'Tasks table dropped';
      END

      IF OBJECT_ID('dbo.CompletedTasks', 'U') IS NOT NULL
      BEGIN
          DROP TABLE [dbo].[CompletedTasks];
          PRINT 'CompletedTasks table dropped';
      END

      IF OBJECT_ID('dbo.ToDoTasks', 'U') IS NOT NULL
      BEGIN
          DROP TABLE [dbo].[ToDoTasks];
          PRINT 'ToDoTasks table dropped';
      END

      IF OBJECT_ID('dbo.InProgressTasks', 'U') IS NOT NULL
      BEGIN
          DROP TABLE [dbo].[InProgressTasks];
          PRINT 'InProgressTasks table dropped';
      END

      IF OBJECT_ID('dbo.WontDoTasks', 'U') IS NOT NULL
      BEGIN
          DROP TABLE [dbo].[WontDoTasks];
          PRINT 'WontDoTasks table dropped';
      END
    `;

    await pool.request().query(dropExisting);

    // Create ToDoTasks table
    const createToDoTasksTable = `
      CREATE TABLE [dbo].[ToDoTasks] (
          [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
          [Title] NVARCHAR(255) NOT NULL,
          [Description] NVARCHAR(MAX),
          [Priority] NVARCHAR(50) DEFAULT 'Medium',
          [Icon] NVARCHAR(10) DEFAULT '📚',
          [UserEmail] NVARCHAR(255) NOT NULL,
          [CreatedAt] DATETIME2 DEFAULT GETDATE(),
          [UpdatedAt] DATETIME2 DEFAULT GETDATE()
      );
      PRINT 'ToDoTasks table created successfully';
    `;

    // Create InProgressTasks table
    const createInProgressTasksTable = `
      CREATE TABLE [dbo].[InProgressTasks] (
          [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
          [Title] NVARCHAR(255) NOT NULL,
          [Description] NVARCHAR(MAX),
          [Priority] NVARCHAR(50) DEFAULT 'Medium',
          [Icon] NVARCHAR(10) DEFAULT '⏰',
          [UserEmail] NVARCHAR(255) NOT NULL,
          [CreatedAt] DATETIME2 DEFAULT GETDATE(),
          [UpdatedAt] DATETIME2 DEFAULT GETDATE(),
          [StartedAt] DATETIME2 DEFAULT GETDATE()
      );
      PRINT 'InProgressTasks table created successfully';
    `;

    // Create WontDoTasks table
    const createWontDoTasksTable = `
      CREATE TABLE [dbo].[WontDoTasks] (
          [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
          [Title] NVARCHAR(255) NOT NULL,
          [Description] NVARCHAR(MAX),
          [Priority] NVARCHAR(50) DEFAULT 'Medium',
          [Icon] NVARCHAR(10) DEFAULT '🍸',
          [UserEmail] NVARCHAR(255) NOT NULL,
          [CreatedAt] DATETIME2 DEFAULT GETDATE(),
          [UpdatedAt] DATETIME2 DEFAULT GETDATE(),
          [CancelledAt] DATETIME2 DEFAULT GETDATE(),
          [CancelReason] NVARCHAR(MAX)
      );
      PRINT 'WontDoTasks table created successfully';
    `;

    // Create CompletedTasks table
    const createCompletedTasksTable = `
      CREATE TABLE [dbo].[CompletedTasks] (
          [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
          [Title] NVARCHAR(255) NOT NULL,
          [Description] NVARCHAR(MAX),
          [Priority] NVARCHAR(50),
          [Icon] NVARCHAR(10) DEFAULT '🏋️‍♂️',
          [UserEmail] NVARCHAR(255) NOT NULL,
          [CreatedAt] DATETIME2,
          [CompletedAt] DATETIME2 DEFAULT GETDATE(),
          [TimeToComplete] AS ISNULL(DATEDIFF(hour, CreatedAt, CompletedAt), 0)
      );
      PRINT 'CompletedTasks table created successfully';
    `;

    await pool.request().query(createToDoTasksTable);
    await pool.request().query(createInProgressTasksTable);
    await pool.request().query(createWontDoTasksTable);
    await pool.request().query(createCompletedTasksTable);

    // Create indexes for all tables
    const createIndexes = `
      -- ToDoTasks indexes
      CREATE INDEX [IX_ToDoTasks_UserEmail] ON [dbo].[ToDoTasks] ([UserEmail]);
      
      -- InProgressTasks indexes
      CREATE INDEX [IX_InProgressTasks_UserEmail] ON [dbo].[InProgressTasks] ([UserEmail]);

      -- WontDoTasks indexes
      CREATE INDEX [IX_WontDoTasks_UserEmail] ON [dbo].[WontDoTasks] ([UserEmail]);

      -- CompletedTasks indexes
      CREATE INDEX [IX_CompletedTasks_UserEmail] ON [dbo].[CompletedTasks] ([UserEmail]);
    `;

    await pool.request().query(createIndexes);

    // Create comprehensive view for statistics
    const createView = `
      CREATE VIEW [dbo].[TaskStats] AS
      SELECT 
          u.FullName as UserName,
          u.Email as UserEmail,
          (SELECT ISNULL(COUNT(TaskID), 0) FROM ToDoTasks WHERE UserEmail = u.Email) as ToDoTasks,
          (SELECT ISNULL(COUNT(TaskID), 0) FROM InProgressTasks WHERE UserEmail = u.Email) as InProgressTasks,
          (SELECT ISNULL(COUNT(TaskID), 0) FROM WontDoTasks WHERE UserEmail = u.Email) as WontDoTasks,
          (SELECT ISNULL(COUNT(TaskID), 0) FROM CompletedTasks WHERE UserEmail = u.Email) as CompletedTasks,
          (
              (SELECT ISNULL(COUNT(TaskID), 0) FROM ToDoTasks WHERE UserEmail = u.Email) +
              (SELECT ISNULL(COUNT(TaskID), 0) FROM InProgressTasks WHERE UserEmail = u.Email) +
              (SELECT ISNULL(COUNT(TaskID), 0) FROM WontDoTasks WHERE UserEmail = u.Email) +
              (SELECT ISNULL(COUNT(TaskID), 0) FROM CompletedTasks WHERE UserEmail = u.Email)
          ) as TotalTasks,
          (SELECT ISNULL(AVG(CAST(TimeToComplete AS FLOAT)), 0) FROM CompletedTasks WHERE UserEmail = u.Email) as AvgCompletionTimeHours
      FROM [dbo].[Register_Tab] u;
    `;

    await pool.request().query(createView);

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables: ToDoTasks, InProgressTasks, WontDoTasks, CompletedTasks, Register_Tab');
    console.log('📈 Views: TaskStats');

    // Add sample data if tables are empty
    const checkTasks = await pool.request().query('SELECT COUNT(*) as count FROM ToDoTasks');
    if (checkTasks.recordset[0].count === 0) {
      // Get first user email for sample data
      const users = await pool.request().query('SELECT TOP 1 Email FROM Register_Tab');
      if (users.recordset.length > 0) {
        const userEmail = users.recordset[0].Email;
        
        const insertSamples = `
          INSERT INTO [dbo].[ToDoTasks] ([Title], [Description], [Priority], [Icon], [UserEmail])
          VALUES ('Task To Do', 'Work on a Challenge on devChallenges.io, learn TypeScript.', 'Medium', '📚', '${userEmail}');
          
          INSERT INTO [dbo].[InProgressTasks] ([Title], [Description], [Priority], [Icon], [UserEmail])
          VALUES ('Task in Progress', 'Working on important project features', 'High', '⏰', '${userEmail}');
          
          INSERT INTO [dbo].[WontDoTasks] ([Title], [Description], [Priority], [Icon], [UserEmail], [CancelReason])
          VALUES ('Task Won''t Do', 'Decided not to proceed with this feature', 'Low', '🍸', '${userEmail}', 'Feature not aligned with current goals');
          
          INSERT INTO [dbo].[CompletedTasks] ([Title], [Description], [Priority], [Icon], [UserEmail], [CreatedAt])
          VALUES ('Task Completed', 'Successfully finished the previous milestone', 'Medium', '🏋️‍♂️', '${userEmail}', DATEADD(day, -2, GETDATE()));
        `;
        
        await pool.request().query(insertSamples);
        console.log('✅ Sample tasks added to all categories');
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