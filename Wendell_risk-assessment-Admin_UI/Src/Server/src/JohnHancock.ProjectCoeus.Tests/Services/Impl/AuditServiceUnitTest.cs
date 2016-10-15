/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using Microsoft.VisualStudio.TestTools.UnitTesting;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Tests;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// Unit tests for <see cref="AuditService"/> class.
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
    public class AuditServiceUnitTest : BaseServiceUnitTest<AuditService>
    {
        #region Create(AuditRecord) method tests

        /// <summary>
        /// Accuracy test of <c>Create</c> method,
        /// no exception is expected to be thrown.
        /// </summary>
        [TestMethod]
        public void TestCreateAccuracy1()
        {
            // arrange
            AuditRecord auditRecord = CreateTestEntity<AuditRecord>(1);

            // act
            instance.Create(auditRecord);

            // assert
            AssertEntityExists(auditRecord);
        }

        /// <summary>
        /// Accuracy test of <c>Create</c> method,
        /// no exception is expected to be thrown.
        /// </summary>
        [TestMethod]
        public void TestCreateAccuracy2()
        {
            // arrange
            AuditRecord auditRecord = CreateTestEntity<AuditRecord>(2);
            auditRecord.PreviousValue = null;
            auditRecord.NewValue = null;

            // act
            instance.Create(auditRecord);

            // assert
            AssertEntityExists(auditRecord);
        }

        #endregion
    }
}
