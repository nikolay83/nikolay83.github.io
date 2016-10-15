/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An enum that represents the phase in which the assessment is rejected.
    /// </summary>
    ///
    /// <threadsafety>
    /// Enum is immutable and thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public enum RejectPhase
    {
        /// <summary>
        /// Represents BUFunctionalApproval reject phase.
        /// </summary>
        BUFunctionalApproval,

        /// <summary>
        /// Represents BURiskManagementApproval reject phase.
        /// </summary>
        BURiskManagementApproval,

        /// <summary>
        /// Represents  DivisionalRiskManagementApproval reject phase.
        /// </summary>
        DivisionalRiskManagementApproval
    }
}
