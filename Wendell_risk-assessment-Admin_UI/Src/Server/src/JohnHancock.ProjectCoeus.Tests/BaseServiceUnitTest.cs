/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Calculators.Impl;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Services.Impl;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace JohnHancock.ProjectCoeus.Tests
{
    /// <summary>
    /// Represents base class for all unit test classes.
    /// </summary>
    ///
    /// <typeparam name="TTestClass">The actual type of class being tested.</typeparam>
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
    public abstract class BaseServiceUnitTest<TTestClass>
    {
        /// <summary>
        /// Represents the service instance used for tests.
        /// </summary>
        protected TTestClass instance = TestHelper.UnityContainer.Resolve<TTestClass>();

        /// <summary>
        /// Sets up the environment before executing each test in this class.
        /// </summary>
        [TestInitialize]
        public virtual void SetUp()
        {
            TestHelper.FillDatabase();
        }

        /// <summary>
        /// Sets up the environment after executing each test in this class.
        /// </summary>
        [TestCleanup]
        public virtual void CleanUp()
        {
            TestHelper.ClearDatabase();
        }

        /// <summary>
        /// Accuracy test of <c>CheckConfiguration</c> method,
        /// should not throw exceptions.
        /// </summary>
        [TestMethod]
        public void TestCheckConfigurationAccuracy()
        {
            // act
            var service = instance as BaseService;
            if (service != null)
            {
                service.CheckConfiguration();
            }
            else
            {
                (instance as RiskScoreCalculator).CheckConfiguration();
            }
        }

        /// <summary>
        /// Compares actual test result with the expected result in JSON format.
        /// </summary>
        /// <typeparam name="T">The type of the result.</typeparam>
        /// <param name="result">The result.</param>
        /// <param name="testName">Name of the test.</param>
        protected void AssertResult<T>(T result, [CallerMemberName]string testName = null)
        {
            bool develop = true;
            if (develop)
            {
                // TODO: remove
                if (!Directory.Exists(TestHelper.TestResultsPath))
                {
                    Directory.CreateDirectory(TestHelper.TestResultsPath);
                }

                string jsonResult = JsonConvert.SerializeObject(result, TestHelper.SerializerSettings);

                string filePath = Path.Combine(TestHelper.TestResultsPath, $"{GetType().Name}.{testName}.json");
                if (!File.Exists(filePath))
                {
                    File.WriteAllText(filePath, jsonResult);
                }
                else
                {
                    string existing = File.ReadAllText(filePath);
                    if (jsonResult != existing)
                    {
                        File.WriteAllText(filePath, jsonResult);
                        Assert.Fail("mismatch");
                    }
                }
            }
            else
            {
                string filePath = Path.Combine(TestHelper.TestResultsPath, $"{GetType().Name}.{testName}.json");
                string expected = File.ReadAllText(filePath);
                string actual = JsonConvert.SerializeObject(result, TestHelper.SerializerSettings);
                Assert.AreEqual(expected, actual, "Mismatch in actual and expected result when serialized to JSON.");
            }
        }

        #region test entities

        /// <summary>
        /// Creates entity of the given type with the properties populated based on the seed value.
        /// </summary>
        /// <typeparam name="T">The type of the entity to create.</typeparam>
        /// <param name="seed">The seed.</param>
        /// <returns></returns>
        protected static T CreateTestEntity<T>(int seed = 1)
            where T : new()
        {
            return (T)CreateTestEntity(typeof(T), seed, 1);
        }

        /// <summary>
        /// Creates entity of the given type with the properties populated based on the seed value.
        /// </summary>
        /// <param name="entityType">Type of the entity.</param>
        /// <param name="seed">The seed.</param>
        /// <param name="depth">The current depth in entity generation.</param>
        /// <returns>Created entity.</returns>
        private static object CreateTestEntity(Type entityType, int seed, int depth)
        {
            if (depth > 4)
            {
                return null;
            }

            object result = Activator.CreateInstance(entityType);
            IEnumerable<PropertyInfo> properties = entityType.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.CanWrite);

            int incremental = 0;
            foreach (PropertyInfo property in properties)
            {
                incremental++;
                object value = CreateTestInstance(property.PropertyType, seed, incremental, depth, property.Name);
                property.SetValue(result, value);
            }

            var identifiable = result as IdentifiableEntity;
            if (identifiable != null)
            {
                identifiable.Id = seed;
            }

            return result;
        }

        /// <summary>
        /// Creates instance of the given type with the properties populated based on the seed and incremental values.
        /// </summary>
        /// <param name="type">The type of the instance to create.</param>
        /// <param name="seed">The seed.</param>
        /// <param name="incremental">The incremental.</param>
        /// <param name="depth">The current depth in entity generation.</param>
        /// <param name="name">The optional value to set for string types.</param>
        /// <returns>Created instance.</returns>
        private static object CreateTestInstance(Type type, int seed, int incremental, int depth, string name = null)
        {
            if (type.Namespace.StartsWith(typeof(IdentifiableEntity).Namespace))
            {
                return CreateTestEntity(type, seed, depth + 1);
            }

            if (type.IsGenericType && (type.GetGenericTypeDefinition() == typeof(Nullable<>)))
            {
                if (seed % 3 == 2)
                {
                    return null;
                }

                type = type.GenericTypeArguments[0];
            }

            if (type.IsGenericType && (type.GetGenericTypeDefinition() == typeof(IList<>)))
            {
                Type typeArgument = type.GenericTypeArguments[0];
                var listType = typeof(List<>).MakeGenericType(typeArgument);
                var list = Activator.CreateInstance(listType);
                MethodInfo addMethod = listType.GetMethod("Add");
                for (int i = 0; i < 2; i++)
                {
                    object item = CreateTestInstance(typeArgument, seed + i, incremental + i + 1, depth);
                    addMethod.Invoke(list, new[] { item });
                }
                return list;
            }

            if (type == typeof(string))
            {
                return $"{name}_{seed}";
            }

            if (type == typeof(long) || type == typeof(int))
            {
                return seed * 10 + incremental;
            }

            if (type == typeof(double))
            {
                return seed * 2.45;
            }

            if (type == typeof(bool))
            {
                return seed % 2 == 1;
            }

            if (type == typeof(DateTime))
            {
                return CreateTestDate(incremental);
            }

            if (type.IsEnum)
            {
                var values = Enum.GetValues(type);
                return values.GetValue(seed % values.Length);
            }

            throw new NotSupportedException($"Type {type.Name} not supported.");
        }

        /// <summary>
        /// Creates random date based on <paramref name="seed"/>.
        /// </summary>
        /// <param name="seed">The seed.</param>
        /// <returns>The random test date.</returns>
        private static DateTime CreateTestDate(int seed)
        {
            int year = 2000 + seed;
            int month = seed % 12 + 1;
            int day = seed % 28 + 1;
            return new DateTime(year, month, day);
        }

        #endregion test entities

        #region check whether entity exists in DB

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        protected static void AssertEntityExists(Assessment entity)
        {
            var parameters = new Dictionary<string, object>();
            parameters["BusinessUnit_Id"] = entity.BusinessUnit?.Id;
            parameters["Product_Id"] = entity.Product?.Id;
            parameters["Department_Id"] = entity.Department?.Id;
            parameters["DepartmentHead_Id"] = entity.DepartmentHead?.Id;
            parameters["FunctionalAreaOwner_Id"] = entity.FunctionalAreaOwner?.Id;
            parameters["FunctionalArea_Id"] = entity.FunctionalArea?.Id;
            parameters["FunctionalAreaDescription"] = entity.FunctionalAreaDescription;
            parameters["AssessmentType_Id"] = entity.AssessmentType?.Id;
            parameters["AssessmentStatus_Id"] = entity.AssessmentStatus?.Id;
            parameters["AssessmentDueDate"] = entity.AssessmentDueDate;
            parameters["OverallRiskRatingCommentary"] = entity.OverallRiskRatingCommentary;
            parameters["ApprovalStatus"] = (int)entity.ApprovalStatus;
            parameters["BUFunctionalApproverUsername"] = entity.BUFunctionalApproverUsername;
            parameters["BUFunctionalApproveTime"] = entity.BUFunctionalApproveTime;
            parameters["BURiskManagementApproverUsername"] = entity.BURiskManagementApproverUsername;
            parameters["BURiskManagementApproveTime"] = entity.BURiskManagementApproveTime;
            parameters["DivisionalRiskManagementApproverUsername"] = entity.DivisionalRiskManagementApproverUsername;
            parameters["DivisionalRiskManagementApproveTime"] = entity.DivisionalRiskManagementApproveTime;
            parameters["RejecterUsername"] = entity.RejecterUsername;
            parameters["RejectTime"] = entity.RejectTime;
            parameters["RejectionReason"] = entity.RejectionReason;
            parameters["RejectPhase"] = entity.RejectPhase;
            parameters["SubmitterUsername"] = entity.SubmitterUsername;
            parameters["SubmitTime"] = entity.SubmitTime;
            parameters["Title"] = entity.Title;
            parameters["CreatedBy"] = entity.CreatedBy;
            parameters["CreatedTime"] = entity.CreatedTime;
            parameters["LastUpdatedBy"] = entity.LastUpdatedBy;
            parameters["LastUpdatedTime"] = entity.LastUpdatedTime;
            parameters["Id"] = entity.Id;
            TestHelper.AssertDatabaseRecordExists(typeof(Assessment).Name, parameters);

            // FunctionPerformedSites
            if (entity.FunctionPerformedSites != null)
            {
                foreach (FunctionPerformedSite item in entity.FunctionPerformedSites)
                {
                    AssertEntityExists(item, entity.Id);
                }
            }

            // PriorFunctionChanges
            if (entity.PriorFunctionChanges != null)
            {
                foreach (FunctionChange item in entity.PriorFunctionChanges)
                {
                    AssertEntityExists(item, entity.Id, "PriorFunctionChanges");
                }
            }

            // FutureFunctionChanges
            if (entity.FutureFunctionChanges != null)
            {
                foreach (FunctionChange item in entity.FutureFunctionChanges)
                {
                    AssertEntityExists(item, entity.Id, "FutureFunctionChanges");
                }
            }

            // KPISLAAssessments
            if (entity.KPISLAAssessments != null)
            {
                foreach (KPISLAAssessment item in entity.KPISLAAssessments)
                {
                    AssertEntityExists(item, entity.Id);
                }
            }

            if (entity.FunctionalAreaProcessAssessments != null)
            {
                foreach (FunctionalAreaProcessAssessment item in entity.FunctionalAreaProcessAssessments)
                {
                    AssertEntityExists(item, entity.Id);
                }
            }

            // ProcessRiskAssessments
            if (entity.ProcessRiskAssessments != null)
            {
                foreach (ProcessRiskAssessment item in entity.ProcessRiskAssessments)
                {
                    AssertEntityExists(item, entity.Id);
                }
            }
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        protected static void AssertEntityExists(AuditRecord entity)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Username"] = entity.Username;
            parameters["Action"] = entity.Action;
            parameters["ItemType"] = entity.ItemType;
            parameters["ItemId"] = entity.ItemId;
            parameters["Field"] = entity.Field;
            parameters["PreviousValue"] = entity.PreviousValue;
            parameters["NewValue"] = entity.NewValue;
            parameters["Timestamp"] = entity.Timestamp;
            parameters["Id"] = entity.Id;

            TestHelper.AssertDatabaseRecordExists(typeof(AuditRecord).Name, parameters);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="pcaId">The PCA Id.</param>
        protected static void AssertEntityExists(ControlAssessment entity, long pcaId)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Id"] = entity.Id;
            parameters["ProcessControlAssessment_Id"] = pcaId;
            parameters["ControlType_Id"] = entity.ControlType.Id;
            parameters["OtherControlType"] = entity.OtherControlType;
            parameters["ControlObjective"] = entity.ControlObjective;
            parameters["ControlFrequency_Id"] = entity.ControlFrequency.Id;
            parameters["KeyControlsMaturity_Id"] = entity.KeyControlsMaturity.Id;
            TestHelper.AssertDatabaseRecordExists(typeof(ControlAssessment).Name, parameters);

            // ControlDesigns
            if (entity.ControlDesigns != null)
            {
                foreach (ControlDesign item in entity.ControlDesigns)
                {
                    parameters = new Dictionary<string, object>();
                    parameters["ControlAssessmentId"] = entity.Id;
                    parameters["ControlDesignId"] = item.Id;
                    TestHelper.AssertDatabaseRecordExists("ControlAssessment_ControlDesign", parameters);
                }
            }

            // TestingFrequencies
            if (entity.TestingFrequencies != null)
            {
                foreach (TestingFrequency item in entity.TestingFrequencies)
                {
                    parameters = new Dictionary<string, object>();
                    parameters["ControlAssessmentId"] = entity.Id;
                    parameters["TestingFrequencyId"] = item.Id;
                    TestHelper.AssertDatabaseRecordExists("ControlAssessment_TestingFrequency", parameters);
                }
            }

            // ControlTriggers
            if (entity.ControlTriggers != null)
            {
                foreach (ControlTrigger item in entity.ControlTriggers)
                {
                    parameters = new Dictionary<string, object>();
                    parameters["ControlAssessmentId"] = entity.Id;
                    parameters["ControlTriggerId"] = item.Id;
                    TestHelper.AssertDatabaseRecordExists("ControlAssessment_ControlTrigger", parameters);
                }
            }
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="assessmentId">The assessment Id.</param>
        /// <param name="tableName">The table name.</param>
        protected static void AssertEntityExists(FunctionChange entity, long assessmentId, string tableName)
        {
            var parameters = new Dictionary<string, object>();
            parameters["AssessmentId"] = assessmentId;
            parameters["FunctionChangeId"] = entity.Id;

            TestHelper.AssertDatabaseRecordExists(tableName, parameters);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="assessmentId">The assessment Id.</param>
        protected static void AssertEntityExists(FunctionPerformedSite entity, long assessmentId)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Site_Id"] = entity.Site.Id;
            parameters["Percentage_Id"] = entity.Percentage.Id;
            parameters["Id"] = entity.Id;
            parameters["Assessment_Id"] = assessmentId;

            TestHelper.AssertDatabaseRecordExists(typeof(FunctionPerformedSite).Name, parameters);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="assessmentId">The assessment Id.</param>
        protected static void AssertEntityExists(KPISLAAssessment entity, long assessmentId)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Id"] = entity.Id;
            parameters["Assessment_Id"] = assessmentId;
            parameters["KPI_Id"] = entity.KPI.Id;
            parameters["KPICategory_Id"] = entity.KPICategory.Id;
            parameters["Category_Id"] = entity.Category.Id;
            parameters["SelectedSLA_Id"] = entity.SelectedSLA.Id;
            parameters["AdditionalKPI"] = entity.AdditionalKPI;
            parameters["AdditionalSLA"] = entity.AdditionalSLA;
            parameters["AdditionalKPICategory"] = entity.AdditionalKPICategory;
            TestHelper.AssertDatabaseRecordExists(typeof(KPISLAAssessment).Name, parameters);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="assessmentId">The assessment Id.</param>
        protected static void AssertEntityExists(FunctionalAreaProcessAssessment entity, long assessmentId)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Id"] = entity.Id;
            parameters["Assessment_Id"] = assessmentId;
            parameters["SubProcessRisk_Id"] = entity.SubProcessRisk.Id;
            parameters["CoreProcess_Id"] = entity.CoreProcess.Id;
            parameters["AdditionalCoreProcess"] = entity.AdditionalCoreProcess;
            parameters["AdditionalSubProcess"] = entity.AdditionalSubProcess;
            parameters["AdditionalRisk"] = entity.AdditionalRisk;
            TestHelper.AssertDatabaseRecordExists(typeof(FunctionalAreaProcessAssessment).Name, parameters);

            AssertEntityExists(entity);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        /// <param name="assessmentId">The assessment Id.</param>
        protected static void AssertEntityExists(ProcessRiskAssessment entity, long assessmentId)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Id"] = entity.Id;
            parameters["Assessment_Id"] = assessmentId;
            parameters["ProcessRisk_Id"] = entity.ProcessRisk.Id;
            parameters["AdditionalProcess"] = entity.AdditionalProcess;
            parameters["AdditionalRisk"] = entity.AdditionalRisk;
            TestHelper.AssertDatabaseRecordExists(typeof(ProcessRiskAssessment).Name, parameters);

            AssertEntityExists(entity);
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        protected static void AssertEntityExists(ProcessControlAssessment entity)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Id"] = entity.Id;
            parameters["LikelihoodOfOccurrence_Id"] = entity.LikelihoodOfOccurrence.Id;
            parameters["RiskExposure_Id"] = entity.RiskExposure.Id;
            parameters["Category_Id"] = entity.Category.Id;
            TestHelper.AssertDatabaseRecordExists(typeof(ProcessControlAssessment).Name, parameters);

            // RiskImpacts
            if (entity.RiskImpacts != null)
            {
                foreach (RiskImpact item in entity.RiskImpacts)
                {
                    parameters = new Dictionary<string, object>();
                    parameters["ProcessControlAssessmentId"] = entity.Id;
                    parameters["RiskImpactId"] = item.Id;
                    TestHelper.AssertDatabaseRecordExists("ProcessControlAssessment_RiskImpact", parameters);
                }
            }

            // ControlAssessments
            foreach (ControlAssessment item in entity.ControlAssessments)
            {
                AssertEntityExists(item, entity.Id);
            }
        }

        /// <summary>
        /// Asserts that the given entity exists in DB.
        /// </summary>
        /// <param name="entity">The entity to check.</param>
        protected static void AssertEntityExists(Token entity)
        {
            var parameters = new Dictionary<string, object>();
            parameters["Username"] = entity.Username;
            parameters["TokenValue"] = entity.TokenValue;
            parameters["Id"] = entity.Id;

            TestHelper.AssertDatabaseRecordExists(typeof(Token).Name, parameters);
        }

        #endregion check whether entity exists in DB

        #region export

        /// <summary>
        /// Exports the data from the stream.
        /// </summary>
        /// <typeparam name="T">The type of the entities to export.</typeparam>
        /// <param name="action">The action to provide output stream.</param>
        protected static void Export<T>(Action<FileStream> action)
        {
            string fileName = $"{typeof(T).Name}s_{DateTime.Now.Ticks}.xlsx";
            Export(action, fileName);
        }

        /// <summary>
        /// Exports the data from the stream.
        /// </summary>
        /// <param name="action">The action to provide output stream.</param>
        /// <param name="fileName">The file name.</param>
        private static void Export(Action<FileStream> action, string fileName)
        {
            if (!string.IsNullOrWhiteSpace(TestHelper.ExportedFilesPath))
            {
                if (!Directory.Exists(TestHelper.ExportedFilesPath))
                {
                    Directory.CreateDirectory(TestHelper.ExportedFilesPath);
                }

                string filePath = Path.Combine(TestHelper.ExportedFilesPath, fileName);
                using (var outputStream = new FileStream(filePath, FileMode.Create))
                {
                    action(outputStream);
                }
            }
        }

        #endregion export
    }
}