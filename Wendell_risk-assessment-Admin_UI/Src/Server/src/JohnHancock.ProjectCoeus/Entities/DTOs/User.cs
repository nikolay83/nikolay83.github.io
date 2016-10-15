/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Entities.DTOs
{
    /// <summary>
    /// An entity class that represents the user.
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
    public class User
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        /// <value>
        /// The first name.
        /// </value>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        /// <value>
        /// The last name.
        /// </value>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the role.
        /// </summary>
        /// <value>
        /// The role.
        /// </value>
        public Role? Role { get; set; }

        /// <summary>
        /// Gets or sets the business units.
        /// </summary>
        /// <value>
        /// The business units.
        /// </value>
        public IList<BusinessUnit> BusinessUnits { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="User"/> class.
        /// </summary>
        public User()
        {
        }
    }
}
