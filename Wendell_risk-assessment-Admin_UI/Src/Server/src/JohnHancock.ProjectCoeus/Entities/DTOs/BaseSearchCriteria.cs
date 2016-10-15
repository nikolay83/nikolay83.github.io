/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the base search criteria.
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
    public class BaseSearchCriteria
    {
        /// <summary>
        /// Gets or sets the page size.
        /// </summary>
        /// <value>
        /// The page size.
        /// </value>
        public int PageSize { get; set; }

        /// <summary>
        /// Gets or sets the page number.
        /// </summary>
        /// <value>
        /// The page number.
        /// </value>
        public int PageNumber { get; set; }

        /// <summary>
        /// Gets or sets the sort column.
        /// </summary>
        /// <value>
        /// The sort column.
        /// </value>
        public string SortBy { get; set; }

        /// <summary>
        /// Gets or sets the sort order.
        /// </summary>
        /// <value>
        /// The sort order.
        /// </value>
        public SortType SortType { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BaseSearchCriteria"/> class.
        /// </summary>
        public BaseSearchCriteria()
        {
        }
    }
}
