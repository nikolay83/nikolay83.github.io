/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the process and risk entity. The name is process, the 'Risk' field is risk.
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
    /// <author>veshu</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public abstract class ProcessRiskEntity : LookupEntity
    {
        /// <summary>
        /// Gets or sets the risk.
        /// </summary>
        /// <value>
        /// The risk.
        /// </value>
        public string Risk { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessRiskEntity"/> class.
        /// </summary>
        protected ProcessRiskEntity()
        {
        }
    }
}