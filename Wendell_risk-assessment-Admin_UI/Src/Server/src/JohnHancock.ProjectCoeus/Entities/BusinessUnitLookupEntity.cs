/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the business unit lookup entity.
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
    public abstract class BusinessUnitLookupEntity : LookupEntity
    {
        /// <summary>
        /// Gets or sets the business unit identifier.
        /// </summary>
        /// <value>
        /// The business unit identifier.
        /// </value>
        public long BusinessUnitId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BusinessUnitLookupEntity"/> class.
        /// </summary>
        protected BusinessUnitLookupEntity()
        {
        }
    }
}
