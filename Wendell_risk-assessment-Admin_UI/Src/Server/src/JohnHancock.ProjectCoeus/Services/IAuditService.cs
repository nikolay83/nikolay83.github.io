/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services
{
    /// <summary>
    /// This service interface defines method for creating audit records.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface IAuditService
    {
        /// <summary>
        /// Saves given audit record to Database.
        /// </summary>
        ///
        /// <param name="auditRecord">The audit record.</param>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="auditRecord"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        void Create(AuditRecord auditRecord);
    }
}
