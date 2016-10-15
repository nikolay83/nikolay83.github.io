/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Tests;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Calculators.Impl
{
    /// <summary>
    /// Unit tests for <see cref="RiskScoreCalculator"/> class.
    /// </summary>
    ///
    /// <author>
    /// NightWolf
    /// </author>
    ///
    /// <version>
    /// 1.0
    /// </version>
    ///
    /// <copyright>
    /// Copyright (c) 2016, TopCoder, Inc. All rights reserved.
    /// </copyright>
    [TestClass]
    public class RiskScoreCalculatorUnitTest : BaseServiceUnitTest<RiskScoreCalculator>
    {
        #region GetRiskScore(string, IDictionary<string, object>) method tests

        /// <summary>
        /// Accuracy test of <c>GetRiskScore</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetRiskScoreAccuracy1()
        {
            // arrange
            string type = "ResidualOverallRiskScore";
            Assessment entity = CreateTestEntity<Assessment>(1);
            var parameters = new Dictionary<string, object>
            {
                ["assessment"] = entity
            };

            // act
            double result = instance.GetRiskScore(type, parameters);

            // assert
            Assert.AreEqual(72.5, result, "Risk score calculated incorrectly.");
        }

        /// <summary>
        /// Accuracy test of <c>GetRiskScore</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetRiskScoreAccuracy2()
        {
            // arrange
            string type = "ResidualCategoryRiskScore";
            Assessment entity = CreateTestEntity<Assessment>(1);
            var parameters = new Dictionary<string, object>
            {
                ["assessment"] = entity,
                ["category"] = new Category { Id = 12 }
            };

            // act
            double result = instance.GetRiskScore(type, parameters);

            // assert
            Assert.AreEqual(34, result, "Risk score calculated incorrectly.");
        }

        /// <summary>
        /// Accuracy test of <c>GetRiskScore</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetRiskScoreAccuracy3()
        {
            // arrange
            string type = "LikelihoodOfOccurrenceOverallRiskScore";
            Assessment entity = CreateTestEntity<Assessment>(1);
            var parameters = new Dictionary<string, object>
            {
                ["assessment"] = entity
            };

            // act
            double result = instance.GetRiskScore(type, parameters);

            // assert
            Assert.AreEqual(29.3, result, "Risk score calculated incorrectly.");
        }

        /// <summary>
        /// Accuracy test of <c>GetRiskScore</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetRiskScoreAccuracy4()
        {
            // arrange
            string type = "RiskExposureOverallRiskScore";
            Assessment entity = CreateTestEntity<Assessment>(1);
            var parameters = new Dictionary<string, object>
            {
                ["assessment"] = entity
            };

            // act
            double result = instance.GetRiskScore(type, parameters);

            // assert
            Assert.AreEqual(21.34, result, "Risk score calculated incorrectly.");
        }

        /// <summary>
        /// Accuracy test of <c>GetRiskScore</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetRiskScoreAccuracy5()
        {
            // arrange
            string type = "KeyControlsMaturityOverallRiskScore";
            Assessment entity = CreateTestEntity<Assessment>(1);
            var parameters = new Dictionary<string, object>
            {
                ["assessment"] = entity
            };

            // act
            double result = instance.GetRiskScore(type, parameters);

            // assert
            Assert.AreEqual(63.33, Math.Round(result, 2), "Risk score calculated incorrectly.");
        }

        #endregion GetRiskScore(string, IDictionary<string, object>) method tests
    }
}