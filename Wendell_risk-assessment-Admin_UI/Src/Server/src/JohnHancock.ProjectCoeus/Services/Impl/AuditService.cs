/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This service class provides operation for creating audit records.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class AuditService : BasePersistenceService, IAuditService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuditService"/> class.
        /// </summary>
        public AuditService()
        {
        }

        /// <summary>
        /// Creates given audit record.
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
        public void Create(AuditRecord auditRecord)
        {
            ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(auditRecord, "auditRecord");
                db.AuditRecordSet.Add(auditRecord);
            },
            "creating audit record",
            saveChanges: true,
            parameters: auditRecord);
        }
    }
}
