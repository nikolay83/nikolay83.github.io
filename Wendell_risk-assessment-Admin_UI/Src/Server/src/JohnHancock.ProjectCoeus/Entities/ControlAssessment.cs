/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the control assessment.
    /// </summary>
    ///
    /// <remarks>
    /// Note that the properties are implemented without any validation.
    ///
    /// Changes in 1.1:
    ///     - Added 'OtherTestingFrequency' and 'OtherKeyControlMaturity'
    /// </remarks>
    ///
    /// <threadsafety>
    /// This class is mutable, so it is not thread-safe.
    /// </threadsafety>
    ///
    ///
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class ControlAssessment : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the type of the control.
        /// </summary>
        /// <value>
        /// The type of the control.
        /// </value>
        public ControlType ControlType { get; set; }

        /// <summary>
        /// Gets or sets the type of the other control.
        /// </summary>
        /// <value>
        /// The type of the other control.
        /// </value>
        public string OtherControlType { get; set; }

        /// <summary>
        /// Gets or sets the control objective.
        /// </summary>
        /// <value>
        /// The control objective.
        /// </value>
        public string ControlObjective { get; set; }

        /// <summary>
        /// Gets or sets the control frequency.
        /// </summary>
        /// <value>
        /// The control frequency.
        /// </value>
        public ControlFrequency ControlFrequency { get; set; }

        /// <summary>
        /// Gets or sets the control designs.
        /// </summary>
        /// <value>
        /// The control designs.
        /// </value>
        public IList<ControlDesign> ControlDesigns { get; set; }

        /// <summary>
        /// Gets or sets the testing frequencies.
        /// </summary>
        /// <value>
        /// The testing frequencies.
        /// </value>
        public IList<TestingFrequency> TestingFrequencies { get; set; }

        /// <summary>
        /// Gets or sets the other user defined testing frequency.
        /// </summary>
        /// <value>
        /// The other user defined testing frequency.
        /// </value>
        public string OtherTestingFrequency { get; set; }

        /// <summary>
        /// Gets or sets the control triggers.
        /// </summary>
        /// <value>
        /// The control triggers.
        /// </value>
        public IList<ControlTrigger> ControlTriggers { get; set; }

        /// <summary>
        /// Gets or sets the key controls maturity.
        /// </summary>
        /// <value>
        /// The key controls maturity.
        /// </value>
        public KeyControlsMaturity KeyControlsMaturity { get; set; }

        /// <summary>
        /// Gets or sets the other user defined key control maturity.
        /// </summary>
        /// <value>
        /// The other user defined key control maturity.
        /// </value>
        public string OtherKeyControlMaturity { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ControlAssessment"/> class.
        /// </summary>
        public ControlAssessment()
        {
        }
    }
}