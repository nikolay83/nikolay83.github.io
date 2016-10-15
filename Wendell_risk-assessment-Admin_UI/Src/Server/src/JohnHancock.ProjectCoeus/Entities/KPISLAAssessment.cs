/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the KPI SLA assessment.
    /// </summary>
    ///
    /// <remarks>
    /// Note that the properties are implemented without any validation.
    /// <para>
    /// Note that:
    /// - Exactly one of KPISLA/SelectedSLA and AdditionalKPI is not null.
    /// - Exactly one of KPISLA/SelectedSLA and AdditionalSLA is not null.
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
    public class KPISLAAssessment : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public Category Category { get; set; }

        /// <summary>
        /// Gets or sets the KPI category.
        /// </summary>
        /// <value>
        /// The KPI category.
        /// </value>
        public KPICategory KPICategory { get; set; }

        /// <summary>
        /// Gets or sets the KPI.
        /// </summary>
        /// <value>
        /// The KPI.
        /// </value>
        public KPI KPI { get; set; }

        /// <summary>
        /// Gets or sets the selected SLA.
        /// </summary>
        /// <value>
        /// The selected SLA.
        /// </value>
        public SLA SelectedSLA { get; set; }

        /// <summary>
        /// Gets or sets the additional KPI category.
        /// </summary>
        /// <value>
        /// The additional KPI category.
        /// </value>
        public string AdditionalKPICategory { get; set; }

        /// <summary>
        /// Gets or sets the additional KPI.
        /// </summary>
        /// <value>
        /// The additional KPI.
        /// </value>
        public string AdditionalKPI { get; set; }

        /// <summary>
        /// Gets or sets the additional SLA.
        /// </summary>
        /// <value>
        /// The additional SLA.
        /// </value>
        public string AdditionalSLA { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="KPISLAAssessment"/> class.
        /// </summary>
        public KPISLAAssessment()
        {
        }
    }
}