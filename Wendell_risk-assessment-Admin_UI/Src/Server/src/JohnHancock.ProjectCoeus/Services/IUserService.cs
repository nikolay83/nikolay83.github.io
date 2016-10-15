/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Collections.Generic;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services
{
    /// <summary>
    /// This service interface defines methods for retrieving users.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface IUserService
    {
        /// <summary>
        /// Gets the user by username.
        /// </summary>
        /// 
        /// <param name="username">The username.</param>
        /// <returns>The user with the given username, or null if not found.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="username"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="username"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        User GetByUsername(string username);

        /// <summary>
        /// Gets all users whose real name (first name + ' ' + last name) contains <paramref name="realName"/>.
        /// </summary>
        /// 
        /// <param name="realName">The user real name substring to match.</param>
        /// <returns>Matching users, or empty list if none were found.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="realName"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="realName"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<User> GetByRealName(string realName);
    }
}
