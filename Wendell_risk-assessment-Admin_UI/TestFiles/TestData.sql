SET NOCOUNT ON
SET DATEFORMAT mdy

Declare @CoeusOwnerUser1 NVARCHAR(200);
Declare @BUFuncApprover1 NVARCHAR(200);
Declare @BUFuncApprover2 NVARCHAR(200);
Declare @BUFuncApprover3 NVARCHAR(200);
Declare @BURiskManApprover1 NVARCHAR(200);
Declare @BURiskManApprover2 NVARCHAR(200);
DECLARE @DivisionalManApprover1 NVARCHAR(200);

SET @CoeusOwnerUser1='CoeusOwnerUser1'; -- this is required and should be valid user
SET @BUFuncApprover1='CoeusBUFuncApp1'; -- this is required and should be valid user
SET @BUFuncApprover2='CoeusBUFuncApp2';
SET @BUFuncApprover3='CoeusBUFuncApp3';
SET @BURiskManApprover1='CoeusRiskManager'; -- this is required and should be valid user
SET @BURiskManApprover2='CoeusRiskManager2';
SET @DivisionalManApprover1='CoeusDivManager'; -- this is required and should be valid user

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

SET IDENTITY_INSERT [KeyControlsMaturity] ON
INSERT INTO [KeyControlsMaturity] ([Id], [Name])
VALUES
(1, 'Well Developed'),
(2, 'Partially Developed/Requires Improvement'),
(3, 'Under Developed/Weak')
SET IDENTITY_INSERT [KeyControlsMaturity] OFF

SET IDENTITY_INSERT [BusinessUnit] ON
INSERT INTO [BusinessUnit] ([Id], [Name])
VALUES
(1, N'Annuities'),
(2, N'Insurance'),
(3, N'Investments/JHSS'),
(4, N'RPS'),
(5, N'Shared Services')
SET IDENTITY_INSERT [BusinessUnit] OFF

SET IDENTITY_INSERT [Product] ON
INSERT INTO [Product] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'Fixed Annuity', 1),
(2, N'PAR', 1),
(3, N'Structured Settlements', 1),
(4, N'Variable Annuity', 1),
(5, N'Life', 2),
(6, N'LTC', 2),
(7, N'Life w/LTC rider', 2),
(8, N'Mutual Funds', 3),
(9, N'Signature', 4),
(10, N'TRS/Enterprise', 4),
(11, N'Annuities', 5),
(12, N'Insurance', 5),
(13, N'Signator', 5),
(14, N'Safe Access Account', 5)
SET IDENTITY_INSERT [Product] OFF

SET IDENTITY_INSERT [Department] ON
INSERT INTO [Department] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'Annuities Administration', 1),
(2, N'Client Output Services, eDelivery & Vendor Management', 1),
(3, N'Dealer & Institutional Services', 1),
(4, N'Institutional Contract Services', 1),
(5, N'Intake Operatioins & Business Solutions', 1),
(6, N'Financial Control', 2),
(7, N'Claims', 2),
(8, N'New Business Operations', 2),
(9, N'Policy Holder Services', 2),
(10, N'Operational Risk Management', 2),
(11, N'Compliance (Cmpl)', 3),
(12, N'Product Support (PdSp)', 3),
(13, N'Adjustments (Adj)', 3),
(14, N'Service Operations (SvOp)', 3),
(15, N'Correspondence (Corr)', 3),
(16, N'Dealer & Institutional Services (DlSv)', 3),
(17, N'Client Output Services (COS)', 3),
(18, N'Control (Cntl)', 3),
(19, N'Business Support Services (BSS)', 3),
(20, N'Finance (Fin)', 3),
(21, N'Vendor Management (VdMg)', 3),
(22, N'Business Administration Group', 4),
(23, N'Defined Benefit Operations, Trading Operations, Technical Support and Ops Mgmt Information', 4),
(24, N'Implementations and Enterprise/TRS Client Services', 4),
(25, N'Operations Risk Management', 4),
(26, N'Process Improvement', 4),
(27, N'Signature Client Services, Participant Services and Ops Learning & Comm', 4),
(28, N'Strategic Planning & Projects', 4),
(29, N'Intake Operatioins & Business Solutions', 5),
(30, N'Shared Services Administration', 5),
(31, N'Shared Services Contact Center', 5),
(32, N'Signator Shared Services', 5)
SET IDENTITY_INSERT [Department] OFF

SET IDENTITY_INSERT [DepartmentHead] ON
INSERT INTO [DepartmentHead] ([Id], [Name], [BusinessUnitId])
VALUES
(1, @BUFuncApprover1, 1),
(2, @BUFuncApprover2, 1),
(3, @BUFuncApprover3, 1),
(4, @BUFuncApprover1, 2),
(5, @BUFuncApprover2, 2),
(6, @BUFuncApprover3, 2),
(7, @BUFuncApprover1, 3),
(8, @BUFuncApprover2, 3),
(9, @BUFuncApprover3, 3),
(10, @BUFuncApprover1, 4),
(11, @BUFuncApprover2, 4),
(12, @BUFuncApprover3, 5)
SET IDENTITY_INSERT [DepartmentHead] OFF

SET IDENTITY_INSERT [FunctionalArea] ON
INSERT INTO [FunctionalArea] ([Id], [Name], [BusinessUnitId])
VALUES
(1, N'Account Maintenance', 1),
(2, N'Annuitizations', 1),
(3, N'Annuity Business Automation', 1),
(4, N'Benefits', 1),
(5, N'Client Output Services', 1),
(6, N'Commissions', 1),
(7, N'Contract Administration', 1),
(8, N'Contract Financial Reporting', 1),
(9, N'Contract Research & Accounting', 1),
(10, N'Death Benefit Administration (Fixed)', 1),
(11, N'Death Benefit Administration (Retail)', 1),
(12, N'Disbursements', 1),
(13, N'Inforce', 1),
(14, N'Licensing', 1),
(15, N'Reclaim & Cash Control', 1),
(16, N'Reconciliation', 1),
(17, N'Structured Settlements', 1),
(18, N'Tax & Adjustment', 1),
(19, N'Accounts Payable  and Control, Debt Management', 2),
(20, N'Care Management', 2),
(21, N'Collections - Life Renewal & Group LTC', 2),
(22, N'Collections - Retail LTC', 2),
(23, N'Complex LTC', 2),
(24, N'Control', 2),
(25, N'Core LTC', 2),
(26, N'Disbursements & Distribution', 2),
(27, N'Front End', 2),
(28, N'GLTC Account', 2),
(29, N'Group Trust Admin', 2),
(30, N'Illustrations', 2),
(31, N'Initial Payments', 2),
(32, N'Issue', 2),
(33, N'Licensing', 2),
(34, N'Life Claims', 2),
(35, N'Life Special Billing', 2),
(36, N'LTC Claims - Adjudication', 2),
(37, N'LTC Claims - Appeals', 2),
(38, N'LTC Claims - Benefit Eligibility', 2),
(39, N'LTC Claims - Benefit Eligibility QA', 2),
(40, N'LTC Claims - Boston Payment', 2),
(41, N'LTC Claims - Business Integrity Unit', 2),
(42, N'LTC Claims - Claim Initiation Unit', 2),
(43, N'LTC Claims - Clinical Thought Leadership', 2),
(44, N'LTC Claims - Complaints, Internal Audit, Market Conduct', 2),
(45, N'LTC Claims - Payment Quality Assurance', 2),
(46, N'LTC Claims - Policy Oversight', 2),
(47, N'LTC Claims - Provider Eligibility', 2),
(48, N'LTC Claims - Service Process Improvement', 2),
(49, N'LTC Claims - Training & Change Readiness', 2),
(50, N'NBCC', 2),
(51, N'Policy Change', 2),
(52, N'Product Consultation', 2),
(53, N'Registry', 2),
(54, N'Replacements', 2),
(55, N'Re-Rate Program', 2),
(56, N'Risk Management', 2),
(57, N'Specialty Products & Distribution', 2),
(58, N'System Consultation', 2),
(59, N'Tax Production', 2),
(60, N'Titles', 2),
(61, N'Cmpl - Administrative Matters', 3),
(62, N'Cmpl - AML/ATF', 3),
(63, N'Cmpl - Fingerprinting', 3),
(64, N'Cmpl - Fraud', 3),
(65, N'Cmpl - Frequent Trading', 3),
(66, N'Cmpl - ID Administration', 3),
(67, N'Cmpl - Lost Shareholder Searches', 3),
(68, N'Cmpl - Escheatment', 3),
(69, N'Cmpl - Withholding Filings', 3),
(70, N'Cmpl - Retirement Plan Documents', 3),
(71, N'Cmpl - Information Reporting', 3),
(72, N'Cntl - Blue Sky', 3),
(73, N'Cntl - Dividend Processing', 3),
(74, N'Cntl - Half Penny Breakage', 3),
(75, N'Cntl - Commission', 3),
(76, N'Cntl - Trail Commission', 3),
(77, N'Cntl - Withholding Remittance', 3),
(78, N'Cntl - Pricing', 3),
(79, N'Cntl - Cap Stock', 3),
(80, N'Cntl - Wires and Manual Checks', 3),
(81, N'Cntl - DDA Reconciliation', 3),
(82, N'DlSv - Financial Transactions', 3),
(83, N'DlSv - Non-Financial Transactions', 3),
(84, N'DlSv - DTCC Cusip Setup', 3),
(85, N'DlSv - MF Profile II', 3),
(86, N'DlSv - UFID Settings', 3),
(87, N'DlSv - Omnibus Firms', 3),
(88, N'DlSv - CIP', 3),
(89, N'DlSv - Late Trading', 3),
(90, N'DlSv - Social Code Review', 3),
(91, N'SvOp - Financial & Non-Financial Transactions', 3),
(92, N'SvOps - Contact Center', 3),
(93, N'COS - Prospectus Refresh', 3),
(94, N'COS - Prospectus PSI', 3),
(95, N'COS - Confirms/Statements/Checks', 3),
(96, N'COS - Regulatory Mailings', 3),
(97, N'PdSp - System Updates', 3),
(98, N'Fin - Invoice Processing', 3),
(99, N'Fin - TA Monthly Invoice', 3),
(100, N'Fin - Expense Accrual', 3),
(101, N'Adj - Financial Transactions', 3),
(102, N'Adj - Non-Financial Transactions', 3),
(103, N'Adj - Adtrans', 3),
(104, N'Adj - LOI Recalculations', 3),
(105, N'Adj - B to A Roll Kickers', 3),
(106, N'Adj - Bad Price Processing', 3),
(107, N'Adj - Tax Lot Maintenance', 3),
(108, N'BSS - ID Administration', 3),
(109, N'BSS - FI Data Match', 3),
(110, N'New Business/New Contract Set-up', 4),
(111, N'Contract Data Changes Managed by Operations', 4),
(112, N'Broker Set-up and Maintenance', 4),
(113, N'RIA Set-up and Maintenance', 4),
(114, N'Contract Data Changes - Managed by Pricing', 4),
(115, N'Cash Receipts', 4),
(116, N'Participant Account Set-up and Maintenance', 4),
(117, N'Disbursements', 4),
(118, N'PERA administration', 4),
(119, N'Participant Services', 4),
(120, N'Corrections', 4),
(131, N'Valuation of Sub-account units', 4),
(132, N'Purchases and Sales of Investments', 4),
(133, N'Contract Reporting - Error Handling', 4),
(134, N'Participant Reporting - Production ', 4),
(135, N'Loans', 4),
(136, N'Trustee Fees', 4),
(137, N'Contact Management', 4),
(138, N'Allocation Processing', 4),
(139, N'Contract Discontinuance/Termination', 4),
(140, N'Operations Compliance', 4),
(141, N'Plan Data', 4),
(142, N'Participant Census Data', 4),
(143, N'US WA Business Procedures', 4),
(144, N'Tax form production (1099R, etc)', 4),
(145, N'Payroll Services', 4),
(146, N'Abandoned Property', 5),
(147, N'Annuities & Fixed Products Contact Center', 5),
(148, N'BD Operations & MBPS Governance', 5),
(149, N'Data Integrity', 5),
(150, N'Death Match', 5),
(151, N'Indexing', 5),
(152, N'Licensing, Contracting & Compensation', 5),
(153, N'Life Insurance Contact Center', 5),
(154, N'LTC Contact Center', 5),
(155, N'Metrics Reporting & Risk Management', 5),
(156, N'Records Management & Imaging Services', 5),
(157, N'Returned Mail (RPO)', 5),
(158, N'JH Commitment', 5),
(159, N'Safe Access Account', 5),
(160, N'Shared Services Control', 5),
(161, N'Thorough Search', 5),
(162, N'TIN Match', 5),
(163, N'Unclaimed Property Remittance', 5)
SET IDENTITY_INSERT [FunctionalArea] OFF

SET IDENTITY_INSERT [TestingFrequency] ON
INSERT INTO [TestingFrequency] ([Id], [Name])
VALUES
(1, 'Business Area - Ad Hoc'),
(2, 'Business Area - Daily'),
(3, 'Business Area - Weekly'),
(4, 'Business Area - Monthly'),
(5, 'Business Area - Quarterly'),
(6, 'Business Area - Semi-Annual'),
(7, 'Business Area - Annual or Greater'),
(8, 'Compliance - Monthly'),
(9, 'Compliance - Quarterly'),
(10, 'Compliance - Semi-Annual'),
(11, 'Compliance - Annual or Greater'),
(12, 'Internal Audit - Annual or Greater'),
(13, 'External - Monthly'),
(14, 'External - Quarterly'),
(15, 'External - Semi-Annual'),
(16, 'External - Annual or Greater'),
(17, 'Not Tested')
SET IDENTITY_INSERT [TestingFrequency] OFF

SET IDENTITY_INSERT [KPICategory] ON
INSERT INTO [KPICategory] ([Id], [Name])
VALUES
(1, N'Telephony'),
(2, N'Transactional Timeliness'),
(3, N'Utilization'),
(4, N'Quality'),
(5, N'Customer Centricity')
SET IDENTITY_INSERT [KPICategory] OFF

SET IDENTITY_INSERT [KPI] ON
INSERT INTO [KPI] ([Id], [Name],[KPICategory_Id])
VALUES
(1, N'Answer Rate', 1),
(2, N'Abandoned Rate',1),
(3, N'IVR Containment Rate',1),
(4, N'Occupancy Rate',1),
(5, N'Individual Productivity',3),
(6, N'Individual Accuracy', 4),
(7, N'Call Surveys (CSAT)', 5)
SET IDENTITY_INSERT [KPI] OFF

SET IDENTITY_INSERT [SLA] ON
INSERT INTO [SLA] ([Id], [Name], [KPICategory_Id])
VALUES
(1, N'90%', 1),
(2, N'85%', 1),
(3, N'80%', 1),
(4, N'30%', 1),
(5, N'<3%', 1),
(7, N'Not applicable', 1),
(8, N'Same day',2),
(9, N'1-2 days',2),
(10,N'3-5 days',2),
(11,N'30 days',2),
(12,N'90% in 5 days',2),
(13,N'90% in 6 hours',2),
(14,N'90% in 60 minutes',2),
(15,N'% of payments in inventory by days (15/30 days)',2),
(16,N'Letters every 30 days',2),
(17,N'Phone/emails every 15 days',2),
(19,N'Not applicable',2),
(20, N'95%', 3),
(21, N'90%', 3),
(22, N'180 plans to one representative', 3),
(24, N'Not Applicable', 3),
(25, N'99%', 4),
(26, N'98%', 4),
(27, N'95%', 4),
(28, N'90%', 4),
(29, N'95%', 4),
(30, N'90%', 4),
(32, N'Not applicable', 4),
(33, N'XX% Satisfied', 5),
(34, N'Net Promoter Score of X', 5),
(35, N'Customer Effort Score of X', 5),
(37, N'Not Applicable', 5)
SET IDENTITY_INSERT [SLA] OFF

SET IDENTITY_INSERT [Site] ON
INSERT INTO [Site] ([Id], [Name])
VALUES
(1, N'Boston'),
(2, N'Cebu'),
(3, N'Manila'),
(4, N'Parsippany'),
(5, N'Portsmouth'),
(6, N'Toronto'),
(7, N'Westwood')
SET IDENTITY_INSERT [Site] OFF

SET IDENTITY_INSERT [RiskImpact] ON
INSERT INTO [RiskImpact] ([Id], [Name])
VALUES
(1, N'Financial'),
(2, N'Operational'),
(3, N'Regulatory'),
(4, N'Reputational'),
(5, N'Not applicable')
SET IDENTITY_INSERT [RiskImpact] OFF

SET IDENTITY_INSERT [RiskExposure] ON
INSERT INTO [RiskExposure] ([Id], [Name])
VALUES
(1, N'Low'),
(2, N'Medium'),
(3, N'High')
SET IDENTITY_INSERT [RiskExposure] OFF

SET IDENTITY_INSERT [Category] ON
INSERT INTO [Category] ([Id], [Name])
VALUES
(1, N'KPI''s / SLA''s'),
(2, N'Functional Area Processes'),
(3, N'Corporate & Divisional Training'),
(4, N'Business Continuity & Disaster Recovery'),
(5, N'Records Management'),
(6, N'Information Security'),
(7, N'Data Privacy & Protection')
SET IDENTITY_INSERT [Category] OFF

SET IDENTITY_INSERT [CoreProcess] ON
INSERT INTO [CoreProcess] ([Id], [Name], [FunctionalAreaId], [Category_Id])
VALUES
(1, N'Policies and procedures', 1, 2),
(2, N'Death notification and validation', 1, 2),
(3, N'BU notification of death', 1, 2),
(4, N'Death logic verification', 1, 2),
(5, N'Additional',1, 2),
(371, N'Validated', 37, 2),
(372, N'Not Validated', 37, 2),
(373, N'Provider Eligibility (PE) Determination', 37, 2),
(374, N'Benefit Eligibility (BE) Determination', 37, 2),
(375, N'Independent Third Party (ITP) Review', 37, 2),
(376, N'State Reporting', 37, 2),
(378, N'Additional',37, 2),
(221, N'Manage Transactions in Workflow Systems',22, 2),
(222, N'Payment Validation',22, 2),
(223, N'Process Payment',22, 2),
(224, N'Daily Reconciliation',22, 2),
(225, N'Process an eTreasury  Entry (Payment Processing, Rejected Payment, Check Stop / Reissue)',22, 2),
(226, N'Suspense / Clearing Maintenance',22, 2),
(227, N'Bank Draft Add / Change',22, 2),
(228, N'Check Stop Pay',22, 2),
(229, N'List Bill Add / Change',22, 2),
(2210, N'Create Manual Bill',22, 2),
(2211, N'Bank Account Maintenance',22, 2),
(2212, N'Billing Maintenance',22, 2),
(2213, N'Rejected Payments',22, 2),
(2214, N'Automated Feeds (EFT, Auto Lockbox/ERS)',22, 2),
(2215, N'List Bill Payments',22, 2),
(2216, N'Refunds',22, 2),
(2217, N'Additional',22, 2),
(911, N'Authentication',91, 2),
(912, N'Financial Transaction Processing',91, 2),
(913, N'Non-Financial Transaction Processing',91, 2),
(914, N'Customer Correspondence',91, 2),
(915, N'Additional',91, 2),
(111, N'Death notification',150, 2),
(112, N'Death record validation',150, 2),
(113, N'BU Confirmed Death Matches (Eligible for Thorough Search)',150, 2),
(114, N'BU Confirmed Death Matches (Ineligible for Thorough Search)',150, 2),
(115, N'Additional',150, 2),
(1611, N'Perform beneficiary outreach',161, 2),
(1612, N'BU notification of outreach results',161, 2),
(1613, N'State Reporting Requirements',161, 2),
(1614, N'Additional',161, 2);
SET IDENTITY_INSERT [CoreProcess] OFF

SET IDENTITY_INSERT [SubProcessRisk] ON
INSERT INTO [SubProcessRisk] ([Id], [Name], [Risk], [CoreProcess_Id])
VALUES
(1, N'Document policies and procedures', N'Out of date or lack of policies and procedures', 1),
(2, N'Verification of internal UCI and Lexis Nexis death files prior to AWD RIP job for processing', N'Old or inaccurate files in the workflow', 2),
(3, N'Scrub internal UCI and Lexis Nexis death files and create AWD RIP job for processing', N'Previously reported deaths added to the workflow causing confusion and unnecessary work', 2),
(4, N'Check admin system and AWD to confirm if the deceased is a JH client, has inactive account, and if there is a pending or completed claim', N'Wrongful terminations, customer service issues and financial impacts to company', 2),
(5, N'Perfom 2nd validation of death using an external resource', N'Increase in false positive death matches', 2),
(6, N'If death is confirmed, suspend systematic payments in admin systems and place contracts in a non-paying status', N'Client could still be receiving payments after death', 3),
(7, N'Update the AWD work item status based on reasearch and work is forwarded to Operations for processing', N'Work routed to the wrong workflow queue', 3),
(8, N'Test the accuracy of Lexis Nexis death match logic', N'Incarease in false positives death matches', 4)
SET IDENTITY_INSERT [SubProcessRisk] OFF

--Business Unit:  Insurance	Functional Area:  LTC Appeals
INSERT INTO [SubProcessRisk] ([Name], [Risk], [CoreProcess_Id])
VALUES
(N'Appeal documentation received from insured/ responsibility party and scanned into Promise work queue', N'Appeal documentation scanned incorrectly impacting timeliness and customer experience', 371),
(N'Appeal validated and acknowledgment letter triggered', N'May not meet compliance requirements, customer experience impacted', 371),
(N'Appeal validated for provider eligibility and triggered to Provider Eligibility team for determination', N'Use of email as work queue and communication vehicle', 371),
(N'Enter claim data (BE / PE) in appeal database (Access)', N'Incorrect data entered misrepresenting claim results. Not meeting state reporting requirement', 371),
(N'Appeal documentation received from insured/ responsibility party and scanned into Promise work queue', N'Appeal documentation scanned incorrectly impacting timeliness and customer experience', 372),
(N'Appeal reviewed, not validated', N'Incorrect determination impacting customer experience', 372),
(N'Create task for new claim in Promise or Beacon system, triggering work item to Escalation team', N'For Promise system claims, there needs to be coordination with the Beacon system for routing to Escalation team', 372),
(N'Appeal Coordinator review based on appeal information, request add''l info if needed', N'Untimely delays in reviewing and obtaining additional information', 373),
(N'Appeal Coordinator renders decision and communicates to BE Coordinator', N'Untimely determination, determination not reviewed by appropriate committee', 373),
(N'Appeal Coordinator review based on appeal information, request add''l info if needed', N'Untimely delays in reviewing and obtaining additional information', 374),
(N'Check policy provisions to determine if an individual or committee review is required', N'Policy provisions not satisfied', 374),
(N'Appeal Coordinator renders decision or forwards for committee review', N'Untimely determination, determination not reviewed by appropriate committee', 374),
(N'Committee Modified Review - email summary and voting by committee (uphold / overturn / add''l information / request Committee review)', N'Untimely determination leading to a customer complaint or policy provisions not met', 374),
(N'Committee Review – appeal data presented and committee determination made (uphold / overturn / add''l information)', N'Untimely determination leading to a customer complaint or policy provisions not met', 374),
(N'Enter BE/PE determination data in appeal database (Access)', N'Incorrect data entered misrepresenting claim results. Not meeting state reporting requirement', 374),
(N'Policyholder communication, including independent third party review information, if applicable', N'Wrong template (upheld / overturned), Risk of privacy breach, Untimely determination, ITP language not included', 374),
(N'Update notes in system', N'Current status/information is not available in system', 374),
(N'Customer initiates ITP review, Appeals Coordinator uploads claim file to ITP website', N'Non-compliance with state guidelines', 375),
(N'Send customer acknowledgment letter that ITP has been triggered', N'Customer experience impacted', 375),
(N'ITP communicates decision to company (uphold / overturn)', N'Non-compliance with state guidelines', 375),
(N'Email communication to care management, payment, and provider teams to approve claim in system', N'Use of email as work queue and communication vehicle', 375),
(N'Annual reporting of the # of independent 3rd party reviews done for the State of Colorado', N'Non-compliance with state guidelines', 376)
--Business Unit: Insurance	Functional Area: Retail LTC Collections
INSERT INTO [SubProcessRisk] ([Name], [Risk], [CoreProcess_Id])
VALUES
(N'Create/access work items', N'Check that exists in AWD but not in CSC will never be processed, Delay > Unintended lapse, AWD / CSC Out of sync, Indexing errors, Potential data integrity, indexing, & imaging issues, Workflow systems (AWD, CSC) out of sync', 221),
(N'Leave notes in appropriate systems and close work item', N'Customer service may not be able to explain transaction if it is not documented via processor notes, Off-workflow processes have no other record, Not closed, closed with incorrect status, Cannot be closed due to system issue', 221),
(N'Evaluate check (If NIGO check (Signature, date, legal/numeric, payee) or unidentifiable, return to payor)', N'NIGO instrument, Unaffiliated remitter, AML/ATF, List bill issues, Make wrong decision', 222),
(N'Evaluate payment (If IGO payment amount, apply to pay premium in admin system; If NIGO payment amount, apply to suspense, send balance due; If misdirected, inform BFDS to rescan to correct department; If unidentified, create letter and inform BFDS to return to sender)', N'Policy status decisions, Unable to identify correct policy, Not processed in a timely manner, Misidentify department, Processing delays, BFDS rescan error, Check could have been identified, was not, Error on return letter, Returned check to wrong address', 222),
(N'Input check amount in AWD and mark for deposit', N'Wrong amount input, resulting in wrong amount being withdrawn from client account', 223),
(N'Apply payment in LifePro/PNO', N'Funds applied incorrectly, refunded in error, misallocated between spouses, Retention of funds in error, Wrong amount input, Payment applied 0x or 2x, Funds applied to suspense but not to pay premium, Funds applied to wrong suspense account', 223),
(N'Reallocate funds if applicable', N'Refund / partial refund in error, Funds transferred to wrong policy, Transfer reversal error, resulting in presence of erroneous balance, Incorrect mode/frequency is applied in error', 223),
(N'Maintain check log in shared drive', N'Incorrect or missing items will add time to reconciliation', 224),
(N'Import admin system payment detail', N'Data may not be accessible', 224),
(N'Compare adjusted totals (admin system vs. check log) less any adjustments', N'Error in adjustments will compromise result', 224),
(N'Correct errors in admin system and/or on check log', N'Accounting variances, Incorrect amount applied to customer policy, Write-offs', 224),
(N'Select template, input required information, submit cash accounting entry', N'Wrong account, accounting variances, write-offs. Wrong business unit. Wrong transaction type. Will not show up for approval if not in correct status, leading to delays or complaints', 225),
(N'Select template, input required information, submit entry (check / wire)', N'Wrong account, accounting variances, write-offs. Wrong business unit. Wrong transaction type. Funds disbursed to wrong customer. Will not show up for approval if not in correct status, leading to delays or complaints', 225),
(N'Identify open item from admin report, Trecs, Control database and correct / apply / refund', N'Reports occasionally unavailable or delayed, so an entire batch of new suspense items can go un-reviewed. Import process is semi-manual, possible to lose existing commentary (not a system of record). Off workflow process. Wrong decision could lead to complaint or expense. Delayed processing could lead to complaint', 226),
(N'Send balance due letter if applicable', N'Wrong amount on balance due letter. Policy will not be paid', 226),
(N'Determine IGO / NIGO for ACH form (If NIGO, send letter to client)', N'Form could be submitted without voided check. Account could be of unsupported type. Account provided may not be owned by insured. Wrong info in policy number or account # fields can results in unauthorized drafts from unrelated 3rd parties', 227),
(N'Add/update bank information in LifePro', N'Typo in account # / routing #. Mode/frequency change error. Change made to wrong policy', 227),
(N'Locate check in eTreasury, determine status', N'Insufficient info to locate check. Misidentification of unrelated check for same amount. Check may predate existing archive range. Check may be cashed, stopped, or stale dated. Check may have already been reissued, request could actually pertain to replacement check rather than imaged check', 228),
(N'If check is stale dated, close CSCS work item and route to Shared Services Abandoned Property via email', N'Email not sent. Not traceable after being closed in CSC', 228),
(N'If check is not stale dated, or is stale dated but needs to be reapplied to the policy, stop the check', N'Wrong clearing account. Stop request is declined b/c payee cashes it during process. Check reissued before stop is confirmed', 228),
(N'Update policy in LifePro', N'Processing error could result in incorrect billing, leading to complaint or expense', 229),
(N'Send notification letter', N'Policy may lapse without client''s knowledge since bills don''t go out when billing is suspended', 229),
(N'Determine correct premium amount based on data in admin system', N'Manual process leads to miscalculation of bills (Processor doesn''t subtract suspense, doesn''t take future rerate into account, miscalculates pro-rated amount, etc.)', 2210),
(N'Send manual bill in CSC or collections letters database', N'Bad/non-current address, particularly if processed before accompanying address change request. Typo / error in name, address, date, amount, etc. Use of non-standard correspondence. Provides wrong return address. Wrong amount (suspense not included)', 2210),
(N'Obtain bank account (Citibank, JPM Chase) open item lists from Treasury', N'Potentially many different bank accounts have activity for a single functional area. Most analysts are at MBPS so distribution can be delayed by holiday asymmetry, service outage', 2211),
(N'Review open items and take action on items greater than 7 days', N'Failure to identify variances in a timely manner can lead to profit/loss exposure. Client payments not applied in a timely manner. Misidentification of transaction; accounts can have activity for multiple functional areas. Variances highlight processing errors that need to be corrected in a timely manner. Maintenance can be relatively complex and require an experienced staff member', 2211),
(N'Retrieve / parse source reports', N'Report requires substantial modification via pre-existing logic. If assumptions change and the logic does not, policies requiring review could be missed', 2212),
(N'Notify other areas of suspended / overdue policies', N'Users might not reactive billing promptly, or at all', 2212),
(N'Review out-of-standard items', N'If items are not reviewed at all, billing can remain suspended indefinitely. If items are not reviewed promptly, restoring billing to standard is a manual process. Suspended items do not lapse, leading to Claims exposure, Financial reporting errors, and customer service issues. Criteria is arbitrary (90 days for list bills, 70 days for individual policies). Policies can appear to be years overdue while being actively worked on. List bill policies will never lapse without manual intervention. Customer service risk when billing policy far in arrears. Gain/loss exposure when trying to recover premium in arrears', 2212),
(N'Send required correspondence', N'Increased risk of bad/non-current address on policies that haven''t been billed recently. Increased potential for error as all billings are manual', 2212),
(N'After evaluation, make determination and activate billings', N'Policy will lapse in error. Multiple EFT withdrawals. Policy can continue to suspend due to validation errors', 2212),
(N'Monitor source reports', N'Notifications must be actively sought. Some transactions do not include notifications. Off workflow process', 2213),
(N'Reverse payment in admin system', N'Reverse wrong payment. Accounting variances. Reverse payment twice or not at all. Reverse only part of multi-policy payment', 2213),
(N'Change mode and lock premium if necessary', N'Duplicate drafts due to incorrect mode. Draft/bill incorrect amount', 2213),
(N'Send correspondence', N'Correspondence is manual; possible typos / miscalculations', 2213),
(N'Review and validate automated feeds', N'File can be out of balance, not sent at all. Duplicate feed', 2214),
(N'Correct any errors identified in the feed', N'Delay in applying funds to client accounts while correction is in process', 2214),
(N'Evaluate check (If NIGO check (Signature, date, legal/numeric, payee) or unidentifiable, return to payor) ', N'NIGO instrument. Unaffiliated remitter. Anti-Money Laundering/Anti-Terrorist Financing', 2215),
(N'Evaluate payment (If IGO payment amount, apply to pay premium in admin system; If NIGO payment amount, seek guidance from payor contact; If misdirected, inform BFDS to rescan to correct department; If unidentified, create letter and inform BFDS to return to sender; Locate list bill Billing Control Number (BCN) in admin system, If BCN does not exist, process payment via batch interface', N'Make wrong IGO/NIGO decision. Group may not have current BCN, so the payments will have to be applied manually. Some payments could be applied to suspense, will require additional manual processing. Unable to identify payment as list bill. Unable to identify correct list bill group. Policy status decisions', 2215),
(N'If it is not possible to determine how to apply the payment, seek guidance from payor contact', N'No contact is known. Payment / bill is irreconcilable', 2215),
(N'Update individual policy amounts to match amount of check received and process payment', N'If the amount paid doesn''t match the amount billed, it may be impossible to complete this step accurately. If payment is applied incorrectly, it may be impossible to trace in the future', 2215),
(N'Verify that funds should be refunded', N'Wrong determination could anger customer or result in erroneous lapse', 2216),
(N'If this is a reissue, cancel original refund or verify prior cancellation', N'Could be a duplicate reissue, Original check might not have been stopped', 2216),
(N'Determine correct payee', N'Wrong payee leads to expense, Delays for correct payee, Bad address', 2216),
(N'Process refund', N'Wrong amount input (treasury), Wrong refund type (check / wire / direct deposit), Wrong clearing account used', 2216)
--Business Unit:  Investments/JHSS	Functional Area:  Service Operations
INSERT INTO [SubProcessRisk] ([Name], [Risk], [CoreProcess_Id])
VALUES
(N'Ensure the caller is authorized to act on the account', N'Unauthorized access could lead to fraudulent transactions. Money Laundering signs missed due to employee oversight. Vulnerable adult exploitation', 911),
(N'Ensure the requestor/signer is authorized to submit written requests', N'Unauthorized access could lead to fraudulent transactions. Fraudulent documents provided. Money Laundering signs missed due to employee oversight', 911),
(N'Non-Retirement Financial Transactions:  Ensure the correct fund, fund class/account, amount and trade date are used', N'Inaccurate processing will lead to financial gain/loss and customer complaints. Items indexed to the incorrect worktype/queue. Transaction processed with fraudulent intent. Processing without satisfying internal policies, procedures and guidelines. Transactions received after 4 pm processed using current trade date. Money laundering red flags not detected', 912),
(N'Retirement Financial Transactions:  Ensure the correct fund, fund class/account, amount, trade date, contribution year, type of contribution/rollover/ transfer, type of distribution, withholding, tax/premature disclosures, admin fee are used', N'Inaccurate processing will lead to financial gain/loss and customer complaints. Items indexed to the incorrect worktype/queue. Transaction processed with fraudulent intent. Processing without satisfying internal policies, procedures and guidelines. Transactions received after 4 pm processed using current trade date. Money laundering red flags not detected', 912),
(N'Ensure the correct fund, fund class and/or account, and transaction type is selected for processing and completed accurately (i.e. Transfer of Ownership, Beneficiary Change, Address Change, etc.)', N'Inaccurate processing will lead to customer complaints. Transaction processed with fraudulent intent. Processing without satisfying internal policies, procedures and guidelines. Money laundering red flags not detected', 913),
(N'Generate letters to customers', N'Correspondence/checks being mailed, emailed or faxed to wrong customer or address', 914),
(N'Lost Certificates', N'Lost Certificates not reported to the SIC timely', 914)
--Business Unit:  Shared Services	Functional Area:  Death Match
INSERT INTO [SubProcessRisk] ([Name], [Risk], [CoreProcess_Id])
VALUES
(N'Verification of internal UCI and Lexis Nexis death files prior to AWD RIP and notification to Business Unit of pre-scrubbed death volumes', N'Improper filtering by roles, statuses, etc. Not identifying major outliers/volume discrepancies. Lack of Business Unit notification. Duplicate work types being ripped into AWD workflow. Key man risk', 111),
(N'Validate the scrub and AWD RIP job performed by IT', N'Improperly scrubbed files can lead to duplicate requests. Not all files or too many are ripped into AWD impacting ability to meet regulatory settlement requirements', 111),
(N'Check admin system and AWD  to confirm if the deceased is a JH client, has an inactive account, and if there is a pending or completed claim', N'Confirming death match that is not in fact deceased. Incorrect processing preventing record from going through Thorough Search process. Incorrect data in admin system (status, name, SSN, date of birth, etc.) impacting validation. Inaccurate vendor and DMF data/match logic', 112),
(N'Perform 2nd validation of death using an external resource (Obituary, Legacy, Accurint)', N'Unable to validate death from a secondary source and record still goes through Thorough Search. Not following order of validation check leading to increase costs', 112),
(N'Confirmed death matches are sent to Thorough Search via AWD', N'Work routed to the wrong workflow queue', 113),
(N'Confirmed LTC death matches are sent to LTC Operations for processing', N'Inaccurate processing. Not reporting deaths in a timely manner', 114),
(N'Confirmed Fixed Products death matches (PAR & Structured Settlements) are sent to Fixed - Death Benefit Administration for processing', N'Inaccurate processing. Not reporting deaths in a timely manner', 114)

INSERT INTO [SubProcessRisk] ([Name], [Risk], [CoreProcess_Id])
VALUES
(N'Check documentation and admin system to validate beneficiaries and if there is a benefit due', N'Privacy concerns if letters are  mailed to wrong beneficiary or address. Misidentification of benefit due or beneficiaries could lead to reputational risk', 1611),
(N'Mail three letters (30 days apart) addressed to each beneficiary within admin system', N'Not satisfying Regulatory Settlement Agreement, 1st letter is not mailed within 90 days of notification, Privacy concerns if letters are  mailed to wrong beneficiary or address. Items indexed to the incorrect worktype/queue', 1611),
(N'If no response after 2nd letter, research Accurint to obtain a phone number and better address.  If phone # is found, attempt three phone calls to the beneficiary 15 days apart.', N'Not satisfying Regulatory Settlement Agreement', 1611),
(N'If neither a phone # or better address is found, then send an email to the beneficiary at the email address within JH records', N'Not satisfying Regulatory Settlement Agreement. Privacy concerns if email is sent to the wrong  person. Items indexed to the incorrect worktype/queue', 1611),
(N'If returned mail is received, perform an Accurint search to obtain an updated address and begin Thorough Search process again', N'Not satisfying Regulatory Settlement Agreement. Not meeting the 30 day requirement to perform research and send letter to better address. Items indexed to the incorrect worktype/queue', 1611),
(N'If contact is made with beneficiary via phone callout, call is transferred to Call Center for Claims settlement', N'Unauthorized access could lead to fraudulent activity, Items indexed to the incorrect worktype/queue', 1612),
(N'If contact is made with beneficiary via letter or email, update AWD work item status and work is forwarded to Operations  Claims settlement', N'Items indexed to the incorrect worktype/queue', 1612),
(N'If you''re unable to contact beneficiary, update AWD work item to dormancy status and work is forwarded to Operations for escheatment', N'Not satisfying Regulatory Settlement Agreement. Items indexed to the incorrect worktype/queue', 1612),
(N'Quarterly reporting for  the state of Minnesota based on determined business requirements and database logic', N'Manual reporting and multiple admin system feeds leads to inaccurate reporting. Not meeting reporting deadlines leading to potential regulatory risks', 1613)

SET IDENTITY_INSERT [ProcessRisk] ON
INSERT INTO [ProcessRisk] ([Id], [Name], [Risk], [Category_Id])
VALUES
(1, N'Documented policies, procedures, manuals, job-aids and training materials', N'Procedures not followed according to current documentation. Documentation is not current', 3),
(2, N'Corporate Training, Anti-Money Laundering & Fraud, Privacy & Information Security, Code of Conduct & Business Ethics, Employee Harrassment, Conflict of Interest', N'Incomplete training or knowledge of material', 3),
(3, N'Divisional Training, U.S. Operations Risk Management, Records Management, Health Insurance Portability and Accountability Act (HIPAA)', N'Incomplete training or knowledge of material', 3),
(4, N'FINRA Training, Annual FINRA Firm Element Training, Continuing Education', N'', 3),
(5, N'Business Continuity Plan administration', N'Business continuity plans are insufficient or not current', 4),
(6, N'Maintain a current Business Unit Records, Mangement inventory (Identify records, description, retention, location, security classification and disposition) for both paper and electronic records', N'Loss of critical Company Records; Retention Requirements not understood or adhered to; improper disposal of expired records; disorganization of company records',5),
(7, N'Maintain and communicate Business Unit Records Management Procedures Manual and Records Retention and Destruction Guidelines', N'Appropriate RM Procedures are unknown to employees resulting in ineffective handling of records Not satisfying regulatory/ Legal and Operational  requirements',5),
(8, N'Quality of Image as Official Record (IAOR) Policy', N'Electronic copies of records do not comply with regulatory and company record keeping standards, leaving the company open to litigation and regulatory repercusions',5),
(9, N'Manage critical and often time-sensitive information requests for document holds or preservation as directed by Legal/Compliance/Tax', N'Legal/ Regulatory / Tax liabilities',5),
(10, N'Manage employee status (i.e. active/inactive, roles & responsibilities) within Workday and change system access  (i.e. Administration Systems) within Service Now', N'Inappropriate or insufficient system access',6),
(11, N'Manage access to current Business Records inventory (i.e. Structured/Unstructured Critical Data on SharePoint, Shared Drives)', N'Inappropriate access to company records',6),
(12, N'External electronic distribution or transmission of data (i.e. emails, faxes, data in motion, data at rest)', N'Electronic files/emails are not protected',6),
(13, N'Report Privacy incidents (complete Privacy Incident Reporting Form)', N'Incidents involving PII/PHI going undetected',7),
(14, N'Handling and destruction of privacy data including information with PII/PHI data', N'PII/PHI is easily accessible',7),
(15, N'Customer Identification/Authentication (i.e. Inbound/Outbound callers and correspondence)', N'Inappropriate dissemination of information',7),
(16, N'Handling of Privacy (Do Not Solicit/Do Not Contact) opt-out requests', N'Customers continue to receive unwanted marketing information or materials from the Company', 7)
SET IDENTITY_INSERT [ProcessRisk] OFF

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(1, N'Annual review of policies & procedures'),
(2, N'Resides in centralized location with employee access'),
(3, N'Change in policies & procedures are communicated'),
(4, N'Master Production Calendar/Document Log Review'),
(5, N'Porject Management - Change Control'),
(6, N'Compass Reporting'),
(7, N'Employee Email Notification'),
(8, N'Manager Email Notification'),
(9, N'No controls are in place'),
(21, N'Annual review of BCP'),
(22, N'Achieve of onshore/offshore staffing targets'),
(23, N'Achieve Workplace Flexibility targets'),
(24, N'Annual Alternate Site tests'),
(25, N'No controls are in place'),
(26, N'Perform Periodic Table Top Exercises (i.e. Disaster Scenario and stress testing)'),
(27, N'Quarterly NotiFind Call Tree tests'),
(28, N'Quarterly review of staffing (names/phone #''s) in BCP'),
(30, N'Annual Divisional Risk Management Training'),
(31, N'BURC Records Inventory Worksheet'),
(32, N'BURC Records Destruction Approval Forms'),
(33, N'BURC Coordination'),
(34, N'BURC Comunication at Staff Meetings'),
(35, N'Divisional Attestation (Divisional RM Coordinator & Chief Compliance Officer)'),
(36, N'Global RM Self Assessment'),
(37, N'Image Completeness Controls (batch and document counts)'),
(39, N'Image Replica Controls (Original paper record compared to image record)'),
(40, N'Regular review of physical and electronic records'),
(41, N'Review of BU Records Management Inventory'),
(43, N'No controls in place'),
(44, N'Access Control Lists (ACL) via Service Now'),
(45, N'BURC Records Inventory Worksheet'),
(47, N'Email Encryption'),
(48, N'Employee Badge Access'),
(49, N'Password Protected Files'),
(51, N'Review Role & Permission Profiles'),
(52, N'Secure File Transfer Protocol (SFTP)/Managed Transfer Protocol (MTP)'),
(53, N'System Access Reviews'),
(54, N'System Access Reviews using Identity IQ'),
(55, N'No controls are in place'),
(57, N'Call Monitoring/Recording'),
(58, N'Email Encryption'),
(59, N'Database Tracking (Enternal Gryphon site/Internal Opt Out Database)'),
(60, N'Notify Privacy Coordinator'),
(61, N'Perform Clean Desk Audit Reviews'),
(62, N'No controls are in place');
SET IDENTITY_INSERT [ControlType] OFF

INSERT INTO [ProcessRisk_ControlType]([ProcessRiskId], [ControlTypeId])
VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8),
(1,9),
(2,1),
(2,2),
(2,3),
(2,4),
(2,5),
(2,6),
(2,7),
(2,8),
(2,9),
(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(3,6),
(3,7),
(3,8),
(3,9),
(4,1),
(4,2),
(4,3),
(4,4),
(4,5),
(4,6),
(4,7),
(4,8),
(4,9),
(5,21),
(5,22),
(5,23),
(5,24),
(5,25),
(5,26),
(5,27),
(5,28),
(6,30),
(6,31),
(6,32),
(6,33),
(6,34),
(6,35),
(6,36),
(6,37),
(6,39),
(6,40),
(6,41),
(6,43),
(7,30),
(7,31),
(7,32),
(7,33),
(7,34),
(7,35),
(7,36),
(7,37),
(7,39),
(7,40),
(7,41),
(7,43),
(8,30),
(8,31),
(8,32),
(8,33),
(8,34),
(8,35),
(8,36),
(8,37),
(8,39),
(8,40),
(8,41),
(8,43),
(9,30),
(9,31),
(9,32),
(9,33),
(9,34),
(9,35),
(9,36),
(9,37),
(9,39),
(9,40),
(9,41),
(9,43),
(10,44),
(10,45),
(10,47),
(10,48),
(10,49),
(10,51),
(10,52),
(10,53),
(10,54),
(10,55),
(11,44),
(11,45),
(11,47),
(11,48),
(11,49),
(11,51),
(11,52),
(11,53),
(11,54),
(11,55),
(12,44),
(12,45),
(12,47),
(12,48),
(12,49),
(12,51),
(12,52),
(12,53),
(12,54),
(12,55),
(13,57 ),
(13,58 ),
(13,59 ),
(13,60 ),
(13,61 ),
(13,62 ),
(14,57 ),
(14,58 ),
(14,59 ),
(14,60 ),
(14,61 ),
(14,62 ),
(15,57 ),
(15,58 ),
(15,59 ),
(15,60 ),
(15,61 ),
(15,62 ),
(16,57 ),
(16,58 ),
(16,59 ),
(16,60 ),
(16,61 ),
(16,62 );
SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(201, N'Quality Review'),
(202, N'Manager Approval'),
(204, N'Legal/Compliance Review'),
(205, N'AWD/Workflow Reporting'),
(206, N'Document Imaging'),
(207, N'Call Recording'),
(208, N'Daily Reconciliation')
SET IDENTITY_INSERT [ControlType] OFF

INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(1,201),
(1,202),
(2,204),
(2,205),
(3,206),
(4,207),
(4,208);
SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(401, N'All reviews performed by LHCP as defined by HIPAA'),
(402, N'AWD/Workflow Reporting'),
(403, N'Call Monitoring/Recording'),
(404, N'Claim file is encrypted'),
(405, N'Control report to track aging of appeals and trigger delay letter'),
(406, N'Control report to track ITP reviews'),
(407, N'Daily Reconciliation'),
(408, N'Determination within 60 days after all necessary information is received'),
(409, N'Document Imaging'),
(410, N'Legal/Compliance Review'),
(411, N'Manager Approval'),
(412, N'No controls in place'),
(413, N'Quality Review')
SET IDENTITY_INSERT [ControlType] OFF
INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(371,405),
(371,413),
(371,412),
(372,413),
(372,412),
(373,405),
(373,413),
(373,412),
(374,401),
(374,405),
(374,408),
(374,413),
(374,412),
(375,404),
(375,413),
(375,412),
(376,406),
(376,413),
(376,412);

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(501, N'Admin Status Reports'),
(502, N'Admin Trend Analysis & Reporting'),
(504, N'AML verification'),
(505, N'Anti-Money Laundering Verification'),
(506, N'AWD Deposit Report'),
(507, N'AWD/Workflow Reporting'),
(508, N'BFDS Unprocessed Check Report'),
(509, N'Call Monitoring/Recording'),
(510, N'Control Reporting'),
(511, N'CSC Trend Reporting and Analysis'),
(512, N'Daily Reconciliation'),
(513, N'Document Imaging'),
(514, N'Global Disbursement Approval Policy'),
(515, N'JPM Chase Import Logic'),
(516, N'Legal/Compliance Review'),
(517, N'Lock premium report'),
(518, N'Manager Approval'),
(519, N'No controls in place'),
(520, N'Partial review of bills before mailing (Corporate Solutions)'),
(521, N'Quality Review'),
(522, N'Quality review (Post)'),
(523, N'Refund report'),
(524, N'Suspended Billing Report'),
(525, N'Suspense Reporting'),
(526, N'Suspense/Clearing Maintenance'),
(527, N'Time Stamp'),
(528, N'Treasury Dept Control Reporting'),
(529, N'Treasury Email Notification'),
(530, N'Working Group (CSC Integration')
SET IDENTITY_INSERT [ControlType] OFF

INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(221,508),
(221,527),
(221,511),
(221,530),
(221,519),
(222,522),
(222,527),
(222,505),
(222,519),
(223,522),
(223,512),
(223,510),
(223,519),
(224,506),
(224,510),
(224,526),
(224,519),
(225,518),
(225,510),
(225,526),
(225,528),
(225,529),
(225,514),
(225,519),
(226,510),
(226,525),
(226,529),
(227,519),
(227,529),
(228,518),
(228,510),
(228,529),
(228,519),
(229,520),
(229,519),
(2210,522),
(2210,519),
(2211,528),
(2211,529),
(2211,519),
(2212,524),
(2212,501),
(2212,502),
(2212,519),
(2213,522),
(2213,512),
(2213,517),
(2213,528),
(2213,519),
(2214,528),
(2214,515),
(2214,519),
(2215,522),
(2215,504),
(2215,527),
(2215,510),
(2215,526),
(2215,519),
(2216,522),
(2216,518),
(2216,510),
(2216,523),
(2216,519);

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(601, N'Call Monitoring/Recording'),
(602, N'$50k+ Report Review'),
(604, N'38a-1 Reporting (B02B: Time/Date Stamp Policy, B02C: As of Transactions Policy, B02E: Trade Date Policy - Pricing of Share Transactions Policy)'),
(605, N'38a-1 Reporting (Non-End Queue & E-delivery, B07A: Lost Certificate Reporting Policy)'),
(606, N'38a-1 Testing'),
(607, N'AML Suspicious Activity Check'),
(608, N'AWD Work Item Priority Settings'),
(609, N'AWD/Workflow Reporting'),
(610, N'Call Monitoring/Recording'),
(611, N'Compliance Monitoring Reporting Testing'),
(612, N'Critical Error Report'),
(613, N'Daily Queue Monitoring Report'),
(614, N'Daily Reconciliation'),
(615, N'Day 2 Late Trading Review'),
(616, N'Document Imaging'),
(617, N'Legal/Compliance Review'),
(618, N'Manager Approval'),
(619, N'National Quality Review (NQR)'),
(620, N'No controls in place'),
(621, N'OFAC Check via Bridger'),
(622, N'PwC SOC1 Testing'),
(623, N'Quality Review'),
(624, N'Quality review (Day 1 -100%  High dollar trades)'),
(625, N'Security Check'),
(626, N'System Time Stamp (AWD, RightFax, etc.)'),
(627, N'System Trade Date Generation (next day after 4 pm)');
SET IDENTITY_INSERT [ControlType] OFF
INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(911,601),
(911,625),
(911,623),
(911,619),
(911,611),
(911,622),
(911,620),
(912,601),
(912,624),
(912,608),
(912,613),
(912,626),
(912,627),
(912,604),
(912,611),
(912,602),
(912,612),
(912,621),
(912,607),
(912,615),
(912,620),
(913,610),
(913,623),
(913,608),
(913,613),
(913,606),
(913,611),
(913,621),
(913,607),
(913,620),
(914,623),
(914,613),
(914,605),
(914,611),
(914,620);

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(701, N'AWD Auto Generated Work Items'),
(702, N'Death Match Results Congo''s report'),
(704, N'Extract Reconciliation'),
(705, N'Internal review of Vendor Death Match Logic'),
(706, N'Manager Sign-off/Email notification triggering next step'),
(707, N'Monthly Death File Validation (AWD BI - Outstanding Inventory Report)'),
(708, N'No controls in place'),
(709, N'Quality review (User Experience)'),
(710, N'Shared Service functions (Data Integrity, Returned Mail, TIN Matching)'),
(711, N'Unconfirmed Death Letters');
SET IDENTITY_INSERT [ControlType] OFF
INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(111,704),
(111,706),
(111,707),
(111,708),
(112,709),
(112,711),
(112,710),
(112,705),
(112,708),
(113,709),
(113,708),
(114,709),
(114,702),
(114,701),
(114,708);

SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(801, N'38a-1 Reporting (09A- Lost Beneficiaries)'),
(802, N'Auto Generated Letters (AWD/RR Donnelley) '),
(804, N'AWD Auto Generated Work Items'),
(805, N'AWD Workflow Routing'),
(806, N'Call Monitoring/Recording'),
(807, N'No controls in place'),
(808, N'Quality review (User Exoerience)'),
(809, N'Return mail indicators'),
(810, N'Validation of Data');

SET IDENTITY_INSERT [ControlType] OFF
INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(1611,808),
(1611,801),
(1611,805),
(1611,802),
(1611,809),
(1611,807),
(1612,808),
(1612,806),
(1612,805),
(1612,804),
(1612,807),
(1613,810),
(1613,807);

-- common additional
SET IDENTITY_INSERT [ControlType] ON
INSERT INTO [ControlType] ([Id], [Name])
VALUES
(1001, N'AWD/Workflow Reporting'),
(1002, N'Call Monitoring/Recording'),
(1004, N'Daily Reconciliation'),
(1005, N'Document Imaging'),
(1006, N'Legal/Compliance Review'),
(1007, N'Manager Approval'),
(1008, N'No controls in place'),
(1009, N'Quality Review');
SET IDENTITY_INSERT [ControlType] OFF
INSERT INTO [CoreProcess_ControlType]([CoreProcessId], [ControlTypeId])
VALUES
(5,1001),
(5,1002),
(5,1004),
(5,1005),
(5,1006),
(5,1007),
(5,1008),
(5,1009),
(378,1001),
(378,1002),
(378,1004),
(378,1005),
(378,1006),
(378,1007),
(378,1008),
(378,1009),
(2217,1001),
(2217,1002),
(2217,1004),
(2217,1005),
(2217,1006),
(2217,1007),
(2217,1008),
(2217,1009),
(915,1001),
(915,1002),
(915,1004),
(915,1005),
(915,1006),
(915,1007),
(915,1008),
(915,1009),
(115,1001),
(115,1002),
(115,1004),
(115,1005),
(115,1006),
(115,1007),
(115,1008),
(115,1009),
(1614,1001),
(1614,1002),
(1614,1004),
(1614,1005),
(1614,1006),
(1614,1007),
(1614,1008),
(1614,1009);

SET IDENTITY_INSERT [LikelihoodOfOccurrence] ON
INSERT INTO [LikelihoodOfOccurrence] ([Id], [Name])
VALUES
(1, N'Daily'),
(2, N'Weekly'),
(3, N'Monthly'),
(4, N'Quarterly'),
(5, N'Semi-Annual'),
(6, N'Annual'),
(7, N'Process is no longer applicable')
SET IDENTITY_INSERT [LikelihoodOfOccurrence] OFF

SET IDENTITY_INSERT [FunctionalAreaOwner] ON
INSERT INTO [FunctionalAreaOwner] ([Id], [Name], [BusinessUnitId])
VALUES
(1, @BUFuncApprover1, 1),
(2, @BUFuncApprover2, 1),
(3, @BUFuncApprover3, 1),
(4, @BUFuncApprover1, 2),
(5, @BUFuncApprover2, 2),
(6, @BUFuncApprover3, 2),
(7, @BUFuncApprover1, 3),
(8, @BUFuncApprover2, 3),
(9, @BUFuncApprover3, 3),
(10, @BUFuncApprover1, 4),
(11, @BUFuncApprover2, 4),
(12, @BUFuncApprover3, 5)
SET IDENTITY_INSERT [FunctionalAreaOwner] OFF

SET IDENTITY_INSERT [AssessmentType] ON
INSERT INTO [AssessmentType] ([Id], [Name])
VALUES
(1, N'Annual Analysis'),
(2, N'New Function Analysis'),
(3, N'New Policy/Process Analysis'),
(4, N'Management Change Review')
SET IDENTITY_INSERT [AssessmentType] OFF

SET IDENTITY_INSERT [AssessmentStatus] ON
INSERT INTO [AssessmentStatus] ([Id], [Name])
VALUES
(1, N'Not Started'),
(2, N'In Progress'),
(3, N'Complete')
SET IDENTITY_INSERT [AssessmentStatus] OFF

SET IDENTITY_INSERT [ChangeType] ON
INSERT INTO [ChangeType] ([Id], [Name])
VALUES
(1, N'Process'),
(2, N'Compliance Requirements'),
(3, N'Controls'),
(4, N'Systems'),
(5, N'Outsourcing'),
(6, N'Organizational Structure'),
(7, N'Roles & Responsibilities')
SET IDENTITY_INSERT [ChangeType] OFF

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

SET IDENTITY_INSERT [ControlTrigger] ON
INSERT INTO [ControlTrigger] ([Id], [Name])
VALUES
(1, N'Performance'),
(2, N'Process'),
(3, N'Product'),
(4, N'Regulatory/Compliance'),
(5, N'SOC 1'),
(6, N'SOC 2'),
(7, N'SOX/MAR'),
(8, N'38a-1'),
(9, N'Other')
SET IDENTITY_INSERT [ControlTrigger] OFF

SET IDENTITY_INSERT [ControlFrequency] ON
INSERT INTO [ControlFrequency] ([Id], [Name])
VALUES
(1, N'Ad Hoc'),
(2, N'Daily'),
(3, N'Weekly'),
(4, N'Monthly'),
(5, N'Quarterly'),
(6, N'Semi-Annual'),
(7, N'Annual')
SET IDENTITY_INSERT [ControlFrequency] OFF

SET IDENTITY_INSERT [ControlDesign] ON
INSERT INTO [ControlDesign] ([Id], [Name])
VALUES
(1, N'Automated'),
(2, N'IT Dependent'),
(3, N'Manual Prevention (Same Day)'),
(4, N'Manual Detect (Day 2 plus)')
SET IDENTITY_INSERT [ControlDesign] OFF


-- 0: Owner
-- 1: BUFunctionalApprover
-- 2: BURiskManagementApprover
-- 3: DivisionalRiskManagementApprover
-- 4: Admin
-- security permission
INSERT INTO [ActionPermission] ([Role], [Action])
VALUES
(0, N'Security.Login'),
(0, N'Security.RevokeToken'),
(1, N'Security.Login'),
(1, N'Security.RevokeToken'),
(2, N'Security.Login'),
(2, N'Security.RevokeToken'),
(3, N'Security.Login'),
(3, N'Security.RevokeToken'),
(4, N'Security.Login'),
(4, N'Security.RevokeToken');

-- assessment permission
INSERT INTO [ActionPermission] ([Role], [Action])
VALUES
(0, N'Assessment.CreateAsDraft'),-- only allowed to owner
(0, N'Assessment.Update'),
(0, N'Assessment.GetDraftCount'),-- only allowed to owner
(0, N'Assessment.Submit'),-- only allowed to owner
(0, N'Assessment.GetDraftAssessments'), -- only allowed to owner
(0, N'Assessment.Get'),
(0, N'Assessment.Search'),
(0, N'Assessment.ExportAssessment'),
(0, N'Assessment.GetOverallRiskRatingReport'),
(0, N'Assessment.GetAwaitingApprovalCount'),
(0, N'Assessment.GetApprovedCount'),
(0, N'Assessment.GetRejectedCount'),
(0, N'Assessment.GetAwaitingApprovalAssessments'),
(0, N'Assessment.GetApprovedAssessments'),
(0, N'Assessment.GetRejectedAssessments'),
-- for approvers
(1, N'Assessment.Get'),
(1, N'Assessment.Update'),
(1, N'Assessment.Search'),
(1, N'Assessment.ExportAssessment'),
(1, N'Assessment.Approve'),-- only allowed to approver
(1, N'Assessment.Reject'),-- only allowed to approver
(1, N'Assessment.GetOverallRiskRatingReport'),
(1, N'Assessment.GetAwaitingApprovalCount'),
(1, N'Assessment.GetApprovedCount'),
(1, N'Assessment.GetRejectedCount'),
(1, N'Assessment.GetAwaitingApprovalAssessments'),
(1, N'Assessment.GetApprovedAssessments'),
(1, N'Assessment.GetRejectedAssessments'),

(2, N'Assessment.Get'),
(2, N'Assessment.Update'),
(2, N'Assessment.Search'),
(2, N'Assessment.ExportAssessment'),
(2, N'Assessment.Approve'),
(2, N'Assessment.Reject'),
(2, N'Assessment.GetOverallRiskRatingReport'),
(2, N'Assessment.GetAwaitingApprovalCount'),
(2, N'Assessment.GetApprovedCount'),
(2, N'Assessment.GetRejectedCount'),
(2, N'Assessment.GetAwaitingApprovalAssessments'),
(2, N'Assessment.GetApprovedAssessments'),
(2, N'Assessment.GetRejectedAssessments'),

(3, N'Assessment.Get'),
(3, N'Assessment.Update'),
(3, N'Assessment.Search'),
(3, N'Assessment.ExportAssessment'),
(3, N'Assessment.Approve'),
(3, N'Assessment.Reject'),
(3, N'Assessment.GetOverallRiskRatingReport'),
(3, N'Assessment.GetAwaitingApprovalCount'),
(3, N'Assessment.GetApprovedCount'),
(3, N'Assessment.GetRejectedCount'),
(3, N'Assessment.GetAwaitingApprovalAssessments'),
(3, N'Assessment.GetApprovedAssessments'),
(3, N'Assessment.GetRejectedAssessments'),

(4, N'Assessment.Update'),-- only allowed to owner and admin
(4, N'Assessment.Get'),
(4, N'Assessment.Search'),
(4, N'Assessment.ExportAssessment'),
(4, N'Assessment.Reject'),
(4, N'Assessment.GetOverallRiskRatingReport'),
(4, N'Assessment.GetAwaitingApprovalCount'),
(4, N'Assessment.GetApprovedCount'),
(4, N'Assessment.GetRejectedCount'),
(4, N'Assessment.GetAwaitingApprovalAssessments'),
(4, N'Assessment.GetApprovedAssessments'),
(4, N'Assessment.GetRejectedAssessments');

-- lookup permission 
-- only required by owner add for other if needed
INSERT INTO [ActionPermission] ([Role], [Action])
VALUES
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
(0, N'Lookup.GetAllAssessmentStatuses'),
(0, N'Lookup.GetAllChangeTypes'),
(0, N'Lookup.GetAllSites'),
(0, N'Lookup.GetCoreProcesses'),

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
(1, N'Lookup.GetAllAssessmentStatuses'),
(1, N'Lookup.GetAllChangeTypes'),
(1, N'Lookup.GetAllSites'),
(1, N'Lookup.GetCoreProcesses'),

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
(2, N'Lookup.GetAllAssessmentStatuses'),
(2, N'Lookup.GetAllChangeTypes'),
(2, N'Lookup.GetAllSites'),
(2, N'Lookup.GetCoreProcesses'),

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
(3, N'Lookup.GetAllAssessmentStatuses'),
(3, N'Lookup.GetAllChangeTypes'),
(3, N'Lookup.GetAllSites'),
(3, N'Lookup.GetCoreProcesses'),

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
(4, N'Lookup.GetAllAssessmentStatuses'),
(4, N'Lookup.GetAllChangeTypes'),
(4, N'Lookup.GetAllSites'),
(4, N'Lookup.GetCoreProcesses');
SET NOCOUNT OFF

--Test data
SET IDENTITY_INSERT [dbo].[ProcessControlAssessment] ON 

GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (104, 1, NULL, 1, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (105, 1, NULL, 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (106, 7, N'sdfwe', 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (107, 4, NULL, 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (108, 3, NULL, 3, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (109, 4, NULL, 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (110, 2, NULL, 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (111, 7, N'sdf', 3, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (112, 1, NULL, 2, 2)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (113, NULL, NULL, 1, 3)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (114, NULL, NULL, 2, 3)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (115, NULL, NULL, 3, 3)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (116, NULL, NULL, 1, 3)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (117, NULL, NULL, 2, 4)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (118, NULL, NULL, 1, 5)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (119, NULL, NULL, 2, 5)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (120, NULL, NULL, 2, 5)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (121, NULL, NULL, 2, 5)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (122, NULL, NULL, 1, 6)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (123, NULL, NULL, 2, 6)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (124, NULL, NULL, 3, 6)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (125, NULL, NULL, 1, 7)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (126, NULL, NULL, 2, 7)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (127, NULL, NULL, 3, 7)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (128, NULL, NULL, 1, 7)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (129, NULL, NULL, 2, 3)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (130, NULL, NULL, 3, 4)
GO
INSERT [dbo].[ProcessControlAssessment] ([Id], [LikelihoodOfOccurrence_Id], [OtherLikelihoodOfOccurrence], [RiskExposure_Id], [Category_Id]) VALUES (131, NULL, NULL, 2, 5)
GO
SET IDENTITY_INSERT [dbo].[ProcessControlAssessment] OFF
GO
SET IDENTITY_INSERT [dbo].[ControlAssessment] ON 

GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (53, NULL, N'test', 201, 1, 1, NULL, NULL, 104)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (54, NULL, N'test2', 204, 1, 3, N'sdf', N'Test', 105)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (55, NULL, N'test3', 204, 3, 2, NULL, NULL, 106)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (56, NULL, N'test4', 205, 5, 3, NULL, N'sdf', 107)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (57, N'sdfsdf', N'sdf', NULL, 2, 3, NULL, N'sdf', 108)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (58, NULL, N'sdf', 206, 1, 3, NULL, N'sdf', 109)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (59, N'sdf', N'sdf', NULL, 1, 1, N'sdf', NULL, 110)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (60, NULL, N'sdf', 208, 2, 2, NULL, NULL, 111)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (61, NULL, N'sdf', 205, 1, 1, NULL, NULL, 112)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (62, N'adadf', NULL, NULL, 1, 3, NULL, N'test`', 113)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (63, NULL, NULL, 4, 2, 2, NULL, NULL, 114)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (64, NULL, NULL, 3, 2, 2, NULL, NULL, 115)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (65, NULL, NULL, 2, 2, 2, NULL, NULL, 116)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (66, NULL, NULL, 22, 1, 1, NULL, NULL, 117)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (67, NULL, NULL, 36, 4, 2, NULL, NULL, 118)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (68, NULL, NULL, 35, 4, 1, NULL, NULL, 119)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (69, NULL, NULL, 30, 1, 1, NULL, NULL, 120)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (70, NULL, NULL, 31, 2, 2, NULL, NULL, 121)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (71, NULL, NULL, 52, 5, 1, NULL, NULL, 122)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (72, N'dfd', NULL, NULL, 2, 2, NULL, NULL, 123)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (73, NULL, NULL, 51, 4, 2, NULL, NULL, 124)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (77, N'dfgdfg', NULL, NULL, 4, 2, NULL, NULL, 128)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (79, NULL, NULL, 22, 2, 2, NULL, NULL, 130)
GO
INSERT [dbo].[ControlAssessment] ([Id], [OtherControlType], [ControlObjective], [ControlType_Id], [ControlFrequency_Id], [KeyControlsMaturity_Id], [OtherTestingFrequency], [OtherKeyControlMaturity], [ProcessControlAssessment_Id]) VALUES (80, NULL, NULL, 47, 5, 1, NULL, NULL, 131)
GO
SET IDENTITY_INSERT [dbo].[ControlAssessment] OFF
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (104, 1)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (105, 1)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (106, 1)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (108, 1)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (112, 1)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (110, 2)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (107, 3)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (109, 3)
GO
INSERT [dbo].[ProcessControlAssessment_RiskImpact] ([ProcessControlAssessmentId], [RiskImpactId]) VALUES (111, 4)
GO
SET IDENTITY_INSERT [dbo].[Assessment] ON 

GO
INSERT [dbo].[Assessment] ([Id], [FunctionalAreaDescription], [AssessmentDueDate], [OverallRiskRatingCommentary], [ApprovalStatus], [BUFunctionalApproverUsername], [BUFunctionalApproveTime], [BURiskManagementApproverUsername], [BURiskManagementApproveTime], [DivisionalRiskManagementApproverUsername], [DivisionalRiskManagementApproveTime], [RejecterUsername], [RejectTime], [RejectionReason], [RejectPhase], [SubmitterUsername], [SubmitTime], [Title], [CreatedBy], [CreatedTime], [LastUpdatedBy], [LastUpdatedTime], [BusinessUnit_Id], [DepartmentHead_Id], [Product_Id], [Department_Id], [FunctionalAreaOwner_Id], [FunctionalArea_Id], [AssessmentType_Id], [AssessmentStatus_Id]) VALUES (1, N'Test', CAST(N'2016-10-12 00:00:00.000' AS DateTime), NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'CoeusOwnerUser1', NULL, N'Annuities - Account Maintenance - 2016-10-04', N'CoeusOwnerUser1', CAST(N'2016-10-04 00:46:51.600' AS DateTime), N'CoeusOwnerUser1', CAST(N'2016-10-04 03:06:59.773' AS DateTime), 1, 1, 1, 1, 1, 1, 1, 2)
GO
SET IDENTITY_INSERT [dbo].[Assessment] OFF
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (113, NULL, NULL, 1, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (114, NULL, NULL, 2, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (115, NULL, NULL, 3, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (116, NULL, NULL, 4, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (117, NULL, NULL, 5, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (118, NULL, NULL, 6, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (119, NULL, NULL, 7, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (120, NULL, NULL, 8, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (121, NULL, NULL, 9, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (122, NULL, NULL, 10, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (123, NULL, NULL, 11, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (124, NULL, NULL, 12, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (125, NULL, NULL, 13, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (126, NULL, NULL, 14, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (127, NULL, NULL, 15, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (128, NULL, NULL, 16, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (129, N'add', N'add', NULL, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (130, N'ad', N'ad', NULL, 1)
GO
INSERT [dbo].[ProcessRiskAssessment] ([Id], [AdditionalProcess], [AdditionalRisk], [ProcessRisk_Id], [Assessment_Id]) VALUES (131, N'adfa', N'adf', NULL, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (104, NULL, NULL, NULL, 1, 1, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (105, NULL, NULL, NULL, 2, 2, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (106, NULL, NULL, NULL, 3, 2, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (107, NULL, NULL, NULL, 4, 2, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (108, NULL, NULL, NULL, 5, 2, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (109, NULL, NULL, NULL, 6, 3, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (110, NULL, NULL, NULL, 7, 3, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (111, NULL, NULL, NULL, 8, 4, 1)
GO
INSERT [dbo].[FunctionalAreaProcessAssessment] ([Id], [AdditionalCoreProcess], [AdditionalSubProcess], [AdditionalRisk], [SubProcessRisk_Id], [CoreProcess_Id], [Assessment_Id]) VALUES (112, N'add1', N'add1', N'ar', NULL, NULL, 1)
GO
SET IDENTITY_INSERT [dbo].[FunctionPerformedSite] ON 

GO
INSERT [dbo].[FunctionPerformedSite] ([Id], [Site_Id], [Percentage_Id], [Assessment_Id]) VALUES (9, 1, 3, 1)
GO
INSERT [dbo].[FunctionPerformedSite] ([Id], [Site_Id], [Percentage_Id], [Assessment_Id]) VALUES (10, 2, 9, 1)
GO
SET IDENTITY_INSERT [dbo].[FunctionPerformedSite] OFF
GO
SET IDENTITY_INSERT [dbo].[FunctionChange] ON 
INSERT [dbo].[FunctionChange] ([Id], [ChangeTime], [ChangeDescription], [ChangeType_Id]) 
VALUES (1, CAST(N'2016-05-27 00:00:00.000' AS DateTime), N'Description of change 2', 2)
INSERT [dbo].[FunctionChange] ([Id], [ChangeTime], [ChangeDescription], [ChangeType_Id]) VALUES 
(2, CAST(N'2016-05-26 00:00:00.000' AS DateTime), N'Description of change 1', 1)
SET IDENTITY_INSERT [dbo].[FunctionChange] OFF
INSERT [dbo].[FutureFunctionChanges] ([AssessmentId], [FunctionChangeId]) VALUES (1,1)
INSERT [dbo].[PriorFunctionChanges] ([AssessmentId], [FunctionChangeId]) VALUES (1, 2)
GO
SET IDENTITY_INSERT [dbo].[KPISLAAssessment] ON 

GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (45, NULL, NULL, NULL, 1, 1, 1, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (46, NULL, NULL, NULL, 2, 2, 1, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (47, NULL, NULL, NULL, 3, 3, 1, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (48, NULL, NULL, NULL, 4, 5, 1, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (49, NULL, N'add1', NULL, NULL, 7, 1, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (50, NULL, N'Timeliness', NULL, NULL, 8, 2, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (51, NULL, NULL, NULL, 5, 20, 3, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (52, NULL, NULL, NULL, 6, 25, 4, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (53, NULL, NULL, NULL, 7, 33, 5, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (54, N'Add1', N'sdf', NULL, NULL, 15, NULL, 1, 1)
GO
INSERT [dbo].[KPISLAAssessment] ([Id], [AdditionalKPICategory], [AdditionalKPI], [AdditionalSLA], [KPI_Id], [SelectedSLA_Id], [KPICategory_Id], [Category_Id], [Assessment_Id]) VALUES (55, N'Add1', N'Add KPI 2', NULL, NULL, 22, NULL, 1, 1)
GO
SET IDENTITY_INSERT [dbo].[KPISLAAssessment] OFF
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (53, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (54, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (57, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (58, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (59, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (62, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (68, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (69, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (79, 1)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (55, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (60, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (61, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (63, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (64, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (65, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (66, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (67, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (70, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (73, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (80, 2)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (56, 3)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (66, 3)
GO
INSERT [dbo].[ControlAssessment_ControlDesign] ([ControlAssessmentId], [ControlDesignId]) VALUES (72, 3)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (59, 1)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (61, 1)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (55, 2)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (56, 2)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (60, 2)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (54, 8)
GO
INSERT [dbo].[ControlAssessment_ControlTrigger] ([ControlAssessmentId], [ControlTriggerId]) VALUES (54, 9)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (53, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (54, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (57, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (58, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (59, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (61, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (62, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (65, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (66, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (68, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (69, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (73, 1)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (62, 2)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (66, 2)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (67, 2)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (70, 2)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (71, 2)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (55, 3)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (56, 3)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (63, 3)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (66, 3)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (79, 3)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (72, 4)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (54, 17)
GO
INSERT [dbo].[ControlAssessment_TestingFrequency] ([ControlAssessmentId], [TestingFrequencyId]) VALUES (59, 17)
GO
