/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the KPI category. The name is category.
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
    public class KPICategory : LookupEntity
    {
        /// <summary>
        /// Gets or sets the KPISLA entities.
        /// </summary>
        /// <value>
        /// The KPISLA entities.
        /// </value>
        public IList<KPI> KPIs { get; set; }

        /// <summary>
        /// Gets or sets the SLA entities.
        /// </summary>
        /// <value>
        /// The SLA entities.
        /// </value>
        public IList<SLA> SLAs { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="KPICategory"/> class.
        /// </summary>
        public KPICategory()
        {
        }
    }
}