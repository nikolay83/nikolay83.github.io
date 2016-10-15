/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An enum that represents the role.
    /// </summary>
    ///
    /// <threadsafety>
    /// Enum is immutable and thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright> 
    public enum Role
    {
        /// <summary>
        /// Represents Owner role.
        /// </summary>
        Owner,

        /// <summary>
        /// Represents 'BU functional Approver' role.
        /// </summary>
        BUFunctionalApprover,

        /// <summary>
        /// Represents 'BU Risk Management Approver' role.
        /// </summary>
        BURiskManagementApprover,

        /// <summary>
        /// Represents 'Division Risk Management Approver' role.
        /// </summary>
        DivisionalRiskManagementApprover,

        /// <summary>
        /// Represents Admin role.
        /// </summary>
        Admin
    }
}
