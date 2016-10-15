/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities.DTOs;
using System;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the assessment.
    /// </summary>
    ///
    /// <remarks>
    /// Note that the properties are implemented without any validation.
    /// </remarks>
    ///
    /// <threadsafety>
    /// This class is mutable, so it is not thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class Assessment : AuditableEntity
    {
        /// <summary>
        /// Gets or sets the business unit.
        /// </summary>
        /// <value>
        /// The business unit.
        /// </value>
        public BusinessUnit BusinessUnit { get; set; }

        /// <summary>
        /// Gets or sets the product.
        /// </summary>
        /// <value>
        /// The product.
        /// </value>
        public Product Product { get; set; }

        /// <summary>
        /// Gets or sets the department.
        /// </summary>
        /// <value>
        /// The department.
        /// </value>
        public Department Department { get; set; }

        /// <summary>
        /// Gets or sets the department head.
        /// </summary>
        /// <value>
        /// The department head.
        /// </value>
        public DepartmentHead DepartmentHead { get; set; }

        /// <summary>
        /// Gets or sets the functional area owner.
        /// </summary>
        /// <value>
        /// The functional area owner.
        /// </value>
        public FunctionalAreaOwner FunctionalAreaOwner { get; set; }

        /// <summary>
        /// Gets or sets the functional area.
        /// </summary>
        /// <value>
        /// The functional area.
        /// </value>
        public FunctionalArea FunctionalArea { get; set; }

        /// <summary>
        /// Gets or sets the functional area description.
        /// </summary>
        /// <value>
        /// The functional area description.
        /// </value>
        public string FunctionalAreaDescription { get; set; }

        /// <summary>
        /// Gets or sets the function performed sites.
        /// </summary>
        /// <value>
        /// The function performed sites.
        /// </value>
        public IList<FunctionPerformedSite> FunctionPerformedSites { get; set; }

        /// <summary>
        /// Gets or sets the type of the assessment.
        /// </summary>
        /// <value>
        /// The type of the assessment.
        /// </value>
        public AssessmentType AssessmentType { get; set; }

        /// <summary>
        /// Gets or sets the assessment status.
        /// </summary>
        /// <value>
        /// The assessment status.
        /// </value>
        public AssessmentStatus AssessmentStatus { get; set; }

        /// <summary>
        /// Gets or sets the assessment due date.
        /// </summary>
        /// <value>
        /// The assessment due date.
        /// </value>
        public DateTime? AssessmentDueDate { get; set; }

        /// <summary>
        /// Gets or sets the prior function changes.
        /// </summary>
        /// <value>
        /// The prior function changes.
        /// </value>
        public IList<FunctionChange> PriorFunctionChanges { get; set; }

        /// <summary>
        /// Gets or sets the future function changes.
        /// </summary>
        /// <value>
        /// The future function changes.
        /// </value>
        public IList<FunctionChange> FutureFunctionChanges { get; set; }

        /// <summary>
        /// Gets or sets the KPI/SLA assessments.
        /// </summary>
        /// <value>
        /// The KPI/SLA assessments.
        /// </value>
        public IList<KPISLAAssessment> KPISLAAssessments { get; set; }

        /// <summary>
        /// Gets or sets the functional area process assessments.
        /// </summary>
        /// <value>
        /// The functional area process assessments.
        /// </value>
        public IList<FunctionalAreaProcessAssessment> FunctionalAreaProcessAssessments { get; set; }

        /// <summary>
        /// Gets or sets the process risk assessments.
        /// </summary>
        /// <value>
        /// The process risk assessments.
        /// </value>
        public IList<ProcessRiskAssessment> ProcessRiskAssessments { get; set; }

        /// <summary>
        /// Gets or sets the overall risk rating commentary.
        /// </summary>
        /// <value>
        /// The overall risk rating commentary.
        /// </value>
        public string OverallRiskRatingCommentary { get; set; }

        /// <summary>
        /// Gets or sets the approval status.
        /// </summary>
        /// <value>
        /// The approval status.
        /// </value>
        public ApprovalStatus ApprovalStatus { get; set; }

        /// <summary>
        /// Gets or sets the business unit functional approver username.
        /// </summary>
        /// <value>
        /// The business unit functional approver username.
        /// </value>
        public string BUFunctionalApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the business unit functional approver.
        /// </summary>
        /// <value>
        /// The business unit functional approver.
        /// </value>
        public User BUFunctionalApprover { get; set; }

        /// <summary>
        /// Gets or sets the business unit functional approve time.
        /// </summary>
        /// <value>
        /// The business unit functional approve time.
        /// </value>
        public DateTime? BUFunctionalApproveTime { get; set; }

        /// <summary>
        /// Gets or sets the business unit risk management approver username.
        /// </summary>
        /// <value>
        /// The business unit risk management approver username.
        /// </value>
        public string BURiskManagementApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the business unit risk management approver.
        /// </summary>
        /// <value>
        /// The business unit risk management approver.
        /// </value>
        public User BURiskManagementApprover { get; set; }

        /// <summary>
        /// Gets or sets the business unit risk management approve time.
        /// </summary>
        /// <value>
        /// The business unit risk management approve time.
        /// </value>
        public DateTime? BURiskManagementApproveTime { get; set; }

        /// <summary>
        /// Gets or sets the divisional risk management approver username.
        /// </summary>
        /// <value>
        /// The divisional risk management approver username.
        /// </value>
        public string DivisionalRiskManagementApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the divisional risk management approver.
        /// </summary>
        /// <value>
        /// The divisional risk management approver.
        /// </value>
        public User DivisionalRiskManagementApprover { get; set; }

        /// <summary>
        /// Gets or sets the divisional risk management approve time.
        /// </summary>
        /// <value>
        /// The divisional risk management approve time.
        /// </value>
        public DateTime? DivisionalRiskManagementApproveTime { get; set; }

        /// <summary>
        /// Gets or sets the rejecter username.
        /// </summary>
        /// <value>
        /// The rejecter username.
        /// </value>
        public string RejecterUsername { get; set; }

        /// <summary>
        /// Gets or sets the rejecter.
        /// </summary>
        /// <value>
        /// The rejecter.
        /// </value>
        public User Rejecter { get; set; }

        /// <summary>
        /// Gets or sets the reject time.
        /// </summary>
        /// <value>
        /// The reject time.
        /// </value>
        public DateTime? RejectTime { get; set; }

        /// <summary>
        /// Gets or sets the rejection reason.
        /// </summary>
        /// <value>
        /// The rejection reason.
        /// </value>
        public string RejectionReason { get; set; }

        /// <summary>
        /// Gets or sets the reject phase.
        /// </summary>
        /// <value>
        /// The reject phase.
        /// </value>
        public RejectPhase? RejectPhase { get; set; }

        /// <summary>
        /// Gets or sets the submitter username.
        /// </summary>
        /// <value>
        /// The submitter username.
        /// </value>
        public string SubmitterUsername { get; set; }

        /// <summary>
        /// Gets or sets the submitter.
        /// </summary>
        /// <value>
        /// The submitter.
        /// </value>
        public User Submitter { get; set; }

        /// <summary>
        /// Gets or sets the submit time.
        /// </summary>
        /// <value>
        /// The submit time.
        /// </value>
        public DateTime? SubmitTime { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Assessment"/> class.
        /// </summary>
        public Assessment()
        {
        }
    }
}