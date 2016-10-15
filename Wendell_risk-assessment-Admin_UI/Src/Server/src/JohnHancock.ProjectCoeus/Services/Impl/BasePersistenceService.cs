/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Data.Entity.Core;
using System.Diagnostics;
using System.Reflection;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This abstract class is a base for all service implementations that access database persistence.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public abstract class BasePersistenceService : BaseService
    {
        /// <summary>
        /// The connection string name to use when creating <see cref="CustomDbContext"/> instance.
        /// </summary>
        private const string ConnectionStringName = "DefaultConnectionString";

        /// <summary>
        /// Initializes a new instance of the <see cref="BasePersistenceService"/> class.
        /// </summary>
        protected BasePersistenceService()
        {
        }

        /// <summary>
        /// Creates the database context.
        /// </summary>
        ///
        /// <remarks>
        /// All thrown exceptions will be propagated to caller method.
        /// </remarks>
        ///
        /// <returns>The database context.</returns>
        protected CustomDbContext CreateDbContext()
        {
            var db = new CustomDbContext(ConnectionStringName);
            db.Configuration.LazyLoadingEnabled = false;
            return db;
        }

        /// <summary>
        /// Processes the specified action and wraps it with common logging and error handling logic.
        /// </summary>
        /// <remarks>
        /// If any exception is thrown, the <see cref="ArgumentException"/>, <see cref="ConfigurationException"/>,
        /// and <see cref="ServiceException"/> exceptions will be simply re-thrown. <see cref="EntityException"/>
        /// exceptions will be wrapped in <see cref="PersistenceException"/> exceptions. All other exceptions
        /// will be wrapped in <see cref="ServiceException"/> and thrown.
        /// </remarks>
        /// <param name="action">The action to process.</param>
        /// <param name="methodDescription">The short description of what the source method does.</param>
        /// <param name="saveChanges">The value indicating whether changes should be saved to database.</param>
        /// <param name="callingMethod">The source method information.</param>
        /// <param name="parameters">The parameters for the source method.</param>
        protected void ProcessWithDb(Action<CustomDbContext> action, string methodDescription, bool saveChanges = false,
            MethodBase callingMethod = null, params object[] parameters)
        {
            callingMethod = callingMethod ?? new StackTrace().GetFrame(1).GetMethod();
            Logger.Process(() =>
            {
                try
                {
                    using (var context = CreateDbContext())
                    {
                        action(context);
                        if (saveChanges)
                        {
                            context.SaveChanges();
                        }
                    }
                }
                catch (EntityException ex)
                {
                    throw new PersistenceException("Error occurred while accessing database persistence.", ex);
                }
            },
            methodDescription,
            callingMethod: callingMethod,
            parameters: parameters);
        }

        /// <summary>
        /// Processes the specified action and wraps it with common logging and error handling logic.
        /// </summary>
        /// <remarks>
        /// If any exception is thrown, the <see cref="ArgumentException"/>, <see cref="ConfigurationException"/>,
        /// and <see cref="ServiceException"/> exceptions will be simply re-thrown. <see cref="EntityException"/>
        /// exceptions will be wrapped in <see cref="PersistenceException"/> exceptions. All other exceptions
        /// will be wrapped in <see cref="ServiceException"/> and thrown.
        /// </remarks>
        /// <typeparam name="T">The type of the function result.</typeparam>
        /// <param name="function">The function to process.</param>
        /// <param name="methodDescription">The short description of what the source method does.</param>
        /// <param name="saveChanges">The value indicating whether changes should be saved to database.</param>
        /// <param name="callingMethod">The source method information.</param>
        /// <param name="parameters">The parameters for the source method.</param>
        /// <returns>The result of the function.</returns>
        protected T ProcessWithDb<T>(Func<CustomDbContext, T> function, string methodDescription,
            bool saveChanges = false, MethodBase callingMethod = null, params object[] parameters)
        {
            callingMethod = callingMethod ?? new StackTrace().GetFrame(1).GetMethod();
            return Logger.Process(() =>
            {
                try
                {
                    using (var context = CreateDbContext())
                    {
                        T result = function(context);
                        if (saveChanges)
                        {
                            context.SaveChanges();
                        }
                        return result;
                    }
                }
                catch (EntityException ex)
                {
                    throw new PersistenceException("Error occurred while accessing database persistence.", ex);
                }
            },
            methodDescription,
            callingMethod: callingMethod,
            parameters: parameters);
        }
    }
}
