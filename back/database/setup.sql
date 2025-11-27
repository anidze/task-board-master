-- Task Board Database Schema
-- Run this script in SQL Server Management Studio or sqlcmd

USE [task_board];
GO

-- Create Tasks table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE [dbo].[Tasks] (
        [TaskID] INT IDENTITY(1,1) PRIMARY KEY,
        [Title] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX),
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'To Do',
        [Priority] NVARCHAR(50) DEFAULT 'Medium',
        [Icon] NVARCHAR(10) DEFAULT '📚',
        [UserID] INT NOT NULL,
        [CreatedAt] DATETIME2 DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 DEFAULT GETDATE(),
        
        -- Foreign key to Users table
        CONSTRAINT [FK_Tasks_Users] FOREIGN KEY ([UserID]) 
        REFERENCES [dbo].[Register_Tab]([ID])
    );
    
    PRINT '✅ Tasks table created successfully';
END
ELSE
BEGIN
    PRINT '⚠️ Tasks table already exists';
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_UserID')
BEGIN
    CREATE INDEX [IX_Tasks_UserID] ON [dbo].[Tasks] ([UserID]);
    PRINT '✅ Index IX_Tasks_UserID created';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_Status')
BEGIN
    CREATE INDEX [IX_Tasks_Status] ON [dbo].[Tasks] ([Status]);
    PRINT '✅ Index IX_Tasks_Status created';
END
GO

-- Add some sample tasks (optional)
IF NOT EXISTS (SELECT * FROM [dbo].[Tasks])
BEGIN
    -- Get the first user ID for sample data
    DECLARE @UserID INT = (SELECT TOP 1 ID FROM [dbo].[Register_Tab]);
    
    IF @UserID IS NOT NULL
    BEGIN
        INSERT INTO [dbo].[Tasks] ([Title], [Description], [Status], [Priority], [Icon], [UserID])
        VALUES 
            ('Task in Progress', 'Working on important project features', 'In Progress', 'High', '⏰', @UserID),
            ('Task Completed', 'Successfully finished the previous milestone', 'Completed', 'Medium', '🏋️‍♂️', @UserID),
            ('Task Won''t Do', 'Decided not to proceed with this feature', 'Won''t do', 'Low', '🍸', @UserID),
            ('Task To Do', 'Work on a Challenge on devChallenges.io, learn TypeScript.', 'To Do', 'Medium', '📚', @UserID);
            
        PRINT '✅ Sample tasks inserted';
    END
    ELSE
    BEGIN
        PRINT '⚠️ No users found - please register a user first to add sample tasks';
    END
END
GO

-- Create a view for task statistics
CREATE OR ALTER VIEW [dbo].[TaskStats] AS
SELECT 
    u.FullName as UserName,
    u.ID as UserID,
    COUNT(*) as TotalTasks,
    SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) as CompletedTasks,
    SUM(CASE WHEN t.Status = 'In Progress' THEN 1 ELSE 0 END) as InProgressTasks,
    SUM(CASE WHEN t.Status = 'To Do' THEN 1 ELSE 0 END) as ToDoTasks,
    SUM(CASE WHEN t.Status = 'Won''t do' THEN 1 ELSE 0 END) as WontDoTasks
FROM [dbo].[Register_Tab] u
LEFT JOIN [dbo].[Tasks] t ON u.ID = t.UserID
GROUP BY u.ID, u.FullName;
GO

PRINT '✅ TaskStats view created';
PRINT '🎉 Database schema setup complete!';
PRINT '';
PRINT 'Tables created:';
PRINT '- Tasks (for storing task data)';
PRINT '- Register_Tab (already exists for users)';
PRINT '';
PRINT 'Views created:';
PRINT '- TaskStats (for dashboard statistics)';