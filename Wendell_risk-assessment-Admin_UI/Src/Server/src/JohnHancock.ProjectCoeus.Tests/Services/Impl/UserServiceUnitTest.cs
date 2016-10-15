/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Tests;
using System.Linq;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// Unit tests for <see cref="UserService"/> class.
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
    public class UserServiceUnitTest : BaseServiceUnitTest<UserService>
    {
        #region GetByUsername(string) method tests

        /// <summary>
        /// Accuracy test of <c>GetByUsername</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByUsernameAccuracy1()
        {
            // arrange
            string username = "CoeusOwner";

            // act
            User result = instance.GetByUsername(username);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByUsername</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByUsernameAccuracy2()
        {
            // arrange
            string username = "CoeusBUFunctionalApprover";

            // act
            User result = instance.GetByUsername(username);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByUsername</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByUsernameAccuracy3()
        {
            // arrange
            string username = "CoeusBURiskManagementApprover";

            // act
            User result = instance.GetByUsername(username);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByUsername</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByUsernameAccuracy4()
        {
            // arrange
            string username = "CoeusDivisionalRiskManagementApprover";

            // act
            User result = instance.GetByUsername(username);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByUsername</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByUsernameAccuracy5()
        {
            // arrange
            string username = "CoeusAdmin";

            // act
            User result = instance.GetByUsername(username);

            // assert
            AssertResult(result);
        }

        #endregion

        #region GetByRealName(string) method tests

        /// <summary>
        /// Accuracy test of <c>GetByRealName</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByRealNameAccuracy1()
        {
            // arrange
            string realName = "Coeus Owner";

            // act
            IList<User> result = instance.GetByRealName(realName);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByRealName</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByRealNameAccuracy2()
        {
            // arrange
            string realName = "Coeus";

            // act
            IList<User> result = instance.GetByRealName(realName);
            result = result.OrderBy(x => x.Username).ToList();

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetByRealName</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetByRealNameAccuracy3()
        {
            // arrange
            string realName = "Approver";

            // act
            IList<User> result = instance.GetByRealName(realName);
            result = result.OrderBy(x => x.Username).ToList();

            // assert
            AssertResult(result);
        }

        #endregion
    }
}
