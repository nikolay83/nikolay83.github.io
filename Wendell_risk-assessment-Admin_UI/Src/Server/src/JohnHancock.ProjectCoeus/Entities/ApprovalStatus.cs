/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An enum that represents approval status.
    /// </summary>
    ///
    /// <threadsafety>
    /// Enum is immutable and thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public enum ApprovalStatus
    {
        /// <summary>
        /// Represents Draft status.
        /// </summary>
        Draft = 4,

        /// <summary>
        /// Represents Approved status.
        /// </summary>
        Approved = 0,

        /// <summary>
        /// Represents Rejected status.
        /// </summary>
        Rejected = 5,

        /// <summary>
        /// Represents 'Awaiting BU Functional Approval' status.
        /// </summary>
        AwaitingBUFunctionalApproval = 1,

        /// <summary>
        /// Represents 'Awaiting BU Risk Management Approval' status.
        /// </summary>
        AwaitingBURiskManagementApproval = 2,

        /// <summary>
        /// Represents 'Awaiting Division Risk Management Approval' status.
        /// </summary>
        AwaitingDivisionalRiskManagementApproval = 3
    }
}