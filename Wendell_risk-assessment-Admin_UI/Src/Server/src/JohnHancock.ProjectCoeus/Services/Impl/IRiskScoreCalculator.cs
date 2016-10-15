/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Collections.Generic;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This service interface defines method to calculate risk scores.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface IRiskScoreCalculator
    {
        /// <summary>
        /// Gets the risk score for the given risk score type and expression parameters.
        /// </summary>
        /// 
        /// <param name="type">The risk score type.</param>
        /// <param name="parameters">The expression parameters.</param>
        /// <returns>The calculated risk score.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="type"/> or <paramref name="parameters"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="type"/> or <paramref name="parameters"/> is empty.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        double GetRiskScore(string type, IDictionary<string, object> parameters);
    }
}
