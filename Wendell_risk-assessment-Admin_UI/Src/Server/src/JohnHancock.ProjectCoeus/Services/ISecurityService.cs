/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services
{
    /// <summary>
    /// This service interface defines methods related to security operations.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface ISecurityService
    {
        /// <summary>
        /// Authenticates user and returns populated User instance in case of success.
        /// </summary>
        ///
        /// <param name="username">The username.</param>
        /// <param name="password">The user password.</param>
        /// <returns>The authenticated User entity, or null if cannot authenticate user.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="username"/> or <paramref name="password"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="username"/> or <paramref name="password"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="AuthenticationException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        User Authenticate(string username, string password);

        /// <summary>
        /// Checks whether user with the given role is authorized to perform specified action.
        /// </summary>
        ///
        /// <param name="role">The user role.</param>
        /// <param name="action">The action to perform.</param>
        /// <returns>True if user with the given role is authorized to perform
        /// specified action; otherwise False.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="action"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="action"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="AuthenticationException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        bool IsAuthorized(Role role, string action);

        /// <summary>
        /// Generates token for the user with the given username.
        /// </summary>
        ///
        /// <param name="username">The username.</param>
        /// <returns>The generated token.</returns>
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
        Token GenerateToken(string username);

        /// <summary>
        /// Authenticates user and returns populated User instance in case of success.
        /// </summary>
        ///
        /// <param name="token">The token.</param>
        /// <returns>The authenticated User entity, or null if cannot authenticate user.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="token"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="token"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        User Authenticate(string token);

        /// <summary>
        /// Revokes the token.
        /// </summary>
        ///
        /// <param name="token">The token to revoke.</param>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="token"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="token"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        void RevokeToken(string token);
    }
}
