/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the functional area process assessment.
    /// </summary>
    ///
    /// <remarks>
    /// Note that the properties are implemented without any validation.
    /// <para>
    /// Note that:
    /// - Exactly one of CoreProcess and AdditionalCoreProcess is not null.
	/// - Exactly one of SubProcessRisk and AdditionalSubProcess is not null.
    /// </para>
    /// </remarks>
    ///
    /// <threadsafety>
    /// This class is mutable, so it is not thread-safe.
    /// </threadsafety>
    ///
    /// <author>veshu</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class FunctionalAreaProcessAssessment : ProcessControlAssessment
    {
        /// <summary>
        /// Gets or sets the core process.
        /// </summary>
        /// <value>
        /// The core process.
        /// </value>
        public CoreProcess CoreProcess { get; set; }

        /// <summary>
        /// Gets or sets the additional core process.
        /// </summary>
        /// <value>
        /// The additional core process.
        /// </value>
        public string AdditionalCoreProcess { get; set; }

        /// <summary>
        /// Gets or sets the sub process and risk.
        /// </summary>
        /// <value>
        /// The sub process and risk.
        /// </value>
        public SubProcessRisk SubProcessRisk { get; set; }

        /// <summary>
        /// Gets or sets the additional sub process.
        /// </summary>
        /// <value>
        /// The additional sub process.
        /// </value>
        public string AdditionalSubProcess { get; set; }

        /// <summary>
        /// Gets or sets the additional risk.
        /// </summary>
        /// <value>
        /// The additional risk.
        /// </value>
        public string AdditionalRisk { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FunctionalAreaProcessAssessment"/> class.
        /// </summary>
        public FunctionalAreaProcessAssessment()
        {
        }
    }
}