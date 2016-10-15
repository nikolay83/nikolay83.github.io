/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Tests;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// Unit tests for <see cref="LookupService"/> class.
    /// </summary>
    ///
    /// <remarks>
    /// Changes in 1.1:
    ///     - Added new test cases for new methods
    /// </remarks>
    /// <author>
    /// NightWolf, veshu
    /// </author>
    ///
    /// <version>
    /// 1.1
    /// </version>
    ///
    /// <copyright>
    /// Copyright (c) 2016, TopCoder, Inc. All rights reserved.
    /// </copyright>
    [TestClass]
    public class LookupServiceUnitTest : BaseServiceUnitTest<LookupService>
    {
        #region GetAllAssessmentStatuses() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllAssessmentStatuses</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllAssessmentStatusesAccuracy()
        {
            // act
            IList<AssessmentStatus> result = instance.GetAllAssessmentStatuses();

            // assert
            AssertResult(result);
        }

        #endregion GetAllAssessmentStatuses() method tests

        #region GetAllChangeTypes() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllChangeTypes</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllChangeTypesAccuracy()
        {
            // act
            IList<ChangeType> result = instance.GetAllChangeTypes();

            // assert
            AssertResult(result);
        }

        #endregion GetAllChangeTypes() method tests

        #region GetAllSites() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllSites</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllSitesAccuracy()
        {
            // act
            IList<Site> result = instance.GetAllSites();

            // assert
            AssertResult(result);
        }

        #endregion GetAllSites() method tests

        #region GetAllBusinessUnits() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllBusinessUnits</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllBusinessUnitsAccuracy()
        {
            // act
            IList<BusinessUnit> result = instance.GetAllBusinessUnits();

            // assert
            AssertResult(result);
        }

        #endregion GetAllBusinessUnits() method tests

        #region GetAllDepartmentHeads(long) method tests

        /// <summary>
        /// Accuracy test of <c>GetAllDepartmentHeads</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllDepartmentHeadsAccuracy()
        {
            // arrange
            long businessUnitId = 1;

            // act
            IList<DepartmentHead> result = instance.GetAllDepartmentHeads(businessUnitId);

            // assert
            AssertResult(result);
        }

        #endregion GetAllDepartmentHeads(long) method tests

        #region GetAllProducts() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllProducts</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllProductsAccuracy()
        {
            // arrange
            long businessUnitId = 1;

            // act
            IList<Product> result = instance.GetAllProducts(businessUnitId);

            // assert
            AssertResult(result);
        }

        #endregion GetAllProducts() method tests

        #region GetAllDepartments() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllDepartments</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllDepartmentsAccuracy()
        {
            // arrange
            long businessUnitId = 1;

            // act
            IList<Department> result = instance.GetAllDepartments(businessUnitId);

            // assert
            AssertResult(result);
        }

        #endregion GetAllDepartments() method tests

        #region GetAllAssessmentTypes() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllAssessmentTypes</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllAssessmentTypesAccuracy()
        {
            // act
            IList<AssessmentType> result = instance.GetAllAssessmentTypes();

            // assert
            AssertResult(result);
        }

        #endregion GetAllAssessmentTypes() method tests

        #region GetAllRiskExposures() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllRiskExposures</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllRiskExposuresAccuracy()
        {
            // act
            IList<RiskExposure> result = instance.GetAllRiskExposures();

            // assert
            AssertResult(result);
        }

        #endregion GetAllRiskExposures() method tests

        #region GetAllCategories() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllCategories</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllCategoriesAccuracy()
        {
            // act
            IList<Category> result = instance.GetAllCategories();

            // assert
            AssertResult(result);
        }

        #endregion GetAllCategories() method tests

        #region GetAllLikelihoodOfOccurrences() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllLikelihoodOfOccurrences</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllLikelihoodOfOccurrencesAccuracy()
        {
            // act
            IList<LikelihoodOfOccurrence> result = instance.GetAllLikelihoodOfOccurrences();

            // assert
            AssertResult(result);
        }

        #endregion GetAllLikelihoodOfOccurrences() method tests

        #region GetAllRiskImpacts() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllRiskImpacts</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllRiskImpactsAccuracy()
        {
            // act
            IList<RiskImpact> result = instance.GetAllRiskImpacts();

            // assert
            AssertResult(result);
        }

        #endregion GetAllRiskImpacts() method tests

        #region GetKPICategories() method tests

        /// <summary>
        /// Accuracy test of <c>GetKPICategories</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetKPICategoriesAccuracy()
        {
            // act
            IList<KPICategory> result = instance.GetKPICategories();

            // assert
            AssertResult(result);
        }

        #endregion GetKPICategories() method tests

        #region GetAllProcessRisks() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllProcessRisks</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllProcessRisksAccuracy()
        {
            // act
            IList<ProcessRisk> result = instance.GetAllProcessRisks();

            // assert
            AssertResult(result);
        }

        #endregion GetAllProcessRisks() method tests

        #region GetAllControlFrequencies() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllControlFrequencies</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllControlFrequenciesAccuracy()
        {
            // act
            IList<ControlFrequency> result = instance.GetAllControlFrequencies();

            // assert
            AssertResult(result);
        }

        #endregion GetAllControlFrequencies() method tests

        #region GetAllControlTriggers() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllControlTriggers</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllControlTriggersAccuracy()
        {
            // act
            IList<ControlTrigger> result = instance.GetAllControlTriggers();

            // assert
            AssertResult(result);
        }

        #endregion GetAllControlTriggers() method tests

        #region GetAllKeyControlsMaturities() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllKeyControlsMaturities</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllKeyControlsMaturitiesAccuracy()
        {
            // act
            IList<KeyControlsMaturity> result = instance.GetAllKeyControlsMaturities();

            // assert
            AssertResult(result);
        }

        #endregion GetAllKeyControlsMaturities() method tests

        #region GetAllControlDesigns() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllControlDesigns</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllControlDesignsAccuracy()
        {
            // act
            IList<ControlDesign> result = instance.GetAllControlDesigns();

            // assert
            AssertResult(result);
        }

        #endregion GetAllControlDesigns() method tests

        #region GetAllTestingFrequencies() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllTestingFrequencies</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllTestingFrequenciesAccuracy()
        {
            // act
            IList<TestingFrequency> result = instance.GetAllTestingFrequencies();

            // assert
            AssertResult(result);
        }

        #endregion GetAllTestingFrequencies() method tests

        #region GetAllPercentages() method tests

        /// <summary>
        /// Accuracy test of <c>GetAllPercentages</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetAllPercentagesAccuracy()
        {
            // act
            IList<Percentage> result = instance.GetAllPercentages();

            // assert
            AssertResult(result);
        }

        #endregion GetAllPercentages() method tests

        #region GetFunctionalAreaOwners(long) method tests

        /// <summary>
        /// Accuracy test of <c>GetFunctionalAreaOwners</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetFunctionalAreaOwnersAccuracy()
        {
            // arrange
            long businessUnitId = 1;

            // act
            IList<FunctionalAreaOwner> result = instance.GetFunctionalAreaOwners(businessUnitId);

            // assert
            AssertResult(result);
        }

        #endregion GetFunctionalAreaOwners(long) method tests

        #region GetControlTypes(long) method tests

        /// <summary>
        /// Accuracy test of <c>GetCoreProcesses</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetCoreProcessesAccuracy()
        {
            // arrange
            long functionalAreaId = 1;

            // act
            IList<CoreProcess> result = instance.GetCoreProcesses(functionalAreaId);

            // assert
            AssertResult(result);
        }

        #endregion GetControlTypes(long) method tests

        #region GetFunctionalAreas(long) method tests

        /// <summary>
        /// Accuracy test of <c>GetFunctionalAreas</c> method,
        /// result should be correct.
        /// </summary>
        [TestMethod]
        public void TestGetFunctionalAreasAccuracy()
        {
            // arrange
            long businessUnitId = 1;

            // act
            IList<FunctionalArea> result = instance.GetFunctionalAreas(businessUnitId);

            // assert
            AssertResult(result);
        }

        #endregion GetFunctionalAreas(long) method tests
    }
}