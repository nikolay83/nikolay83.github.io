/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the composite bar. It will contains several category bars.
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
    public class CompositeBar
    {
        /// <summary>
        /// Gets or sets the type of the risk.
        /// </summary>
        /// <value>
        /// The type of the risk.
        /// </value>
        public string RiskType { get; set; }

        /// <summary>
        /// Gets or sets the category bars.
        /// </summary>
        /// <value>
        /// The category bars.
        /// </value>
        public IList<CategoryBar> CategoryBars { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CompositeBar"/> class.
        /// </summary>
        public CompositeBar()
        {
        }
    }
}
