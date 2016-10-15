/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the risk report.
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
    public class RiskReport
    {
        /// <summary>
        /// Gets or sets the overall risk score.
        /// </summary>
        /// <value>
        /// The overall risk score.
        /// </value>
        public double OverallRiskScore { get; set; }

        /// <summary>
        /// Gets or sets the maximum risk type.
        /// </summary>
        /// <value>
        /// The maximum risk type.
        /// </value>
        public string MaxRiskType { get; set; }

        /// <summary>
        /// Gets or sets the composite bars.
        /// </summary>
        /// <value>
        /// The composite bars.
        /// </value>
        public IList<CompositeBar> CompositeBars { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RiskReport"/> class.
        /// </summary>
        public RiskReport()
        {
        }
    }
}
