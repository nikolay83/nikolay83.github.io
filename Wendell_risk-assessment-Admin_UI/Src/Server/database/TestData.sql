SET NOCOUNT ON
SET DATEFORMAT mdy

DELETE [ActionPermission]
DELETE [AuditRecord]
DELETE [ControlAssessment_ControlDesign]
DELETE [ControlAssessment_ControlTrigger]
DELETE [ControlAssessment_TestingFrequency]
DELETE [ControlAssessment]
DELETE [ControlDesign]
DELETE [ControlFrequency]
DELETE [ControlTrigger]
DELETE [CoreProcess_ControlType]
DELETE [ProcessRisk_ControlType]
DELETE [ControlType]
DELETE [FunctionPerformedSite]
DELETE [FutureFunctionChanges]
DELETE [KeyControlsMaturity]
DELETE [KPISLAAssessment]
DELETE [Percentage]
DELETE [PriorFunctionChanges]
DELETE [FunctionChange]
DELETE [ChangeType]
DELETE [ProcessControlAssessment_RiskImpact]
DELETE [ProcessRiskAssessment]
DELETE [FunctionalAreaProcessAssessment]
DELETE [Assessment]
DELETE [AssessmentStatus]
DELETE [AssessmentType]
DELETE [Department]
DELETE [DepartmentHead]
DELETE [FunctionalAreaOwner]
DELETE [ProcessControlAssessment]
DELETE [LikelihoodOfOccurrence]
DELETE [SubProcessRisk]
DELETE [CoreProcess]
DELETE [ProcessRisk]
DELETE [Category]
DELETE [Product]
DELETE [RiskExposure]
DELETE [RiskImpact]
DELETE [Site]
DELETE [SLA]
DELETE [KPI]
DELETE [KPICategory]
DELETE [TestingFrequency]
DELETE [FunctionalArea]
DELETE [BusinessUnit]
DELETE [Token]

INSERT INTO [Token] ([Username], [TokenValue], [ExpirationDate])
VALUES
(N'CoeusOwnerUser1', N'e0d5ba3f-2459-4ea5-a30a-b0addf99e0f5', '12/12/9999'),
(N'CoeusBUFuncApp1', N'e1d5ba3f-2459-4ea5-a30a-b0addf99e0f5', '12/12/9999'),
(N'CoeusRiskManager', N'e2d5ba3f-2459-4ea5-a30a-b0addf99e0f5', '12/12/9999'),
(N'CoeusRiskManager2', N'e3d5ba3f-2459-4ea5-a30a-b0addf99e0f5', '12/12/9999'),
(N'CoeusAdmin', N'e4d5ba3f-2459-4ea5-a30a-b0addf99e0f5', '12/12/9999')

SET IDENTITY_INSERT [BusinessUnit] ON
INSERT INTO [BusinessUnit] ([Id], [Name])
VALUES
(1, N'Annuities'),
(2, N'Insurance'),
(3, N'Investments/JHSS'),
(4, N'RPS'),
(5, N'Shared Services')
SET IDENTITY_INSERT [BusinessUnit] OFF

SET IDENTITY_INSERT [FunctionalArea] ON
INSERT INTO [FunctionalArea] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'FunctionalArea1', 1),
(2, N'FunctionalArea2', 1),
(3, N'FunctionalArea3', 1),
(4, N'FunctionalArea4', 1),
(5, N'FunctionalArea5', 2),
(6, N'FunctionalArea6', 2),
(7, N'FunctionalArea7', 2),
(8, N'FunctionalArea8', 3),
(9, N'FunctionalArea9', 3),
(10, N'FunctionalArea10', 4)
SET IDENTITY_INSERT [FunctionalArea] OFF

SET IDENTITY_INSERT [TestingFrequency] ON
INSERT INTO [TestingFrequency] ([Id], [Name])
VALUES
(1, N'TestingFrequency1'),
(2, N'TestingFrequency2'),
(3, N'TestingFrequency3'),
(4, N'TestingFrequency4'),
(5, N'TestingFrequency5'),
(6, N'TestingFrequency6'),
(7, N'TestingFrequency7'),
(8, N'TestingFrequency8'),
(9, N'TestingFrequency9'),
(10, N'TestingFrequency10')
SET IDENTITY_INSERT [TestingFrequency] OFF

SET IDENTITY_INSERT [KPICategory] ON
INSERT INTO [KPICategory] ([Id], [Name])
VALUES
(1, N'KPICategory1'),
(2, N'KPICategory2'),
(3, N'KPICategory3'),
(4, N'KPICategory4'),
(5, N'KPICategory5'),
(6, N'KPICategory6'),
(7, N'KPICategory7'),
(8, N'KPICategory8'),
(9, N'KPICategory9'),
(10, N'KPICategory10')
SET IDENTITY_INSERT [KPICategory] OFF


SET IDENTITY_INSERT [KPI] ON
INSERT INTO [KPI] ([Id], [Name],[KPICategory_Id])
VALUES
(1, N'KPISLA1', 1),
(2, N'KPISLA2', 1),
(3, N'KPISLA3', 1),
(4, N'KPISLA4', 2),
(5, N'KPISLA5', 2),
(6, N'KPISLA6', 2),
(7, N'KPISLA7', 3),
(8, N'KPISLA8', 3),
(9, N'KPISLA9', 4),
(10, N'KPISLA10', 5)
SET IDENTITY_INSERT [KPI] OFF

SET IDENTITY_INSERT [SLA] ON
INSERT INTO [SLA] ([Id], [Name], [KPICategory_Id])
VALUES
(1, N'SLA1', 1),
(2, N'SLA2', 1),
(3, N'SLA3', 1),
(4, N'SLA4', 1),
(5, N'SLA5', 2),
(6, N'SLA6', 2),
(7, N'SLA7', 2),
(8, N'SLA8', 3),
(9, N'SLA9', 3),
(10, N'SLA10', 4)
SET IDENTITY_INSERT [SLA] OFF

SET IDENTITY_INSERT [Site] ON
INSERT INTO [Site] ([Id], [Name])
VALUES
(1, N'Site1'),
(2, N'Site2'),
(3, N'Site3'),
(4, N'Site4'),
(5, N'Site5'),
(6, N'Site6'),
(7, N'Site7'),
(8, N'Site8'),
(9, N'Site9'),
(10, N'Site10')
SET IDENTITY_INSERT [Site] OFF

SET IDENTITY_INSERT [RiskImpact] ON
INSERT INTO [RiskImpact] ([Id], [Name])
VALUES
(1, N'RiskImpact1'),
(2, N'RiskImpact2'),
(3, N'RiskImpact3'),
(4, N'RiskImpact4'),
(5, N'RiskImpact5'),
(6, N'RiskImpact6'),
(7, N'RiskImpact7'),
(8, N'RiskImpact8'),
(9, N'RiskImpact9'),
(10, N'RiskImpact10')
SET IDENTITY_INSERT [RiskImpact] OFF

SET IDENTITY_INSERT [RiskExposure] ON
INSERT INTO [RiskExposure] ([Id], [Name])
VALUES
(1, N'RiskExposure1'),
(2, N'RiskExposure2'),
(3, N'RiskExposure3'),
(4, N'RiskExposure4'),
(5, N'RiskExposure5'),
(6, N'RiskExposure6'),
(7, N'RiskExposure7'),
(8, N'RiskExposure8'),
(9, N'RiskExposure9'),
(10, N'RiskExposure10')
SET IDENTITY_INSERT [RiskExposure] OFF

SET IDENTITY_INSERT [Product] ON
INSERT INTO [Product] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'Product1', 1),
(2, N'Product2', 1),
(3, N'Product3', 1),
(4, N'Product4', 1),
(5, N'Product5', 2),
(6, N'Product6', 2),
(7, N'Product7', 2),
(8, N'Product8', 3),
(9, N'Product9', 3),
(10, N'Product10', 4)
SET IDENTITY_INSERT [Product] OFF

SET IDENTITY_INSERT [Category] ON
INSERT INTO [Category] ([Id], [Name])
VALUES
(1, N'KPI''s / SLA''s'),
(2, N'Functional Area Processes'),
(3, N'Corporate & Divisional Training'),
(4, N'Business Continuity & Disaster Recovery'),
(5, N'Records Management'),
(6, N'Information Security'),
(7, N'Data Privacy & Protection'),
(8, N'Category8'),
(9, N'Category9'),
(10, N'Category10')
SET IDENTITY_INSERT [Category] OFF


SET IDENTITY_INSERT [CoreProcess] ON
INSERT INTO [CoreProcess] ([Id], [Name], [FunctionalAreaId], [Category_Id])
VALUES
(1, N'ProcessRisk1', 1, 2),
(2, N'ProcessRisk2', 1, 2),
(3, N'ProcessRisk3', 1, 2),
(4, N'ProcessRisk4', 2, 2),
(5, N'ProcessRisk5', 2, 2),
(6, N'ProcessRisk6', 2, 2),
(7, N'ProcessRisk7', 3, 2),
(8, N'ProcessRisk8', 3, 2),
(9, N'ProcessRisk9', 4, 2),
(10, N'ProcessRisk10', 5, 2)
SET IDENTITY_INSERT [CoreProcess] OFF


SET IDENTITY_INSERT [SubProcessRisk] ON
INSERT INTO [SubProcessRisk] ([Id], [Name], [Risk], [CoreProcess_Id])
VALUES
(1, N'SubProcessRisk1', N'Risk1', 1),
(2, N'SubProcessRisk2', N'Risk2', 1),
(3, N'SubProcessRisk3', N'Risk3', 1),
(4, N'SubProcessRisk4', N'Risk4', 2),
(5, N'SubProcessRisk5', N'Risk5', 2),
(6, N'SubProcessRisk6', N'Risk6', 3),
(7, N'SubProcessRisk7', N'Risk7', 3),
(8, N'SubProcessRisk8', N'Risk8', 5),
(9, N'SubProcessRisk9', N'Risk9', 5),
(10, N'SubProcessRisk10', N'Risk10', 6)
SET IDENTITY_INSERT [SubProcessRisk] OFF



SET IDENTITY_INSERT [ProcessRisk] ON
INSERT INTO [ProcessRisk] ([Id], [Name], [Risk], [Category_Id])
VALUES
(1, N'ProcessRisk1', N'Risk1', 1),
(2, N'ProcessRisk2', N'Risk2', 1),
(3, N'ProcessRisk3', N'Risk3', 1),
(4, N'ProcessRisk4', N'Risk4', 1),
(5, N'ProcessRisk5', N'Risk5', 2),
(6, N'ProcessRisk6', N'Risk6', 2),
(7, N'ProcessRisk7', N'Risk7', 2),
(8, N'ProcessRisk8', N'Risk8', 3),
(9, N'ProcessRisk9', N'Risk9', 3),
(10, N'ProcessRisk10', N'Risk10', 4)
SET IDENTITY_INSERT [ProcessRisk] OFF

SET IDENTITY_INSERT [LikelihoodOfOccurrence] ON
INSERT INTO [LikelihoodOfOccurrence] ([Id], [Name])
VALUES
(1, N'LikelihoodOfOccurrence1'),
(2, N'LikelihoodOfOccurrence2'),
(3, N'LikelihoodOfOccurrence3'),
(4, N'LikelihoodOfOccurrence4'),
(5, N'LikelihoodOfOccurrence5'),
(6, N'LikelihoodOfOccurrence6'),
(7, N'LikelihoodOfOccurrence7'),
(8, N'LikelihoodOfOccurrence8'),
(9, N'LikelihoodOfOccurrence9'),
(10, N'LikelihoodOfOccurrence10')
SET IDENTITY_INSERT [LikelihoodOfOccurrence] OFF

SET IDENTITY_INSERT [ProcessControlAssessment] ON
INSERT INTO [ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [RiskExposure_Id], [Category_Id])
VALUES
(1, 1, 1, 3),
(2, 1, 1, 4),
(3, 1, 1, 5),
(4, 1, 1, 6),
(5, 1, 1, 2),
(6, 1, 2, 3),
(7, 2, 2, 3),
(8, 2, 2, 4),
(9, 2, 3, 4),
(10, 2, 3, 5),
(11, 1, 1, 2),
(12, 2, 2, 2),
(13, 3, 3, 2),
(14, 4, 4, 2),
(15, 1, 1, 2),
(16, 1, 2, 2),
(17, 2, 2, 2),
(18, 2, 2, 4),
(19, 2, 3, 4),
(20, 2, 3, 5)
SET IDENTITY_INSERT [ProcessControlAssessment] OFF

SET IDENTITY_INSERT [FunctionalAreaOwner] ON
INSERT INTO [FunctionalAreaOwner] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'FunctionalAreaOwner1', 1),
(2, N'FunctionalAreaOwner2', 1),
(3, N'FunctionalAreaOwner3', 1),
(4, N'FunctionalAreaOwner4', 1),
(5, N'FunctionalAreaOwner5', 2),
(6, N'FunctionalAreaOwner6', 2),
(7, N'FunctionalAreaOwner7', 2),
(8, N'FunctionalAreaOwner8', 3),
(9, N'FunctionalAreaOwner9', 3),
(10, N'FunctionalAreaOwner10', 4)
SET IDENTITY_INSERT [FunctionalAreaOwner] OFF

SET IDENTITY_INSERT [DepartmentHead] ON
INSERT INTO [DepartmentHead] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'DepartmentHead1', 1),
(2, N'DepartmentHead2', 1),
(3, N'DepartmentHead3', 1),
(4, N'DepartmentHead4', 1),
(5, N'DepartmentHead5', 2),
(6, N'DepartmentHead6', 2),
(7, N'DepartmentHead7', 2),
(8, N'DepartmentHead8', 3),
(9, N'DepartmentHead9', 3),
(10, N'DepartmentHead10', 4)
SET IDENTITY_INSERT [DepartmentHead] OFF

SET IDENTITY_INSERT [Department] ON
INSERT INTO [Department] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'Department1', 1),
(2, N'Department2', 1),
(3, N'Department3', 1),
(4, N'Department4', 1),
(5, N'Department5', 2),
(6, N'Department6', 2),
(7, N'Department7', 2),
(8, N'Department8', 3),
(9, N'Department9', 3),
(10, N'Department10', 4)
SET IDENTITY_INSERT [Department] OFF

SET IDENTITY_INSERT [AssessmentType] ON
INSERT INTO [AssessmentType] ([Id], [Name])
VALUES
(1, N'AssessmentType1'),
(2, N'AssessmentType2'),
(3, N'AssessmentType3'),
(4, N'AssessmentType4'),
(5, N'AssessmentType5'),
(6, N'AssessmentType6'),
(7, N'AssessmentType7'),
(8, N'AssessmentType8'),
(9, N'AssessmentType9'),
(10, N'AssessmentType10')
SET IDENTITY_INSERT [AssessmentType] OFF

SET IDENTITY_INSERT [AssessmentStatus] ON
INSERT INTO [AssessmentStatus] ([Id], [Name])
VALUES
(1, N'AssessmentStatus1'),
(2, N'AssessmentStatus2'),
(3, N'AssessmentStatus3'),
(4, N'AssessmentStatus4'),
(5, N'AssessmentStatus5'),
(6, N'AssessmentStatus6'),
(7, N'AssessmentStatus7'),
(8, N'AssessmentStatus8'),
(9, N'AssessmentStatus9'),
(10, N'AssessmentStatus10')
SET IDENTITY_INSERT [AssessmentStatus] OFF

SET IDENTITY_INSERT [Assessment] ON
INSERT INTO [Assessment] ([Id], [FunctionalAreaDescription], [AssessmentDueDate], [OverallRiskRatingCommentary], [ApprovalStatus], [BUFunctionalApproverUsername], [BUFunctionalApproveTime], [BURiskManagementApproverUsername], [BURiskManagementApproveTime], [DivisionalRiskManagementApproverUsername], [DivisionalRiskManagementApproveTime], [RejecterUsername], [RejectTime], [RejectionReason], [RejectPhase], [SubmitterUsername], [SubmitTime], [Title], [CreatedBy], [CreatedTime], [LastUpdatedBy], [LastUpdatedTime], [BusinessUnit_Id], [DepartmentHead_Id], [Product_Id], [Department_Id], [FunctionalAreaOwner_Id], [FunctionalArea_Id], [AssessmentType_Id], [AssessmentStatus_Id])
VALUES
(1, N'FunctionalAreaDescription1', '04/20/2016', N'OverallRiskRatingCommentary1', 0, N'CoeusBUFunctionalApprover', '04/19/2016', N'CoeusBURiskManagementApprover', '04/18/2016', N'CoeusDivisionalRiskManagementApprover', '04/17/2016', NULL, NULL, NULL, 0, N'CoeusOwnerUser1', '04/15/2016', N'Title1', N'CreatedBy1', '04/14/2016', N'LastUpdatedBy1', '04/13/2016', 1, 1, 1, 1, 1, 1, 1, 1),
(2, N'FunctionalAreaDescription1', '04/10/2016', N'OverallRiskRatingCommentary2', 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, N'CoeusOwnerUser1', '04/05/2016', N'Title2', N'CreatedBy2', '04/04/2016', N'LastUpdatedBy2', '04/03/2016', 1, 1, 2, 2, 2, 2, 2, 2),
(4, N'FunctionalAreaDescription2', '03/21/2016', N'OverallRiskRatingCommentary1', 2, N'CoeusBUFunctionalApprover', '03/20/2016', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, N'CoeusOwnerUser1', '03/16/2016', N'Title14', N'CreatedBy4', '03/15/2016', N'LastUpdatedBy4', '03/14/2016', 1, 2, 3, 2, 4, 4, 2, 1),
(5, N'FunctionalAreaDescription2', '03/11/2016', N'OverallRiskRatingCommentary2', 3, N'CoeusBUFunctionalApprover', '03/10/2016', N'CoeusBURiskManagementApprover', '03/09/2016', NULL, NULL, NULL, NULL, NULL, 0, N'CoeusOwnerUser1', '03/06/2016', N'Title15', N'CreatedBy5', '03/05/2016', N'LastUpdatedBy5', '03/04/2016', 2, 1, 1, 3, 2, 3, 1, 1),
(7, N'FunctionalAreaDescription1', '02/20/2016', N'OverallRiskRatingCommentary3', 5, N'CoeusBUFunctionalApprover', '02/19/2016', N'CoeusBURiskManagementApprover', '02/18/2016', N'CoeusDivisionalRiskManagementApprover', '02/17/2016', N'CoeusAdmin', '02/16/2016', N'RejectionReason7', 1, N'CoeusOwnerUser1', '02/15/2016', N'Title17', N'CreatedBy7', '02/14/2016', N'LastUpdatedBy7', '02/13/2016', 2, 2, 1, 3, 4, 3, 1, 4),
(8, N'FunctionalAreaDescription1', '02/10/2016', N'OverallRiskRatingCommentary2', 5, N'CoeusBUFunctionalApprover', '02/09/2016', N'CoeusBURiskManagementApprover', '02/08/2016', N'CoeusDivisionalRiskManagementApprover', '02/07/2016', N'CoeusDivisionalRiskManagementApprover', '02/06/2016', N'RejectionReason8', 2, N'CoeusAdmin', '02/05/2016', N'Title8', N'CreatedBy8', '02/04/2016', N'LastUpdatedBy8', '02/03/2016', 3, 1, 1, 2, 4, 3, 4, 2),
(10, N'FunctionalAreaDescription2', '01/21/2016', N'OverallRiskRatingCommentary1', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, N'CoeusOwner', '01/16/2016', N'Title10', N'CreatedBy10', '01/15/2016', N'LastUpdatedBy10', '01/14/2016', 4, 3, 1, 2, 2, 1, 1, 3),
(3, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'Title2', N'CreatedBy3', '03/31/2016', N'LastUpdatedBy3', '03/30/2016', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'Title6', N'CreatedBy6', '03/01/2016', N'LastUpdatedBy6', '02/29/2016', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'Title9', N'CreatedBy9', '01/31/2016', N'LastUpdatedBy9', '01/30/2016', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [Assessment] OFF

INSERT INTO [ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id])
VALUES
(1, N'AdditionalProcess1', N'AdditionalRisk1', 1, 1),
(2, N'AdditionalProcess2', N'AdditionalRisk2', 2, 1),
(3, NULL, NULL, 3, 1),
(4, N'AdditionalProcess4', N'AdditionalRisk4', 4, 1),
(5, N'AdditionalProcess5', N'AdditionalRisk5', 5, 2),
(6, NULL, NULL, 6, 2),
(7, N'AdditionalProcess7', N'AdditionalRisk7', 7, 2),
(8, N'AdditionalProcess8', N'AdditionalRisk8', 8, 3),
(9, NULL, NULL, 9, 3),
(10, N'AdditionalProcess10', N'AdditionalRisk10', 10, 4)

INSERT INTO [FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id],[CoreProcess_Id], [Assessment_Id])
VALUES
(11, N'AdditionalCoreProcess1',N'AdditionalSubProcess1', N'AdditionalRisk1', null, null, 1),
(12, null, N'AdditonalCoreSubProcess1', N'AdditionalRisk2', null, 2, 1),
(13, NULL, NULL,NULL,2, 3, 1),
(14, N'AdditionalCoreProcess4',N'AdditionalSubProcess4', N'AdditionalRisk4', null, null, 1),
(15, null,N'AdditionalSubProcess5', N'AdditionalRisk5',null, null, 2),
(16, NULL, NULL,null,3, 6, 2),
(17, N'AdditionalCoreProcess7',N'AdditionalSubProcess7', N'AdditionalCoreRisk7',null,null, 3)

INSERT INTO [ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId])
VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(11, 6),
(11, 7),
(13, 8),
(14, 9),
(15, 10)

SET IDENTITY_INSERT [ChangeType] ON
INSERT INTO [ChangeType] ([Id], [Name])
VALUES
(1, N'ChangeType1'),
(2, N'ChangeType2'),
(3, N'ChangeType3'),
(4, N'ChangeType4'),
(5, N'ChangeType5'),
(6, N'ChangeType6'),
(7, N'ChangeType7'),
(8, N'ChangeType8'),
(9, N'ChangeType9'),
(10, N'ChangeType10')
SET IDENTITY_INSERT [ChangeType] OFF

SET IDENTITY_INSERT [FunctionChange] ON
INSERT INTO [FunctionChange] ([Id], [ChangeTime], [ChangeDescription], [ChangeType_Id])
VALUES
(1, '04/20/2016', N'ChangeDescription1', 1),
(2, '04/10/2016', N'ChangeDescription2', 2),
(3, '03/31/2016', N'ChangeDescription3', 3),
(4, '03/21/2016', N'ChangeDescription4', 4),
(5, '03/11/2016', N'ChangeDescription5', 5),
(6, '03/01/2016', N'ChangeDescription6', 6),
(7, '02/20/2016', N'ChangeDescription7', 7),
(8, '02/10/2016', N'ChangeDescription8', 8),
(9, '01/31/2016', N'ChangeDescription9', 9),
(10, '01/21/2016', N'ChangeDescription10', 10)
SET IDENTITY_INSERT [FunctionChange] OFF

INSERT INTO [PriorFunctionChanges] ([AssessmentId], [FunctionChangeId])
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(3, 8),
(3, 9),
(4, 10)

SET IDENTITY_INSERT [Percentage] ON
INSERT INTO [Percentage] ([Id], [Name], [Value])
VALUES
(1, N'0%', 0),
(2, N'10%', 10),
(3, N'20%', 20),
(4, N'30%', 30),
(5, N'40%', 40),
(6, N'50%', 50),
(7, N'60%', 60),
(8, N'70%', 70),
(9, N'80%', 80),
(10, N'90%', 90),
(11, N'100%', 100)
SET IDENTITY_INSERT [Percentage] OFF
SET IDENTITY_INSERT [KPISLAAssessment] ON
INSERT INTO [KPISLAAssessment] ([Id], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [Assessment_Id], [Category_Id], [KPICategory_Id])
VALUES
(11, N'AdditionalKPI1', N'AdditionalSLA1', 1, 1, 1,1,1),
(12, N'AdditionalKPI2', N'AdditionalSLA2', 2, 2, 1,1,1),
(13, NULL, NULL, NULL, NULL, 1,1,1),
(14, N'AdditionalKPI4', N'AdditionalSLA4', 4, 4, 1,1,2),
(15, N'AdditionalKPI5', N'AdditionalSLA5', 5, 5, 2,1,2),
(16, NULL, NULL, NULL, NULL, 2,1,1),
(17, N'AdditionalKPI7', N'AdditionalSLA7', 7, 7, 2,1,3),
(18, N'AdditionalKPI8', N'AdditionalSLA8', 8, 8, 3,1,1),
(19, NULL, NULL, NULL, NULL, 3,1,1),
(20, N'AdditionalKPI10', N'AdditionalSLA10', 10, 10, 4,1,3)
SET IDENTITY_INSERT [KPISLAAssessment] OFF
SET IDENTITY_INSERT [KeyControlsMaturity] ON
INSERT INTO [KeyControlsMaturity] ([Id], [Name])
VALUES
(1, N'KeyControlsMaturity1'),
(2, N'KeyControlsMaturity2'),
(3, N'KeyControlsMaturity3'),
(4, N'KeyControlsMaturity4'),
(5, N'KeyControlsMaturity5'),
(6, N'KeyControlsMaturity6'),
(7, N'KeyControlsMaturity7'),
(8, N'KeyControlsMaturity8'),
(9, N'KeyControlsMaturity9'),
(10, N'KeyControlsMaturity10')
SET IDENTITY_INSERT [KeyControlsMaturity] OFF

INSERT INTO [FutureFunctionChanges] ([AssessmentId], [FunctionChangeId])
VALUES
(1, 10),
(1, 9),
(1, 8),
(1, 7),
(2, 6),
(2, 5),
(2, 4),
(3, 3),
(3, 2),
(4, 1)

SET IDENTITY_INSERT [FunctionPerformedSite] ON
INSERT INTO [FunctionPerformedSite] ([Id], [Site_Id], [Percentage_Id], [Assessment_Id])
VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 3, 3, 1),
(4, 4, 4, 1),
(5, 5, 5, 2),
(6, 6, 6, 2),
(7, 7, 7, 2),
(8, 8, 8, 3),
(9, 9, 9, 3),
(10, 10, 10, 4)
SET IDENTITY_INSERT [FunctionPerformedSite] OFF

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(1, N'ControlType1'),
(2, N'ControlType2'),
(3, N'ControlType3'),
(4, N'ControlType4'),
(5, N'ControlType5'),
(6, N'ControlType6'),
(7, N'ControlType7'),
(8, N'ControlType8'),
(9, N'ControlType9'),
(10, N'ControlType10')
SET IDENTITY_INSERT [ControlType] OFF

SET IDENTITY_INSERT [ControlTrigger] ON
INSERT INTO [ControlTrigger] ([Id], [Name])
VALUES
(1, N'ControlTrigger1'),
(2, N'ControlTrigger2'),
(3, N'ControlTrigger3'),
(4, N'ControlTrigger4'),
(5, N'ControlTrigger5'),
(6, N'ControlTrigger6'),
(7, N'ControlTrigger7'),
(8, N'ControlTrigger8'),
(9, N'ControlTrigger9'),
(10, N'ControlTrigger10')
SET IDENTITY_INSERT [ControlTrigger] OFF

SET IDENTITY_INSERT [ControlFrequency] ON
INSERT INTO [ControlFrequency] ([Id], [Name])
VALUES
(1, N'ControlFrequency1'),
(2, N'ControlFrequency2'),
(3, N'ControlFrequency3'),
(4, N'ControlFrequency4'),
(5, N'ControlFrequency5'),
(6, N'ControlFrequency6'),
(7, N'ControlFrequency7'),
(8, N'ControlFrequency8'),
(9, N'ControlFrequency9'),
(10, N'ControlFrequency10')
SET IDENTITY_INSERT [ControlFrequency] OFF

SET IDENTITY_INSERT [ControlDesign] ON
INSERT INTO [ControlDesign] ([Id], [Name])
VALUES
(1, N'ControlDesign1'),
(2, N'ControlDesign2'),
(3, N'ControlDesign3'),
(4, N'ControlDesign4'),
(5, N'ControlDesign5'),
(6, N'ControlDesign6'),
(7, N'ControlDesign7'),
(8, N'ControlDesign8'),
(9, N'ControlDesign9'),
(10, N'ControlDesign10')
SET IDENTITY_INSERT [ControlDesign] OFF

SET IDENTITY_INSERT [ControlAssessment] ON
INSERT INTO [ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [ProcessControlAssessment_Id])
VALUES
(1, N'OtherControlType1', N'ControlObjective1', 1, 1, 1, 1),
(2, N'OtherControlType2', N'ControlObjective2', 2, 2, 2, 1),
(3, NULL, N'ControlObjective3', 3, 3, 3, 2),
(4, N'OtherControlType4', N'ControlObjective4', 4, 4, 4, 3),
(5, N'OtherControlType5', N'ControlObjective5', 5, 5, 5, 4),
(6, NULL, N'ControlObjective6',6, 6, 6, 11),
(7, N'OtherControlType7', N'ControlObjective7',  7, 7, 7, 11),
(8, N'OtherControlType8', N'ControlObjective8',  8, 8, 8, 11),
(9, NULL, N'ControlObjective9', 9, 9, 9, 13),
(10, N'OtherControlType10', N'ControlObjective10', 10, 10, 10, 14)
SET IDENTITY_INSERT [ControlAssessment] OFF

INSERT INTO [ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId])
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10)

INSERT INTO [ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId])
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10)

INSERT INTO [ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId])
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10)

-- 0: Owner
-- 1: BUFunctionalApprover
-- 2: BURiskManagementApprover
-- 3: DivisionalRiskManagementApprover
-- 4: Admin
INSERT INTO [ActionPermission] ([Role], [Action])
VALUES
(0, N'Assessment.CreateAsDraft'),
(0, N'Assessment.Update'),
(0, N'Assessment.Get'),
(0, N'Assessment.Search'),
(0, N'Assessment.ExportAssessment'),
(0, N'Assessment.Submit'),
(0, N'Assessment.GetOverallRiskRatingReport'),
(0, N'Assessment.GetOverallRiskRatingReport'),
(0, N'Assessment.GetDraftCount'),
(0, N'Assessment.GetAwaitingApprovalCount'),
(0, N'Assessment.GetApprovedCount'),
(0, N'Assessment.GetRejectedCount'),
(0, N'Assessment.GetDraftAssessments'),
(0, N'Assessment.GetAwaitingApprovalAssessments'),
(0, N'Assessment.GetApprovedAssessments'),
(0, N'Assessment.GetRejectedAssessments'),
(0, N'Lookup.GetAllBusinessUnits'),
(0, N'Lookup.GetAllDepartmentHeads'),
(0, N'Lookup.GetAllProducts'),
(0, N'Lookup.GetAllDepartments'),
(0, N'Lookup.GetAllAssessmentTypes'),
(0, N'Lookup.GetAllRiskExposures'),
(0, N'Lookup.GetAllCategories'),
(0, N'Lookup.GetAllLikelihoodOfOccurrences'),
(0, N'Lookup.GetAllRiskImpacts'),
(0, N'Lookup.GetKPICategories'),
(0, N'Lookup.GetAllProcessRisks'),
(0, N'Lookup.GetAllControlFrequencies'),
(0, N'Lookup.GetAllControlTriggers'),
(0, N'Lookup.GetAllKeyControlsMaturities'),
(0, N'Lookup.GetAllControlDesigns'),
(0, N'Lookup.GetAllTestingFrequencies'),
(0, N'Lookup.GetAllPercentages'),
(0, N'Lookup.GetFunctionalAreaOwners'),
(0, N'Lookup.GetFunctionalAreas'),
(0, N'Lookup.GetControlTypes'),
(0, N'Security.Login'),
(0, N'Security.RevokeToken'),
(1, N'Assessment.Get'),
(1, N'Assessment.Search'),
(1, N'Assessment.ExportAssessment'),
(1, N'Assessment.ExportAssessment'),
(1, N'Assessment.Approve'),
(1, N'Assessment.Reject'),
(1, N'Assessment.GetOverallRiskRatingReport'),
(1, N'Assessment.GetOverallRiskRatingReport'),
(1, N'Assessment.GetDraftCount'),
(1, N'Assessment.GetAwaitingApprovalCount'),
(1, N'Assessment.GetApprovedCount'),
(1, N'Assessment.GetRejectedCount'),
(1, N'Assessment.GetDraftAssessments'),
(1, N'Assessment.GetAwaitingApprovalAssessments'),
(1, N'Assessment.GetApprovedAssessments'),
(1, N'Assessment.GetRejectedAssessments'),
(1, N'Lookup.GetAllBusinessUnits'),
(1, N'Lookup.GetAllDepartmentHeads'),
(1, N'Lookup.GetAllProducts'),
(1, N'Lookup.GetAllDepartments'),
(1, N'Lookup.GetAllAssessmentTypes'),
(1, N'Lookup.GetAllRiskExposures'),
(1, N'Lookup.GetAllCategories'),
(1, N'Lookup.GetAllLikelihoodOfOccurrences'),
(1, N'Lookup.GetAllRiskImpacts'),
(1, N'Lookup.GetKPICategories'),
(1, N'Lookup.GetAllProcessRisks'),
(1, N'Lookup.GetAllControlFrequencies'),
(1, N'Lookup.GetAllControlTriggers'),
(1, N'Lookup.GetAllKeyControlsMaturities'),
(1, N'Lookup.GetAllControlDesigns'),
(1, N'Lookup.GetAllTestingFrequencies'),
(1, N'Lookup.GetAllPercentages'),
(1, N'Lookup.GetFunctionalAreaOwners'),
(1, N'Lookup.GetFunctionalAreas'),
(1, N'Lookup.GetControlTypes'),
(1, N'Security.Login'),
(1, N'Security.RevokeToken'),
(2, N'Assessment.Get'),
(2, N'Assessment.Search'),
(2, N'Assessment.ExportAssessment'),
(2, N'Assessment.ExportAssessment'),
(2, N'Assessment.Approve'),
(2, N'Assessment.Reject'),
(2, N'Assessment.GetOverallRiskRatingReport'),
(2, N'Assessment.GetOverallRiskRatingReport'),
(2, N'Assessment.GetDraftCount'),
(2, N'Assessment.GetAwaitingApprovalCount'),
(2, N'Assessment.GetApprovedCount'),
(2, N'Assessment.GetRejectedCount'),
(2, N'Assessment.GetDraftAssessments'),
(2, N'Assessment.GetAwaitingApprovalAssessments'),
(2, N'Assessment.GetApprovedAssessments'),
(2, N'Assessment.GetRejectedAssessments'),
(2, N'Lookup.GetAllBusinessUnits'),
(2, N'Lookup.GetAllDepartmentHeads'),
(2, N'Lookup.GetAllProducts'),
(2, N'Lookup.GetAllDepartments'),
(2, N'Lookup.GetAllAssessmentTypes'),
(2, N'Lookup.GetAllRiskExposures'),
(2, N'Lookup.GetAllCategories'),
(2, N'Lookup.GetAllLikelihoodOfOccurrences'),
(2, N'Lookup.GetAllRiskImpacts'),
(2, N'Lookup.GetKPICategories'),
(2, N'Lookup.GetAllProcessRisks'),
(2, N'Lookup.GetAllControlFrequencies'),
(2, N'Lookup.GetAllControlTriggers'),
(2, N'Lookup.GetAllKeyControlsMaturities'),
(2, N'Lookup.GetAllControlDesigns'),
(2, N'Lookup.GetAllTestingFrequencies'),
(2, N'Lookup.GetAllPercentages'),
(2, N'Lookup.GetFunctionalAreaOwners'),
(2, N'Lookup.GetFunctionalAreas'),
(2, N'Lookup.GetControlTypes'),
(2, N'Security.Login'),
(2, N'Security.RevokeToken'),
(3, N'Assessment.Get'),
(3, N'Assessment.Search'),
(3, N'Assessment.ExportAssessment'),
(3, N'Assessment.ExportAssessment'),
(3, N'Assessment.Approve'),
(3, N'Assessment.Reject'),
(3, N'Assessment.GetOverallRiskRatingReport'),
(3, N'Assessment.GetOverallRiskRatingReport'),
(3, N'Assessment.GetDraftCount'),
(3, N'Assessment.GetAwaitingApprovalCount'),
(3, N'Assessment.GetApprovedCount'),
(3, N'Assessment.GetRejectedCount'),
(3, N'Assessment.GetDraftAssessments'),
(3, N'Assessment.GetAwaitingApprovalAssessments'),
(3, N'Assessment.GetApprovedAssessments'),
(3, N'Assessment.GetRejectedAssessments'),
(3, N'Lookup.GetAllBusinessUnits'),
(3, N'Lookup.GetAllDepartmentHeads'),
(3, N'Lookup.GetAllProducts'),
(3, N'Lookup.GetAllDepartments'),
(3, N'Lookup.GetAllAssessmentTypes'),
(3, N'Lookup.GetAllRiskExposures'),
(3, N'Lookup.GetAllCategories'),
(3, N'Lookup.GetAllLikelihoodOfOccurrences'),
(3, N'Lookup.GetAllRiskImpacts'),
(3, N'Lookup.GetKPICategories'),
(3, N'Lookup.GetAllProcessRisks'),
(3, N'Lookup.GetAllControlFrequencies'),
(3, N'Lookup.GetAllControlTriggers'),
(3, N'Lookup.GetAllKeyControlsMaturities'),
(3, N'Lookup.GetAllControlDesigns'),
(3, N'Lookup.GetAllTestingFrequencies'),
(3, N'Lookup.GetAllPercentages'),
(3, N'Lookup.GetFunctionalAreaOwners'),
(3, N'Lookup.GetFunctionalAreas'),
(3, N'Lookup.GetControlTypes'),
(3, N'Security.Login'),
(3, N'Security.RevokeToken'),
(4, N'Assessment.CreateAsDraft'),
(4, N'Assessment.Update'),
(4, N'Assessment.Get'),
(4, N'Assessment.Search'),
(4, N'Assessment.ExportAssessment'),
(4, N'Assessment.ExportAssessment'),
(4, N'Assessment.Submit'),
(4, N'Assessment.Approve'),
(4, N'Assessment.Reject'),
(4, N'Assessment.GetOverallRiskRatingReport'),
(4, N'Assessment.GetOverallRiskRatingReport'),
(4, N'Assessment.GetDraftCount'),
(4, N'Assessment.GetAwaitingApprovalCount'),
(4, N'Assessment.GetApprovedCount'),
(4, N'Assessment.GetRejectedCount'),
(4, N'Assessment.GetDraftAssessments'),
(4, N'Assessment.GetAwaitingApprovalAssessments'),
(4, N'Assessment.GetApprovedAssessments'),
(4, N'Assessment.GetRejectedAssessments'),
(4, N'Lookup.GetAllBusinessUnits'),
(4, N'Lookup.GetAllDepartmentHeads'),
(4, N'Lookup.GetAllProducts'),
(4, N'Lookup.GetAllDepartments'),
(4, N'Lookup.GetAllAssessmentTypes'),
(4, N'Lookup.GetAllRiskExposures'),
(4, N'Lookup.GetAllCategories'),
(4, N'Lookup.GetAllLikelihoodOfOccurrences'),
(4, N'Lookup.GetAllRiskImpacts'),
(4, N'Lookup.GetKPICategories'),
(4, N'Lookup.GetAllProcessRisks'),
(4, N'Lookup.GetAllControlFrequencies'),
(4, N'Lookup.GetAllControlTriggers'),
(4, N'Lookup.GetAllKeyControlsMaturities'),
(4, N'Lookup.GetAllControlDesigns'),
(4, N'Lookup.GetAllTestingFrequencies'),
(4, N'Lookup.GetAllPercentages'),
(4, N'Lookup.GetFunctionalAreaOwners'),
(4, N'Lookup.GetFunctionalAreas'),
(4, N'Lookup.GetControlTypes'),
(4, N'Security.Login'),
(4, N'Security.RevokeToken'),
(0, N'Lookup.GetCoreProcesses'),
(1, N'Lookup.GetCoreProcesses'),
(2, N'Lookup.GetCoreProcesses'),
(3, N'Lookup.GetCoreProcesses'),
(4, N'Lookup.GetCoreProcesses')
SET NOCOUNT OFF

INSERT INTO [CoreProcess_ControlType]([CoreProcessId],[ControlTypeId])
VALUES
(1,1),
(1,2),
(1,3),
(2,2),
(2,3),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,9),
(10,10);

INSERT INTO [ProcessRisk_ControlType]([ProcessRiskId], [ControlTypeId])
VALUES
(1,1),
(1,2),
(1,3),
(2,2),
(2,3),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,9),
(10,10);