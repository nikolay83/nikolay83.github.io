/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the process risk assessment.
    /// </summary>
    ///
    /// <remarks>
    /// Note that the properties are implemented without any validation.
    /// <para>
    /// Note that:
    /// - Exactly one of ProcessRisk and AdditionalProcess is not null.
    /// - Exactly one of ProcessRisk and AdditionalRisk is not null.
    /// </para>
    /// </remarks>
    ///
    /// <threadsafety>
    /// This class is mutable, so it is not thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class ProcessRiskAssessment : ProcessControlAssessment
    {
        /// <summary>
        /// Gets or sets the process risk.
        /// </summary>
        /// <value>
        /// The process risk.
        /// </value>
        public ProcessRisk ProcessRisk { get; set; }

        /// <summary>
        /// Gets or sets the additional process.
        /// </summary>
        /// <value>
        /// The additional process.
        /// </value>
        public string AdditionalProcess { get; set; }

        /// <summary>
        /// Gets or sets the additional risk.
        /// </summary>
        /// <value>
        /// The additional risk.
        /// </value>
        public string AdditionalRisk { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessRiskAssessment"/> class.
        /// </summary>
        public ProcessRiskAssessment()
        {
        }
    }
}