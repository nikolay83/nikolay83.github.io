/***************************************************************************
 * Architect: LOY
 * Assembler: NightWolf, veshu, TCSASSEMBLER
 * Version: 1.2
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 *
 * Description:
 *     This file contains DDL for all required tables used by backend assembly.
 * Changes in 1.1:
 *		- changed ProcessRiskAssessment.ProcessRisk_Id to nullable
 *		- changed ProcessControlAssessment.LikelihoodOfOccurrence_Id to nullable
 *		- changed ProcessControlAssessment.RiskExposure_Id to nullable
 *		- changed ControlObjective, Tested,[ControlType_Id],[ControlFrequency_Id],[KeyControlsMaturity_Id] of ControlAssessment to nullable
 * Changes in 1.2
 *		- changed Assessment.Title to not nullable
 *		- Added 'OtherTestingFrequency' and 'OtherKeyControlMaturity' in controlAssessment table
 ***************************************************************************/
--------------- Drop Tables, if exist ---------------
IF OBJECT_ID('[dbo].[ActionPermission]', 'U') IS NOT NULL DROP TABLE [ActionPermission]
IF OBJECT_ID('[dbo].[AuditRecord]', 'U') IS NOT NULL DROP TABLE [AuditRecord]
IF OBJECT_ID('[dbo].[ControlAssessment_ControlDesign]', 'U') IS NOT NULL DROP TABLE [ControlAssessment_ControlDesign]
IF OBJECT_ID('[dbo].[ControlAssessment_ControlTrigger]', 'U') IS NOT NULL DROP TABLE [ControlAssessment_ControlTrigger]
IF OBJECT_ID('[dbo].[ControlAssessment_TestingFrequency]', 'U') IS NOT NULL DROP TABLE [ControlAssessment_TestingFrequency]
IF OBJECT_ID('[dbo].[ControlAssessment]', 'U') IS NOT NULL DROP TABLE [ControlAssessment]
IF OBJECT_ID('[dbo].[ControlDesign]', 'U') IS NOT NULL DROP TABLE [ControlDesign]
IF OBJECT_ID('[dbo].[ControlFrequency]', 'U') IS NOT NULL DROP TABLE [ControlFrequency]
IF OBJECT_ID('[dbo].[ControlTrigger]', 'U') IS NOT NULL DROP TABLE [ControlTrigger]
IF OBJECT_ID('[dbo].[CoreProcess_ControlType]', 'U') IS NOT NULL DROP TABLE [CoreProcess_ControlType]
IF OBJECT_ID('[dbo].[ProcessRisk_ControlType]', 'U') IS NOT NULL DROP TABLE [ProcessRisk_ControlType]
IF OBJECT_ID('[dbo].[ControlType]', 'U') IS NOT NULL DROP TABLE [ControlType]
IF OBJECT_ID('[dbo].[FunctionPerformedSite]', 'U') IS NOT NULL DROP TABLE [FunctionPerformedSite]
IF OBJECT_ID('[dbo].[FutureFunctionChanges]', 'U') IS NOT NULL DROP TABLE [FutureFunctionChanges]
IF OBJECT_ID('[dbo].[KeyControlsMaturity]', 'U') IS NOT NULL DROP TABLE [KeyControlsMaturity]
IF OBJECT_ID('[dbo].[KPISLAAssessment]', 'U') IS NOT NULL DROP TABLE [KPISLAAssessment]
IF OBJECT_ID('[dbo].[Percentage]', 'U') IS NOT NULL DROP TABLE [Percentage]
IF OBJECT_ID('[dbo].[PriorFunctionChanges]', 'U') IS NOT NULL DROP TABLE [PriorFunctionChanges]
IF OBJECT_ID('[dbo].[FunctionChange]', 'U') IS NOT NULL DROP TABLE [FunctionChange]
IF OBJECT_ID('[dbo].[ChangeType]', 'U') IS NOT NULL DROP TABLE [ChangeType]
IF OBJECT_ID('[dbo].[ProcessControlAssessment_RiskImpact]', 'U') IS NOT NULL DROP TABLE [ProcessControlAssessment_RiskImpact]
IF OBJECT_ID('[dbo].[ProcessRiskAssessment]', 'U') IS NOT NULL DROP TABLE [ProcessRiskAssessment]
IF OBJECT_ID('[dbo].[FunctionalAreaProcessAssessment]', 'U') IS NOT NULL DROP TABLE [FunctionalAreaProcessAssessment]
IF OBJECT_ID('[dbo].[Assessment]', 'U') IS NOT NULL DROP TABLE [Assessment]
IF OBJECT_ID('[dbo].[AssessmentStatus]', 'U') IS NOT NULL DROP TABLE [AssessmentStatus]
IF OBJECT_ID('[dbo].[AssessmentType]', 'U') IS NOT NULL DROP TABLE [AssessmentType]
IF OBJECT_ID('[dbo].[Department]', 'U') IS NOT NULL DROP TABLE [Department]
IF OBJECT_ID('[dbo].[DepartmentHead]', 'U') IS NOT NULL DROP TABLE [DepartmentHead]
IF OBJECT_ID('[dbo].[FunctionalAreaOwner]', 'U') IS NOT NULL DROP TABLE [FunctionalAreaOwner]
IF OBJECT_ID('[dbo].[ProcessControlAssessment]', 'U') IS NOT NULL DROP TABLE [ProcessControlAssessment]
IF OBJECT_ID('[dbo].[LikelihoodOfOccurrence]', 'U') IS NOT NULL DROP TABLE [LikelihoodOfOccurrence]
IF OBJECT_ID('[dbo].[SubProcessRisk]', 'U') IS NOT NULL DROP TABLE [SubProcessRisk]
IF OBJECT_ID('[dbo].[CoreProcess]', 'U') IS NOT NULL DROP TABLE [CoreProcess]
IF OBJECT_ID('[dbo].[ProcessRisk]', 'U') IS NOT NULL DROP TABLE [ProcessRisk]
IF OBJECT_ID('[dbo].[Category]', 'U') IS NOT NULL DROP TABLE [Category]
IF OBJECT_ID('[dbo].[Product]', 'U') IS NOT NULL DROP TABLE [Product]
IF OBJECT_ID('[dbo].[RiskExposure]', 'U') IS NOT NULL DROP TABLE [RiskExposure]
IF OBJECT_ID('[dbo].[RiskImpact]', 'U') IS NOT NULL DROP TABLE [RiskImpact]
IF OBJECT_ID('[dbo].[Site]', 'U') IS NOT NULL DROP TABLE [Site]
IF OBJECT_ID('[dbo].[SLA]', 'U') IS NOT NULL DROP TABLE [SLA]
IF OBJECT_ID('[dbo].[KPI]', 'U') IS NOT NULL DROP TABLE [KPI]
IF OBJECT_ID('[dbo].[KPICategory]', 'U') IS NOT NULL DROP TABLE [KPICategory]
IF OBJECT_ID('[dbo].[TestingFrequency]', 'U') IS NOT NULL DROP TABLE [TestingFrequency]
IF OBJECT_ID('[dbo].[FunctionalArea]', 'U') IS NOT NULL DROP TABLE [FunctionalArea]
IF OBJECT_ID('[dbo].[BusinessUnit]', 'U') IS NOT NULL DROP TABLE [BusinessUnit]
IF OBJECT_ID('[dbo].[Token]', 'U') IS NOT NULL DROP TABLE [Token]
--------------- Create Tables ---------------
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActionPermission](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Role] [int] NOT NULL,
	[Action] [varchar](200) NOT NULL,
 CONSTRAINT [PK_ActionPermission] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Assessment](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[FunctionalAreaDescription] [varchar](4000) NULL,
	[AssessmentDueDate] [datetime] NULL,
	[OverallRiskRatingCommentary] [varchar](4000) NULL,
	[ApprovalStatus] [int] NOT NULL,
	[BUFunctionalApproverUsername] [varchar](200) NULL,
	[BUFunctionalApproveTime] [datetime] NULL,
	[BURiskManagementApproverUsername] [varchar](200) NULL,
	[BURiskManagementApproveTime] [datetime] NULL,
	[DivisionalRiskManagementApproverUsername] [varchar](200) NULL,
	[DivisionalRiskManagementApproveTime] [datetime] NULL,
	[RejecterUsername] [varchar](200) NULL,
	[RejectTime] [datetime] NULL,
	[RejectionReason] [varchar](4000) NULL,
	[RejectPhase] [int] NULL,
	[SubmitterUsername] [varchar](200) NULL,
	[SubmitTime] [datetime] NULL,
	[Title] [varchar](200) NOT NULL,
	[CreatedBy] [varchar](200) NOT NULL,
	[CreatedTime] [datetime] NOT NULL,
	[LastUpdatedBy] [varchar](200) NOT NULL,
	[LastUpdatedTime] [datetime] NOT NULL,
	[BusinessUnit_Id] [bigint] NULL,
	[DepartmentHead_Id] [bigint] NULL,
	[Product_Id] [bigint] NULL,
	[Department_Id] [bigint] NULL,
	[FunctionalAreaOwner_Id] [bigint] NULL,
	[FunctionalArea_Id] [bigint] NULL,
	[AssessmentType_Id] [bigint] NULL,
	[AssessmentStatus_Id] [bigint] NULL,
 CONSTRAINT [PK_Assessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AssessmentStatus](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_AssessmentStatus] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AssessmentType](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_AssessmentType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditRecord](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](200) NOT NULL,
	[Action] [varchar](200) NOT NULL,
	[ItemType] [varchar](200) NOT NULL,
	[ItemId] [bigint] NOT NULL,
	[Field] [varchar](200) NOT NULL,
	[PreviousValue] [varchar](max) NULL,
	[NewValue] [varchar](max) NULL,
	[Timestamp] [datetime] NOT NULL,
 CONSTRAINT [PK_AuditReocrd] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BusinessUnit](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_BusinessUnit] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ChangeType](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_ChangeType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlAssessment](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[OtherControlType] [varchar](200) NULL,
	[ControlObjective] [varchar](200) NULL,
	[ControlType_Id] [bigint] NULL,
	[ControlFrequency_Id] [bigint] NULL,
	[KeyControlsMaturity_Id] [bigint] NULL,
	[OtherTestingFrequency] [VARCHAR](4000) NULL,
	[OtherKeyControlMaturity] [VARCHAR](4000) NULL,
	[ProcessControlAssessment_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_ControlAssessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlAssessment_ControlDesign](
	[ControlAssessmentId] [bigint] NOT NULL,
	[ControlDesignId] [bigint] NOT NULL,
 CONSTRAINT [PK_ControlAssessment_ControlDesign] PRIMARY KEY CLUSTERED 
(
	[ControlAssessmentId] ASC,
	[ControlDesignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlAssessment_ControlTrigger](
	[ControlAssessmentId] [bigint] NOT NULL,
	[ControlTriggerId] [bigint] NOT NULL,
 CONSTRAINT [PK_ControlAssessment_ControlTrigger] PRIMARY KEY CLUSTERED 
(
	[ControlAssessmentId] ASC,
	[ControlTriggerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlAssessment_TestingFrequency](
	[ControlAssessmentId] [bigint] NOT NULL,
	[TestingFrequencyId] [bigint] NOT NULL,
 CONSTRAINT [PK_ControlAssessment_TestingFrequency] PRIMARY KEY CLUSTERED 
(
	[ControlAssessmentId] ASC,
	[TestingFrequencyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlDesign](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_ControlDesign] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlFrequency](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_ControlFrequency] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlTrigger](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_ControlTrigger] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ControlType](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL
 CONSTRAINT [PK_ControlType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[BusinessUnitId] [bigint] NOT NULL,
 CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DepartmentHead](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[BusinessUnitId] [bigint] NOT NULL,
 CONSTRAINT [PK_DepartmentHead] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionalArea](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[BusinessUnitId] [bigint] NOT NULL,
 CONSTRAINT [PK_FunctionalArea] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionalAreaOwner](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[BusinessUnitId] [bigint] NOT NULL,
 CONSTRAINT [PK_FunctionalAreaOwner] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionChange](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ChangeTime] [datetime] NOT NULL,
	[ChangeDescription] [varchar](4000) NOT NULL,
	[ChangeType_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_FunctionChange] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionPerformedSite](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Site_Id] [bigint] NOT NULL,
	[Percentage_Id] [bigint] NOT NULL,
	[Assessment_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_FunctionPerformedSite] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FutureFunctionChanges](
	[AssessmentId] [bigint] NOT NULL,
	[FunctionChangeId] [bigint] NOT NULL,
 CONSTRAINT [PK_FutureFunctionChanges] PRIMARY KEY CLUSTERED 
(
	[AssessmentId] ASC,
	[FunctionChangeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KeyControlsMaturity](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_KeyControlsMaturity] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KPICategory](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](1000) NOT NULL,
 CONSTRAINT [PK_KPICategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[KPI](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](1000) NOT NULL,
	[KPICategory_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_KPI] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KPISLAAssessment](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[AdditionalKPICategory] [varchar](200) NULL,
	[AdditionalKPI] [varchar](200) NULL,
	[AdditionalSLA] [varchar](500) NULL,
	[KPI_Id] [bigint] NULL,
	[SelectedSLA_Id] [bigint] NULL,
	[KPICategory_Id] [bigint] NULL,
	[Category_Id] [bigint] NULL,
	[Assessment_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_KPISLAAssessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LikelihoodOfOccurrence](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_LikelihoodOfOccurrence] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Percentage](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[Value] [float] NOT NULL,
 CONSTRAINT [PK_Percentage] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PriorFunctionChanges](
	[AssessmentId] [bigint] NOT NULL,
	[FunctionChangeId] [bigint] NOT NULL,
 CONSTRAINT [PK_PriorFunctionChanges] PRIMARY KEY CLUSTERED 
(
	[AssessmentId] ASC,
	[FunctionChangeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProcessControlAssessment](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[LikelihoodOfOccurrence_Id] [bigint] NULL,
	[OtherLikelihoodOfOccurrence] [varchar](4000) NULL,
	[RiskExposure_Id] [bigint] NULL,
	[Category_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_ProcessControlAssessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProcessControlAssessment_RiskImpact](
	[ProcessControlAssessmentId] [bigint] NOT NULL,
	[RiskImpactId] [bigint] NOT NULL,
 CONSTRAINT [PK_ProcessControlAssessment_RiskImpact] PRIMARY KEY CLUSTERED 
(
	[ProcessControlAssessmentId] ASC,
	[RiskImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProcessRisk](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[Risk] [varchar](200) NOT NULL,
	[Category_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_ProcessRisk] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CoreProcess](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](2000) NOT NULL,
	[FunctionalAreaId] [bigint] NOT NULL,
	[Category_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_CoreProcess] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubProcessRisk](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](2000) NOT NULL,
	[Risk] [varchar](2000) NOT NULL,
	[CoreProcess_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_SubProcessRisk] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CoreProcess_ControlType](
	[CoreProcessId] [bigint] NOT NULL,
	[ControlTypeId] [bigint] NOT NULL,
 CONSTRAINT [PK_CoreProcess_ControlType] PRIMARY KEY CLUSTERED 
(
	[CoreProcessId] ASC,
	[ControlTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProcessRisk_ControlType](
	[ProcessRiskId] [bigint] NOT NULL,
	[ControlTypeId] [bigint] NOT NULL,
 CONSTRAINT [PK_ProcessRisk_ControlType] PRIMARY KEY CLUSTERED 
(
	[ProcessRiskId] ASC,
	[ControlTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProcessRiskAssessment](
	[Id] [bigint] NOT NULL,
	[AdditionalProcess] [varchar](200) NULL,
	[AdditionalRisk] [varchar](200) NULL,
	[ProcessRisk_Id] [bigint] NULL,
	[Assessment_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_ProcessRiskAssessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionalAreaProcessAssessment](
	[Id] [bigint] NOT NULL,
	[AdditionalCoreProcess] varchar (200) NULL,
	[AdditionalSubProcess] [varchar](200) NULL,
	[AdditionalRisk] [varchar](200) NULL,
	[SubProcessRisk_Id] [bigint] NULL,
	[CoreProcess_Id] [bigint] NULL,
	[Assessment_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_FunctionalAreaProcessAssessment] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]


GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[BusinessUnitId] [bigint] NOT NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RiskExposure](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_RiskExposure] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RiskImpact](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_RiskImpact] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Site](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Site] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SLA](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
	[KPICategory_Id] [bigint] NOT NULL,
 CONSTRAINT [PK_SLA] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TestingFrequency](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](200) NOT NULL,
 CONSTRAINT [PK_TestingFrequency] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Token](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](200) NOT NULL,
	[TokenValue] [varchar](256) NOT NULL,
	[ExpirationDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Token] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
CREATE NONCLUSTERED INDEX [fk_Assessment_AssessmentStatus1_idx] ON [dbo].[Assessment]
(
	[AssessmentStatus_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_AssessmentType1_idx] ON [dbo].[Assessment]
(
	[AssessmentType_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_BusinessUnit1_idx] ON [dbo].[Assessment]
(
	[BusinessUnit_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_Department1_idx] ON [dbo].[Assessment]
(
	[Department_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_DepartmentHead1_idx] ON [dbo].[Assessment]
(
	[DepartmentHead_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionalArea1_idx] ON [dbo].[Assessment]
(
	[FunctionalArea_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionalAreaOwner1_idx] ON [dbo].[Assessment]
(
	[FunctionalAreaOwner_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_Product1_idx] ON [dbo].[Assessment]
(
	[Product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlFrequency1_idx] ON [dbo].[ControlAssessment]
(
	[ControlFrequency_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlType1_idx] ON [dbo].[ControlAssessment]
(
	[ControlType_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_KeyControlsMaturity1_idx] ON [dbo].[ControlAssessment]
(
	[KeyControlsMaturity_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ProcessControlAssessment1_idx] ON [dbo].[ControlAssessment]
(
	[ProcessControlAssessment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlDesign_ControlAssessment1_idx] ON [dbo].[ControlAssessment_ControlDesign]
(
	[ControlAssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlDesign_ControlDesign1_idx] ON [dbo].[ControlAssessment_ControlDesign]
(
	[ControlDesignId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlTrigger_ControlAssessment1_idx] ON [dbo].[ControlAssessment_ControlTrigger]
(
	[ControlAssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_ControlTrigger_ControlTrigger1_idx] ON [dbo].[ControlAssessment_ControlTrigger]
(
	[ControlTriggerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_TestingFrequency_ControlAssessment1_idx] ON [dbo].[ControlAssessment_TestingFrequency]
(
	[ControlAssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ControlAssessment_TestingFrequency_TestingFrequency1_idx] ON [dbo].[ControlAssessment_TestingFrequency]
(
	[TestingFrequencyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionChange_ChangeType1_idx] ON [dbo].[FunctionChange]
(
	[ChangeType_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionPerformedSite_Assessment1_idx] ON [dbo].[FunctionPerformedSite]
(
	[Assessment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionPerformedSite_Percentage1_idx] ON [dbo].[FunctionPerformedSite]
(
	[Percentage_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionPerformedSite_Site_idx] ON [dbo].[FunctionPerformedSite]
(
	[Site_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionChange1_Assessment1_idx] ON [dbo].[FutureFunctionChanges]
(
	[AssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionChange1_FunctionChange1_idx] ON [dbo].[FutureFunctionChanges]
(
	[FunctionChangeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPISLAAssessment_Assessment1_idx] ON [dbo].[KPISLAAssessment]
(
	[Assessment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPISLAAssessment_KPI1_idx] ON [dbo].[KPISLAAssessment]
(
	[KPI_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPISLAAssessment_KPICategory1_idx] ON [dbo].[KPISLAAssessment]
(
	[KPICategory_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPISLAAssessment_Category1_idx] ON [dbo].[KPISLAAssessment]
(
	[Category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPISLAAssessment_SLA1_idx] ON [dbo].[KPISLAAssessment]
(
	[SelectedSLA_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionChange_Assessment1_idx] ON [dbo].[PriorFunctionChanges]
(
	[AssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_Assessment_FunctionChange_FunctionChange1_idx] ON [dbo].[PriorFunctionChanges]
(
	[FunctionChangeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessControlAssessment_Category1_idx] ON [dbo].[ProcessControlAssessment]
(
	[Category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessControlAssessment_LikelihoodOfOccurrence1_idx] ON [dbo].[ProcessControlAssessment]
(
	[LikelihoodOfOccurrence_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessControlAssessment_RiskExposure1_idx] ON [dbo].[ProcessControlAssessment]
(
	[RiskExposure_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessControlAssessment_RiskImpact_ProcessControlAssess_idx] ON [dbo].[ProcessControlAssessment_RiskImpact]
(
	[ProcessControlAssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessControlAssessment_RiskImpact_RiskImpact1_idx] ON [dbo].[ProcessControlAssessment_RiskImpact]
(
	[RiskImpactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessRisk_Category1_idx] ON [dbo].[ProcessRisk]
(
	[Category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_CoreProcess_Category1_idx] ON [dbo].[CoreProcess]
(
	[Category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_CoreProcess_FunctionalArea1_idx] ON [dbo].[CoreProcess]
(
	[FunctionalAreaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_CoreProcess_ControlType_ControlType1_idx] ON [dbo].[CoreProcess_ControlType]
(
	[ControlTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_CoreProcess_ControlType_CoreProcess1_idx] ON [dbo].[CoreProcess_ControlType]
(
	[CoreProcessId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessRisk_ControlType_ControlType1_idx] ON [dbo].[ProcessRisk_ControlType]
(
	[ControlTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessRisk_ControlType_ProcessRisk1_idx] ON [dbo].[ProcessRisk_ControlType]
(
	[ProcessRiskId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_SubProcessRisk_CoreProcess1_idx] ON [dbo].[SubProcessRisk]
(
	[CoreProcess_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessRiskAssessment_Assessment1_idx] ON [dbo].[ProcessRiskAssessment]
(
	[Assessment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_ProcessRiskAssessment_ProcessRisk1_idx] ON [dbo].[ProcessRiskAssessment]
(
	[ProcessRisk_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
GO
CREATE NONCLUSTERED INDEX [fk_FunctionalAreaProcessAssessment_Assessment1_idx] ON [dbo].[FunctionalAreaProcessAssessment]
(
	[Assessment_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionalAreaProcessAssessment_CoreProcess1_idx] ON [dbo].[FunctionalAreaProcessAssessment]
(
	[CoreProcess_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_FunctionalAreaProcessAssessment_SubProcessRisk1_idx] ON [dbo].[FunctionalAreaProcessAssessment]
(
	[SubProcessRisk_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_SLA_KPISLA2_idx] ON [dbo].[SLA]
(
	[KPICategory_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [fk_KPI_KPICategory2_idx] ON [dbo].[KPI]
(
	[KPICategory_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_AssessmentStatus1] FOREIGN KEY([AssessmentStatus_Id])
REFERENCES [dbo].[AssessmentStatus] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_AssessmentStatus1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_AssessmentType1] FOREIGN KEY([AssessmentType_Id])
REFERENCES [dbo].[AssessmentType] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_AssessmentType1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_BusinessUnit1] FOREIGN KEY([BusinessUnit_Id])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_BusinessUnit1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_Department1] FOREIGN KEY([Department_Id])
REFERENCES [dbo].[Department] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_Department1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_DepartmentHead1] FOREIGN KEY([DepartmentHead_Id])
REFERENCES [dbo].[DepartmentHead] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_DepartmentHead1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionalArea1] FOREIGN KEY([FunctionalArea_Id])
REFERENCES [dbo].[FunctionalArea] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_FunctionalArea1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionalAreaOwner1] FOREIGN KEY([FunctionalAreaOwner_Id])
REFERENCES [dbo].[FunctionalAreaOwner] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_FunctionalAreaOwner1]
GO
ALTER TABLE [dbo].[Assessment]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_Product1] FOREIGN KEY([Product_Id])
REFERENCES [dbo].[Product] ([Id])
GO
ALTER TABLE [dbo].[Assessment] CHECK CONSTRAINT [fk_Assessment_Product1]
GO
ALTER TABLE [dbo].[ControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlFrequency1] FOREIGN KEY([ControlFrequency_Id])
REFERENCES [dbo].[ControlFrequency] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment] CHECK CONSTRAINT [fk_ControlAssessment_ControlFrequency1]
GO
ALTER TABLE [dbo].[ControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlType1] FOREIGN KEY([ControlType_Id])
REFERENCES [dbo].[ControlType] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment] CHECK CONSTRAINT [fk_ControlAssessment_ControlType1]
GO
ALTER TABLE [dbo].[ControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_KeyControlsMaturity1] FOREIGN KEY([KeyControlsMaturity_Id])
REFERENCES [dbo].[KeyControlsMaturity] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment] CHECK CONSTRAINT [fk_ControlAssessment_KeyControlsMaturity1]
GO
ALTER TABLE [dbo].[ControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ProcessControlAssessment1] FOREIGN KEY([ProcessControlAssessment_Id])
REFERENCES [dbo].[ProcessControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment] CHECK CONSTRAINT [fk_ControlAssessment_ProcessControlAssessment1]
GO
ALTER TABLE [dbo].[ControlAssessment_ControlDesign]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlDesign_ControlAssessment1] FOREIGN KEY([ControlAssessmentId])
REFERENCES [dbo].[ControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_ControlDesign] CHECK CONSTRAINT [fk_ControlAssessment_ControlDesign_ControlAssessment1]
GO
ALTER TABLE [dbo].[ControlAssessment_ControlDesign]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlDesign_ControlDesign1] FOREIGN KEY([ControlDesignId])
REFERENCES [dbo].[ControlDesign] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_ControlDesign] CHECK CONSTRAINT [fk_ControlAssessment_ControlDesign_ControlDesign1]
GO
ALTER TABLE [dbo].[ControlAssessment_ControlTrigger]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlTrigger_ControlAssessment1] FOREIGN KEY([ControlAssessmentId])
REFERENCES [dbo].[ControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_ControlTrigger] CHECK CONSTRAINT [fk_ControlAssessment_ControlTrigger_ControlAssessment1]
GO
ALTER TABLE [dbo].[ControlAssessment_ControlTrigger]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_ControlTrigger_ControlTrigger1] FOREIGN KEY([ControlTriggerId])
REFERENCES [dbo].[ControlTrigger] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_ControlTrigger] CHECK CONSTRAINT [fk_ControlAssessment_ControlTrigger_ControlTrigger1]
GO
ALTER TABLE [dbo].[ControlAssessment_TestingFrequency]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_TestingFrequency_ControlAssessment1] FOREIGN KEY([ControlAssessmentId])
REFERENCES [dbo].[ControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_TestingFrequency] CHECK CONSTRAINT [fk_ControlAssessment_TestingFrequency_ControlAssessment1]
GO
ALTER TABLE [dbo].[ControlAssessment_TestingFrequency]  WITH CHECK ADD  CONSTRAINT [fk_ControlAssessment_TestingFrequency_TestingFrequency1] FOREIGN KEY([TestingFrequencyId])
REFERENCES [dbo].[TestingFrequency] ([Id])
GO
ALTER TABLE [dbo].[ControlAssessment_TestingFrequency] CHECK CONSTRAINT [fk_ControlAssessment_TestingFrequency_TestingFrequency1]
GO
ALTER TABLE [dbo].[Department]  WITH CHECK ADD  CONSTRAINT [FK_Department_BusinessUnit] FOREIGN KEY([BusinessUnitId])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[Department] CHECK CONSTRAINT [FK_Department_BusinessUnit]
GO
ALTER TABLE [dbo].[DepartmentHead]  WITH CHECK ADD  CONSTRAINT [FK_DepartmentHead_BusinessUnit] FOREIGN KEY([BusinessUnitId])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[DepartmentHead] CHECK CONSTRAINT [FK_DepartmentHead_BusinessUnit]
GO
ALTER TABLE [dbo].[FunctionalArea]  WITH CHECK ADD  CONSTRAINT [FK_FunctionalArea_BusinessUnit] FOREIGN KEY([BusinessUnitId])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[FunctionalArea] CHECK CONSTRAINT [FK_FunctionalArea_BusinessUnit]
GO
ALTER TABLE [dbo].[FunctionalAreaOwner]  WITH CHECK ADD  CONSTRAINT [FK_FunctionalAreaOwner_BusinessUnit] FOREIGN KEY([BusinessUnitId])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[FunctionalAreaOwner] CHECK CONSTRAINT [FK_FunctionalAreaOwner_BusinessUnit]
GO
ALTER TABLE [dbo].[FunctionChange]  WITH CHECK ADD  CONSTRAINT [fk_FunctionChange_ChangeType1] FOREIGN KEY([ChangeType_Id])
REFERENCES [dbo].[ChangeType] ([Id])
GO
ALTER TABLE [dbo].[FunctionChange] CHECK CONSTRAINT [fk_FunctionChange_ChangeType1]
GO
ALTER TABLE [dbo].[FunctionPerformedSite]  WITH CHECK ADD  CONSTRAINT [fk_FunctionPerformedSite_Assessment1] FOREIGN KEY([Assessment_Id])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[FunctionPerformedSite] CHECK CONSTRAINT [fk_FunctionPerformedSite_Assessment1]
GO
ALTER TABLE [dbo].[FunctionPerformedSite]  WITH CHECK ADD  CONSTRAINT [fk_FunctionPerformedSite_Percentage1] FOREIGN KEY([Percentage_Id])
REFERENCES [dbo].[Percentage] ([Id])
GO
ALTER TABLE [dbo].[FunctionPerformedSite] CHECK CONSTRAINT [fk_FunctionPerformedSite_Percentage1]
GO
ALTER TABLE [dbo].[FunctionPerformedSite]  WITH CHECK ADD  CONSTRAINT [fk_FunctionPerformedSite_Site] FOREIGN KEY([Site_Id])
REFERENCES [dbo].[Site] ([Id])
GO
ALTER TABLE [dbo].[FunctionPerformedSite] CHECK CONSTRAINT [fk_FunctionPerformedSite_Site]
GO
ALTER TABLE [dbo].[FutureFunctionChanges]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionChange1_Assessment1] FOREIGN KEY([AssessmentId])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[FutureFunctionChanges] CHECK CONSTRAINT [fk_Assessment_FunctionChange1_Assessment1]
GO
ALTER TABLE [dbo].[FutureFunctionChanges]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionChange1_FunctionChange1] FOREIGN KEY([FunctionChangeId])
REFERENCES [dbo].[FunctionChange] ([Id])  ON DELETE CASCADE
GO
ALTER TABLE [dbo].[FutureFunctionChanges] CHECK CONSTRAINT [fk_Assessment_FunctionChange1_FunctionChange1]
GO
ALTER TABLE [dbo].[KPISLAAssessment]  WITH CHECK ADD  CONSTRAINT [fk_KPISLAAssessment_Assessment1] FOREIGN KEY([Assessment_Id])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[KPISLAAssessment] CHECK CONSTRAINT [fk_KPISLAAssessment_Assessment1]
GO
ALTER TABLE [dbo].[KPISLAAssessment]  WITH CHECK ADD  CONSTRAINT [fk_KPISLAAssessment_KPI1] FOREIGN KEY([KPI_Id])
REFERENCES [dbo].[KPI] ([Id])
GO
ALTER TABLE [dbo].[KPISLAAssessment] CHECK CONSTRAINT [fk_KPISLAAssessment_KPI1]
GO
ALTER TABLE [dbo].[KPISLAAssessment]  WITH CHECK ADD  CONSTRAINT [fk_KPISLAAssessment_KPICategory1] FOREIGN KEY([KPICategory_Id])
REFERENCES [dbo].[KPICategory] ([Id])
GO
ALTER TABLE [dbo].[KPISLAAssessment] CHECK CONSTRAINT [fk_KPISLAAssessment_KPICategory1]
GO
ALTER TABLE [dbo].[KPISLAAssessment]  WITH CHECK ADD  CONSTRAINT [fk_KPISLAAssessment_Category1] FOREIGN KEY([Category_Id])
REFERENCES [dbo].[Category] ([Id])
GO
ALTER TABLE [dbo].[KPISLAAssessment] CHECK CONSTRAINT [fk_KPISLAAssessment_Category1]
GO
ALTER TABLE [dbo].[KPISLAAssessment]  WITH CHECK ADD  CONSTRAINT [fk_KPISLAAssessment_SLA1] FOREIGN KEY([SelectedSLA_Id])
REFERENCES [dbo].[SLA] ([Id])
GO
ALTER TABLE [dbo].[KPISLAAssessment] CHECK CONSTRAINT [fk_KPISLAAssessment_SLA1]
GO
ALTER TABLE [dbo].[PriorFunctionChanges]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionChange_Assessment1] FOREIGN KEY([AssessmentId])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[PriorFunctionChanges] CHECK CONSTRAINT [fk_Assessment_FunctionChange_Assessment1]
GO
ALTER TABLE [dbo].[PriorFunctionChanges]  WITH CHECK ADD  CONSTRAINT [fk_Assessment_FunctionChange_FunctionChange1] FOREIGN KEY([FunctionChangeId])
REFERENCES [dbo].[FunctionChange] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PriorFunctionChanges] CHECK CONSTRAINT [fk_Assessment_FunctionChange_FunctionChange1]
GO
ALTER TABLE [dbo].[ProcessControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ProcessControlAssessment_Category1] FOREIGN KEY([Category_Id])
REFERENCES [dbo].[Category] ([Id])
GO
ALTER TABLE [dbo].[ProcessControlAssessment] CHECK CONSTRAINT [fk_ProcessControlAssessment_Category1]
GO
ALTER TABLE [dbo].[ProcessControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ProcessControlAssessment_LikelihoodOfOccurrence1] FOREIGN KEY([LikelihoodOfOccurrence_Id])
REFERENCES [dbo].[LikelihoodOfOccurrence] ([Id])
GO
ALTER TABLE [dbo].[ProcessControlAssessment] CHECK CONSTRAINT [fk_ProcessControlAssessment_LikelihoodOfOccurrence1]
GO
ALTER TABLE [dbo].[ProcessControlAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ProcessControlAssessment_RiskExposure1] FOREIGN KEY([RiskExposure_Id])
REFERENCES [dbo].[RiskExposure] ([Id])
GO
ALTER TABLE [dbo].[ProcessControlAssessment] CHECK CONSTRAINT [fk_ProcessControlAssessment_RiskExposure1]
GO
ALTER TABLE [dbo].[ProcessControlAssessment_RiskImpact]  WITH CHECK ADD  CONSTRAINT [fk_ProcessControlAssessment_RiskImpact_ProcessControlAssessme1] FOREIGN KEY([ProcessControlAssessmentId])
REFERENCES [dbo].[ProcessControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ProcessControlAssessment_RiskImpact] CHECK CONSTRAINT [fk_ProcessControlAssessment_RiskImpact_ProcessControlAssessme1]
GO
ALTER TABLE [dbo].[ProcessControlAssessment_RiskImpact]  WITH CHECK ADD  CONSTRAINT [fk_ProcessControlAssessment_RiskImpact_RiskImpact1] FOREIGN KEY([RiskImpactId])
REFERENCES [dbo].[RiskImpact] ([Id])
GO
ALTER TABLE [dbo].[ProcessControlAssessment_RiskImpact] CHECK CONSTRAINT [fk_ProcessControlAssessment_RiskImpact_RiskImpact1]
GO
ALTER TABLE [dbo].[ProcessRisk]  WITH CHECK ADD  CONSTRAINT [fk_ProcessRisk_Category1] FOREIGN KEY([Category_Id])
REFERENCES [dbo].[Category] ([Id])
GO
ALTER TABLE [dbo].[ProcessRisk] CHECK CONSTRAINT [fk_ProcessRisk_Category1]
GO
ALTER TABLE [dbo].[CoreProcess]  WITH CHECK ADD  CONSTRAINT [fk_CoreProcess_Category1] FOREIGN KEY([Category_Id])
REFERENCES [dbo].[Category] ([Id])
GO
ALTER TABLE [dbo].[CoreProcess] CHECK CONSTRAINT [fk_CoreProcess_Category1]
GO
ALTER TABLE [dbo].[CoreProcess]  WITH CHECK ADD  CONSTRAINT [fk_CoreProcess_FunctionalArea1] FOREIGN KEY([FunctionalAreaId])
REFERENCES [dbo].[FunctionalArea] ([Id])
GO
ALTER TABLE [dbo].[CoreProcess] CHECK CONSTRAINT [fk_CoreProcess_FunctionalArea1]
GO
ALTER TABLE [dbo].[SubProcessRisk]  WITH CHECK ADD  CONSTRAINT [fk_SubProcessRisk_CoreProcess1] FOREIGN KEY([CoreProcess_Id])
REFERENCES [dbo].[CoreProcess] ([Id])
GO
ALTER TABLE [dbo].[SubProcessRisk] CHECK CONSTRAINT [fk_SubProcessRisk_CoreProcess1]
GO
ALTER TABLE [dbo].[ProcessRisk_ControlType]  WITH CHECK ADD  CONSTRAINT [fk_ProcessRisk_ControlType_ProcessRisk1] FOREIGN KEY([ProcessRiskId])
REFERENCES [dbo].[ProcessRisk] ([Id])
GO
ALTER TABLE [dbo].[ProcessRisk_ControlType] CHECK CONSTRAINT [fk_ProcessRisk_ControlType_ProcessRisk1]
GO
ALTER TABLE [dbo].[ProcessRisk_ControlType]  WITH CHECK ADD  CONSTRAINT [fk_ProcessRisk_ControlType_ControlType1] FOREIGN KEY([ControlTypeId])
REFERENCES [dbo].[ControlType] ([Id])
GO
ALTER TABLE [dbo].[ProcessRisk_ControlType] CHECK CONSTRAINT [fk_ProcessRisk_ControlType_ControlType1]
GO
ALTER TABLE [dbo].[CoreProcess_ControlType]  WITH CHECK ADD  CONSTRAINT [fk_CoreProcess_ControlType_CoreProcess1] FOREIGN KEY([CoreProcessId])
REFERENCES [dbo].[CoreProcess] ([Id])
GO
ALTER TABLE [dbo].[CoreProcess_ControlType] CHECK CONSTRAINT [fk_CoreProcess_ControlType_CoreProcess1]
GO
ALTER TABLE [dbo].[CoreProcess_ControlType]  WITH CHECK ADD  CONSTRAINT [fk_CoreProcess_ControlType_ControlType1] FOREIGN KEY([ControlTypeId])
REFERENCES [dbo].[ControlType] ([Id])
GO
ALTER TABLE [dbo].[CoreProcess_ControlType] CHECK CONSTRAINT [fk_CoreProcess_ControlType_ControlType1]
GO
ALTER TABLE [dbo].[ProcessRiskAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ProcessRiskAssessment_Assessment1] FOREIGN KEY([Assessment_Id])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[ProcessRiskAssessment] CHECK CONSTRAINT [fk_ProcessRiskAssessment_Assessment1]
GO
ALTER TABLE [dbo].[ProcessRiskAssessment]  WITH CHECK ADD  CONSTRAINT [FK_ProcessRiskAssessment_ProcessControlAssessment] FOREIGN KEY([Id])
REFERENCES [dbo].[ProcessControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[ProcessRiskAssessment] CHECK CONSTRAINT [FK_ProcessRiskAssessment_ProcessControlAssessment]
GO
ALTER TABLE [dbo].[ProcessRiskAssessment]  WITH CHECK ADD  CONSTRAINT [fk_ProcessRiskAssessment_ProcessRisk1] FOREIGN KEY([ProcessRisk_Id])
REFERENCES [dbo].[ProcessRisk] ([Id])
GO
ALTER TABLE [dbo].[ProcessRiskAssessment] CHECK CONSTRAINT [fk_ProcessRiskAssessment_ProcessRisk1]
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment]  WITH CHECK ADD  CONSTRAINT [fk_FunctionalAreaProcessAssessment_Assessment1] FOREIGN KEY([Assessment_Id])
REFERENCES [dbo].[Assessment] ([Id])
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment] CHECK CONSTRAINT [fk_FunctionalAreaProcessAssessment_Assessment1]
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment]  WITH CHECK ADD  CONSTRAINT [FK_FunctionalAreaProcessAssessment_ProcessControlAssessment] FOREIGN KEY([Id])
REFERENCES [dbo].[ProcessControlAssessment] ([Id])
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment] CHECK CONSTRAINT [FK_FunctionalAreaProcessAssessment_ProcessControlAssessment]
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment]  WITH CHECK ADD  CONSTRAINT [fk_FunctionalAreaProcessAssessment_CoreProcess1] FOREIGN KEY([CoreProcess_Id])
REFERENCES [dbo].[CoreProcess] ([Id])
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment] CHECK CONSTRAINT [fk_FunctionalAreaProcessAssessment_CoreProcess1]
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment]  WITH CHECK ADD  CONSTRAINT [fk_FunctionalAreaProcessAssessment_SubProcessRisk1] FOREIGN KEY([SubProcessRisk_Id])
REFERENCES [dbo].[SubProcessRisk] ([Id])
GO
ALTER TABLE [dbo].[FunctionalAreaProcessAssessment] CHECK CONSTRAINT [fk_FunctionalAreaProcessAssessment_SubProcessRisk1]
GO
ALTER TABLE [dbo].[Product]  WITH CHECK ADD  CONSTRAINT [FK_Product_BusinessUnit] FOREIGN KEY([BusinessUnitId])
REFERENCES [dbo].[BusinessUnit] ([Id])
GO
ALTER TABLE [dbo].[Product] CHECK CONSTRAINT [FK_Product_BusinessUnit]
GO
ALTER TABLE [dbo].[SLA]  WITH CHECK ADD  CONSTRAINT [fk_SLA_KPICategory2] FOREIGN KEY([KPICategory_Id])
REFERENCES [dbo].[KPICategory] ([Id])
GO
ALTER TABLE [dbo].[SLA] CHECK CONSTRAINT [fk_SLA_KPICategory2]
GO
ALTER TABLE [dbo].[KPI]  WITH CHECK ADD  CONSTRAINT [fk_KPI_KPICategory1] FOREIGN KEY([KPICategory_Id])
REFERENCES [dbo].[KPICategory] ([Id])
GO
ALTER TABLE [dbo].[KPI] CHECK CONSTRAINT [fk_KPI_KPICategory1]
GO
