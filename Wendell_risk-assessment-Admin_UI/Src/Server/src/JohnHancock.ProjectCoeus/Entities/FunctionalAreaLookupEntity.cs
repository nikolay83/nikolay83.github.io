/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the functional area lookup entity.
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
    public abstract class FunctionalAreaLookupEntity : LookupEntity
    {
        /// <summary>
        /// Gets or sets the functional area identifier.
        /// </summary>
        /// <value>
        /// The functional area identifier.
        /// </value>
        public long FunctionalAreaId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FunctionalAreaLookupEntity"/> class.
        /// </summary>
        protected FunctionalAreaLookupEntity()
        {
        }
    }
}
