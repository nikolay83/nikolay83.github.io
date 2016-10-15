/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Tests;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// Unit tests for <see cref="AssessmentService"/> class.
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
    public class AssessmentServiceUnitTest : BaseServiceUnitTest<AssessmentService>
    {
        #region Create(Assessment) method tests

        /// <summary>
        /// Accuracy test of <c>Create</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestCreateAccuracy()
        {
            // arrange
            Assessment entity = CreateTestEntity<Assessment>(1);
            entity.Submitter = new User { Username = "CoeusOwner" };
            entity.BUFunctionalApprover = new User { Username = "CoeusBUFunctionalApprover" };
            entity.BURiskManagementApprover = new User { Username = "CoeusBURiskManagementApprover" };
            entity.DivisionalRiskManagementApprover = new User { Username = "CoeusDivisionalRiskManagementApprover" };
            entity.Rejecter = new User { Username = "CoeusAdmin" };

            // act
            Assessment result = instance.Create(entity);

            // assert
            AssertEntityExists(entity);

            ResetDynamicFields(result, true);
            AssertResult(result);
        }

        #endregion Create(Assessment) method tests

        #region Update(Assessment) method tests

        /// <summary>
        /// Accuracy test of <c>Update</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestUpdateAccuracy()
        {
            // arrange
            Assessment entity = CreateTestEntity<Assessment>(4);
            entity.Submitter = new User { Username = "CouesOwner" };
            entity.BUFunctionalApprover = null;
            entity.BURiskManagementApprover = null;
            entity.DivisionalRiskManagementApprover = null;
            entity.Rejecter = new User { Username = "CoeusAdmin" };
            entity.Id = 2;

            // act
            Assessment result = instance.Update(entity);

            // assert
            AssertEntityExists(entity);

            ResetDynamicFields(result, false);
            AssertResult(result);
        }

        #endregion Update(Assessment) method tests

        #region Get(long) method tests

        /// <summary>
        /// Accuracy test of <c>Get</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAccuracy()
        {
            // arrange
            long id = 1;

            // act
            Assessment result = instance.Get(id);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Get</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAccuracy2()
        {
            // arrange
            long id = 3;

            // act
            Assessment result = instance.Get(id);

            // assert
            AssertResult(result);
        }

        #endregion Get(long) method tests

        #region Search(AssessmentSearchCriteria) method tests

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy1()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria { };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy2()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.Draft,
                    ApprovalStatus.Approved,
                    ApprovalStatus.AwaitingBUFunctionalApproval,
                    ApprovalStatus.AwaitingBURiskManagementApproval
                },
                ApproverUsernames = new List<string>
                {
                    "CoeusBUFunctionalApprover",
                    "CoeusDivisionalRiskManagementApprover",
                    "CoeusAdmin"
                },
                BusinessUnitIds = new List<long> { 1, 2, 3 }
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy3()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                BURiskManagementApproverUsername = "CoeusBURiskManagementApprover",
                DivisionRiskManagementApproverUsername = "CoeusDivisionalRiskManagementApprover",
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy4()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                BUFunctionalApproverUsername = "CoeusBUFunctionalApprover",
                PageNumber = 2,
                PageSize = 2,
                SortBy = "ApprovalStatus",
                SortType = SortType.Descending
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy5()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                SubmitDateStart = new DateTime(2016, 3, 1),
                SubmitDateEnd = new DateTime(2016, 4, 30),
                SubmitterUsernames = new List<string> { "CoeusOwner" },
                PageNumber = 1,
                PageSize = 2,
                SortBy = "SubmitTime",
                SortType = SortType.Ascending
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy6()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                RejecterUsername = "CoeusDivisionalRiskManagementApprover"
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>Search</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestSearchAccuracy7()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                DepartmentHeaderOrFunctionalAreaOwner = "FunctionalAreaOwner4",
                Title = "itle1"
            };

            // act
            SearchResult<Assessment> result = instance.Search(criteria);

            // assert
            AssertResult(result);
        }

        #endregion Search(AssessmentSearchCriteria) method tests

        #region ExportAssessment(Assessment, ExportFormat, Stream) method tests

        /// <summary>
        /// Accuracy test of <c>ExportAssessment</c> method,
        /// no exception is expected to be thrown.
        /// </summary>
        [TestMethod]
        public void TestExportAssessmentAccuracy()
        {
            // arrange
            Assessment assessment = instance.Get(1);
            ExportFormat format = ExportFormat.Excel;

            // act
            Export<Assessment>(stream => instance.ExportAssessment(assessment, format, stream));
        }

        #endregion ExportAssessment(Assessment, ExportFormat, Stream) method tests

        #region GetOverallRiskRatingReport(Assessment) method tests

        /// <summary>
        /// Accuracy test of <c>GetOverallRiskRatingReport</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetOverallRiskRatingReportAccuracy()
        {
            // arrange
            Assessment assessment = instance.Get(1);

            // act
            OverallRiskRatingReport result = instance.GetOverallRiskRatingReport(assessment);

            // assert
            AssertResult(result);
        }

        /// <summary>
        /// Accuracy test of <c>GetOverallRiskRatingReport</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetOverallRiskRatingReportAccuracy2()
        {
            // arrange
            Assessment assessment = instance.Get(4);

            // act
            OverallRiskRatingReport result = instance.GetOverallRiskRatingReport(assessment);

            // assert
            AssertResult(result);
        }

        #endregion GetOverallRiskRatingReport(Assessment) method tests

        #region GetCount(AssessmentSearchCriteria) method tests

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy1()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria { };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(10, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy2()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.Draft,
                    ApprovalStatus.Approved,
                    ApprovalStatus.AwaitingBUFunctionalApproval,
                    ApprovalStatus.AwaitingBURiskManagementApproval
                },
                ApproverUsernames = new List<string>
                {
                    "CoeusBUFunctionalApprover",
                    "CoeusDivisionalRiskManagementApprover",
                    "CoeusAdmin"
                },
                BusinessUnitIds = new List<long> { 1, 2, 3 }
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(2, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy3()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                BURiskManagementApproverUsername = "CoeusBURiskManagementApprover",
                DivisionRiskManagementApproverUsername = "CoeusDivisionalRiskManagementApprover",
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(3, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy4()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                BUFunctionalApproverUsername = "CoeusBUFunctionalApprover",
                PageNumber = 2,
                PageSize = 2,
                SortBy = "ApprovalStatus",
                SortType = SortType.Descending
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(5, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy5()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                SubmitDateStart = new DateTime(2016, 3, 1),
                SubmitDateEnd = new DateTime(2016, 4, 30),
                SubmitterUsernames = new List<string> { "CoeusOwnerUser1" },
                PageNumber = 1,
                PageSize = 2,
                SortBy = "SubmitTime",
                SortType = SortType.Ascending
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(4, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy6()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                RejecterUsername = "CoeusDivisionalRiskManagementApprover"
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(1, result, "Count is incorrect.");
        }

        /// <summary>
        /// Accuracy test of <c>GetCount</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCountAccuracy7()
        {
            // arrange
            var criteria = new AssessmentSearchCriteria
            {
                DepartmentHeaderOrFunctionalAreaOwner = "FunctionalAreaOwner4",
                Title = "itle1"
            };

            // act
            int result = instance.GetCount(criteria);

            // assert
            Assert.AreEqual(2, result, "Count is incorrect.");
        }

        #endregion GetCount(AssessmentSearchCriteria) method tests

        /// <summary>
        /// Resets the dynamic fields.
        /// </summary>
        /// <param name="assessment">The assessment.</param>
        /// <param name="resetId">Determines whether Id should be reset.</param>
        private static void ResetDynamicFields(Assessment assessment, bool resetId)
        {
            if (resetId)
            {
                assessment.Id = 0;
            }

            foreach (var item in assessment.FunctionPerformedSites)
            {
                item.Id = 0;
            }
            foreach (var item in assessment.PriorFunctionChanges)
            {
                item.Id = 0;
            }
            foreach (var item in assessment.FutureFunctionChanges)
            {
                item.Id = 0;
            }
            foreach (var item in assessment.KPISLAAssessments)
            {
                item.Id = 0;
            }

            foreach (var item in assessment.FunctionalAreaProcessAssessments)
            {
                item.Id = 0;
                foreach (var child in item.ControlAssessments)
                {
                    child.Id = 0;
                }
            }

            foreach (var item in assessment.ProcessRiskAssessments)
            {
                item.Id = 0;
                foreach (var child in item.ControlAssessments)
                {
                    child.Id = 0;
                }
            }
        }
    }
}