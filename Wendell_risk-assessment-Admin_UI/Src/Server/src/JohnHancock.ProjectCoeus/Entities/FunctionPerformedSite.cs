/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the functional performed site.
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
    public class FunctionPerformedSite : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the site.
        /// </summary>
        /// <value>
        /// The site.
        /// </value>
        public Site Site { get; set; }

        /// <summary>
        /// Gets or sets the percentage.
        /// </summary>
        /// <value>
        /// The percentage.
        /// </value>
        public Percentage Percentage { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FunctionPerformedSite"/> class.
        /// </summary>
        public FunctionPerformedSite()
        {
        }
    }
}
