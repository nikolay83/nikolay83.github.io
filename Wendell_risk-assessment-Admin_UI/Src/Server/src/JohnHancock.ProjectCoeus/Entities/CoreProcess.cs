/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the core process. The name is core process.
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
    public class CoreProcess : FunctionalAreaLookupEntity
    {
        /// <summary>
        /// Gets or sets the sub process risks.
        /// </summary>
        /// <value>
        /// The sub process risks.
        /// </value>
        public IList<SubProcessRisk> SubProcessRisks { get; set; }

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public Category Category { get; set; }

        /// <summary>
        /// Gets or sets the control types.
        /// </summary>
        /// <value>
        /// The additional control types.
        /// </value>
        public IList<ControlType> ControlTypes { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CoreProcess"/> class.
        /// </summary>
        public CoreProcess()
        {
        }
    }
}