/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents auditable entity.
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
    public abstract class AuditableEntity : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the username of the user who created the entity.
        /// </summary>
        /// <value>
        /// The username of the user who created the entity.
        /// </value>
        public string CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets the entity created time.
        /// </summary>
        /// <value>
        /// The entity created time.
        /// </value>
        public DateTime CreatedTime { get; set; }

        /// <summary>
        /// Gets or sets the username of the user who last updated the entity.
        /// </summary>
        /// <value>
        /// The username of the user who last updated the entity.
        /// </value>
        public string LastUpdatedBy { get; set; }

        /// <summary>
        /// Gets or sets the entity last updated time.
        /// </summary>
        /// <value>
        /// The entity last updated time.
        /// </value>
        public DateTime LastUpdatedTime { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuditableEntity"/> class.
        /// </summary>
        protected AuditableEntity()
        {
        }
    }
}
