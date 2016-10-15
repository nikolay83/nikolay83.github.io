/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Collections.Generic;
using System.Linq;
using Ciloci.Flee;
using JohnHancock.ProjectCoeus.Exceptions;
using JohnHancock.ProjectCoeus.Services.Impl;
using log4net;
using Microsoft.Practices.Unity;

namespace JohnHancock.ProjectCoeus.Calculators.Impl
{
    /// <summary>
    /// This class provides operation for calculating risk score.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class RiskScoreCalculator : IRiskScoreCalculator
    {
        /// <summary>
        /// Represents valid key values for <c>Expressions</c> property.
        /// </summary>
        private static readonly HashSet<string> ValidExpressionKeys = new HashSet<string>
        {
            "ResidualOverallRiskScore",
            "ResidualCategoryRiskScore",
            "LikelihoodOfOccurrenceOverallRiskScore",
            "RiskExposureOverallRiskScore",
            "KeyControlsMaturityOverallRiskScore",
        };

        /// <summary>
        /// Gets or sets the logger used for logging in this class.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for logging in this class and its sub-classes.
        /// </remarks>
        ///
        /// <value>The logger.</value>
        [Dependency]
        public ILog Logger { get; set; }

        /// <summary>
        /// Gets or sets the mapping from risk score types to risk score expressions.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization. Should not contain empty keys or null/empty values.
        /// It should contain following keys (risk score types):
        /// <list type="bullet">
        /// <item>ResidualOverallRiskScore</item>
        /// <item>ResidualCategoryRiskScore</item>
        /// <item>LikelihoodOfOccurrenceOverallRiskScore</item>
        /// <item>RiskExposureOverallRiskScore</item>
        /// <item>KeyControlsMaturityOverallRiskScore</item>
        /// </list>
        /// </para>
        /// It is used for calculating risk scores.
        /// </remarks>
        ///
        /// <value>The mapping from risk types to risk score expressions.</value>
        [Dependency]
        public IDictionary<string, string> Expressions { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="RiskScoreCalculator"/> class.
        /// </summary>
        public RiskScoreCalculator()
        {
        }

        /// <summary>
        /// Checks that all configuration properties were properly initialized.
        /// </summary>
        ///
        /// <exception cref="ConfigurationException">
        /// If any of required injection fields are not injected or have invalid values.
        /// </exception>
        public void CheckConfiguration()
        {
            Helper.ValidateConfigPropertyNotNull(Logger, nameof(Logger));
            Helper.ValidateConfigProperty(Expressions, nameof(Expressions));

            if (!Expressions.Keys.All(key => ValidExpressionKeys.Contains(key)))
            {
                throw new ConfigurationException(
                    $"Configurable property {nameof(Expressions)} contains not allowed key(s).");
            }
        }

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
        public double GetRiskScore(string type, IDictionary<string, object> parameters)
        {
            return Logger.Process(() =>
            {
                Helper.ValidateArgumentNotNullOrEmpty(type, nameof(type));
                Helper.ValidateArgumentNotNullOrEmpty(parameters, nameof(parameters));

                string expression;
                if (!Expressions.TryGetValue(type, out expression))
                {
                    throw new ServiceException(
                        $"The risk score type '{type}' is not configured in Expressions configuration property.");
                }

                var context = new ExpressionContext();
                context.Imports.AddType(typeof(Math));
                foreach (KeyValuePair<string, object> pair in parameters)
                {
                    context.Variables[pair.Key] = pair.Value;
                }

                IDynamicExpression dynamicExpression = context.CompileDynamic(expression);
                return Convert.ToDouble(dynamicExpression.Evaluate());
            },
            "retrieving risk score",
            parameters: new object[] { type, parameters });
        }
    }
}
