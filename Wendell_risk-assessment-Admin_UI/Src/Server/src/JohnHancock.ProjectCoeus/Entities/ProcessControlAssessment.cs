/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the process control assessment.
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
    public abstract class ProcessControlAssessment : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the likelihood of occurrence.
        /// </summary>
        /// <value>
        /// The likelihood of occurrence.
        /// </value>
        public LikelihoodOfOccurrence LikelihoodOfOccurrence { get; set; }

        /// <summary>
        /// Gets or sets the other user defined likelihood of occurrence.
        /// </summary>
        /// <value>
        /// The other user defined likelihood of occurrence.
        /// </value>
        public string OtherLikelihoodOfOccurrence { get; set; }

        /// <summary>
        /// Gets or sets the risk impacts.
        /// </summary>
        /// <value>
        /// The risk impacts.
        /// </value>
        public IList<RiskImpact> RiskImpacts { get; set; }

        /// <summary>
        /// Gets or sets the risk exposure.
        /// </summary>
        /// <value>
        /// The risk exposure.
        /// </value>
        public RiskExposure RiskExposure { get; set; }

        /// <summary>
        /// Gets or sets the control assessments.
        /// </summary>
        /// <value>
        /// The control assessments.
        /// </value>
        public IList<ControlAssessment> ControlAssessments { get; set; }

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public Category Category { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessControlAssessment"/> class.
        /// </summary>
        protected ProcessControlAssessment()
        {
        }
    }
}