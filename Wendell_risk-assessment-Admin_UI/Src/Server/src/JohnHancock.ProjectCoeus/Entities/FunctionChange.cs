/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;

namespace JohnHancock.ProjectCoeus.Entities
{
    /// <summary>
    /// An entity class that represents the functional change.
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
    public class FunctionChange : IdentifiableEntity
    {
        /// <summary>
        /// Gets or sets the type of the change.
        /// </summary>
        /// <value>
        /// The type of the change.
        /// </value>
        public ChangeType ChangeType { get; set; }

        /// <summary>
        /// Gets or sets the change time.
        /// </summary>
        /// <value>
        /// The change time.
        /// </value>
        public DateTime ChangeTime { get; set; }

        /// <summary>
        /// Gets or sets the change description.
        /// </summary>
        /// <value>
        /// The change description.
        /// </value>
        public string ChangeDescription { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FunctionChange"/> class.
        /// </summary>
        public FunctionChange()
        {
        }
    }
}
