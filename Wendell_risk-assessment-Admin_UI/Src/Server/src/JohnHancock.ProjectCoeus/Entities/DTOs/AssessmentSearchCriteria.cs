/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the assessment search criteria.
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
    public class AssessmentSearchCriteria : BaseSearchCriteria
    {
        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the submit date start.
        /// </summary>
        /// <value>
        /// The submit date start.
        /// </value>
        public DateTime? SubmitDateStart { get; set; }

        /// <summary>
        /// Gets or sets the submit date end.
        /// </summary>
        /// <value>
        /// The submit date end.
        /// </value>
        public DateTime? SubmitDateEnd { get; set; }

        /// <summary>
        /// Gets or sets the name of the approver real.
        /// </summary>
        /// <value>
        /// The name of the approver real.
        /// </value>
        public string ApproverRealName { get; set; }

        /// <summary>
        /// Gets or sets the approval statuses.
        /// </summary>
        /// <value>
        /// The approval statuses.
        /// </value>
        public IList<ApprovalStatus> ApprovalStatuses { get; set; }

        /// <summary>
        /// Gets or sets the name of the submitter real.
        /// </summary>
        /// <value>
        /// The name of the submitter real.
        /// </value>
        public string SubmitterRealName { get; set; }

        /// <summary>
        /// Gets or sets the business unit ids.
        /// </summary>
        /// <value>
        /// The business unit ids.
        /// </value>
        public IList<long> BusinessUnitIds { get; set; }

        /// <summary>
        /// Gets or sets the approver usernames.
        /// </summary>
        /// <value>
        /// The approver usernames.
        /// </value>
        public IList<string> ApproverUsernames { get; set; }

        /// <summary>
        /// Gets or sets the submitter usernames.
        /// </summary>
        /// <value>
        /// The submitter usernames.
        /// </value>
        public IList<string> SubmitterUsernames { get; set; }

        /// <summary>
        /// Gets or sets the department header or functional area owner.
        /// </summary>
        /// <value>
        /// The department header or functional area owner.
        /// </value>
        public string DepartmentHeaderOrFunctionalAreaOwner { get; set; }

        /// <summary>
        /// Gets or sets the business unit functional approver username.
        /// </summary>
        /// <value>
        /// The business unit functional approver username.
        /// </value>
        public string BUFunctionalApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the business unit risk management approver username.
        /// </summary>
        /// <value>
        /// The business unit risk management approver username.
        /// </value>
        public string BURiskManagementApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the division risk management approver username.
        /// </summary>
        /// <value>
        /// The division risk management approver username.
        /// </value>
        public string DivisionRiskManagementApproverUsername { get; set; }

        /// <summary>
        /// Gets or sets the rejecter username.
        /// </summary>
        /// <value>
        /// The rejecter username.
        /// </value>
        public string RejecterUsername { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AssessmentSearchCriteria"/> class.
        /// </summary>
        public AssessmentSearchCriteria()
        {
        }
    }
}
