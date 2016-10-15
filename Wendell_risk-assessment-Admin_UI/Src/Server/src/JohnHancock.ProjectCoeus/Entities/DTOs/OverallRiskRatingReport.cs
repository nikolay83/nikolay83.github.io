/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the overall risk rating report.
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
    public class OverallRiskRatingReport
    {
        /// <summary>
        /// Gets or sets the likelihood of occurrence report.
        /// </summary>
        /// <value>
        /// The likelihood of occurrence report.
        /// </value>
        public RiskReport LikelihoodOfOccurrenceReport { get; set; }

        /// <summary>
        /// Gets or sets the risk exposure report.
        /// </summary>
        /// <value>
        /// The risk exposure report.
        /// </value>
        public RiskReport RiskExposureReport { get; set; }

        /// <summary>
        /// Gets or sets the key controls maturity report.
        /// </summary>
        /// <value>
        /// The key controls maturity report.
        /// </value>
        public RiskReport KeyControlsMaturityReport { get; set; }

        /// <summary>
        /// Gets or sets the residual risk report.
        /// </summary>
        /// <value>
        /// The residual risk report.
        /// </value>
        public ResidualRiskReport ResidualRiskReport { get; set; }

        /// <summary>
        /// Gets or sets the categories.
        /// </summary>
        /// <value>
        /// The categories.
        /// </value>
        public IList<Category> Categories { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="OverallRiskRatingReport"/> class.
        /// </summary>
        public OverallRiskRatingReport()
        {
        }
    }
}
