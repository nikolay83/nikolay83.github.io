/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Exceptions;
using JohnHancock.ProjectCoeus.Services;
using Microsoft.Practices.Unity;
using System.Collections.Generic;
using System.Web.Http;

namespace JohnHancock.ProjectCoeus.API.Controllers
{
    /// <summary>
    /// This controller exposes actions to retrieve lookup entities.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    /// <remarks>
    /// Changes in 1.1:
    /// - Added new methods for site, assessmentStatus and changeType
    /// </remarks>
    ///
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.1</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    [RoutePrefix("api/v1")]
    public class LookupController : BaseController
    {
        /// <summary>
        /// Gets or sets the <see cref="ILookupService"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for retrieving lookup entities.
        /// </remarks>
        ///
        /// <value>The <see cref="ILookupService"/> dependency.</value>
        [Dependency]
        public ILookupService LookupService { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="LookupController"/> class.
        /// </summary>
        public LookupController()
        {
        }

        /// <summary>
        /// Checks that all configuration properties were properly initialized.
        /// </summary>
        ///
        /// <exception cref="ConfigurationException">
        /// If any of required injection fields are not injected or have invalid values.
        /// </exception>
        public override void CheckConfiguration()
        {
            base.CheckConfiguration();
            Helper.ValidateConfigPropertyNotNull(LookupService, nameof(LookupService));
        }

        /// <summary>
        /// Retrieves all <see cref="AssessmentStatus"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("assessmentStatuses")]
        public IList<AssessmentStatus> GetAllAssessmentStatuses()
        {
            return LookupService.GetAllAssessmentStatuses();
        }

        /// <summary>
        /// Retrieves all <see cref="ChangeType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("changeTypes")]
        public IList<ChangeType> GetAllChangeTypes()
        {
            return LookupService.GetAllChangeTypes();
        }

        /// <summary>
        /// Retrieves all <see cref="Site"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("sites")]
        public IList<Site> GetAllSites()
        {
            return LookupService.GetAllSites();
        }

        /// <summary>
        /// Retrieves all <see cref="BusinessUnit"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("businessUnits")]
        public IList<BusinessUnit> GetAllBusinessUnits()
        {
            return LookupService.GetAllBusinessUnits();
        }

        /// <summary>
        /// Retrieves all <see cref="DepartmentHead"/> entities within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("departmentHeads")]
        public IList<DepartmentHead> GetAllDepartmentHeads(long businessUnitId)
        {
            return LookupService.GetAllDepartmentHeads(businessUnitId);
        }

        /// <summary>
        /// Retrieves all <see cref="Product"/>  within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("products")]
        public IList<Product> GetAllProducts(long businessUnitId)
        {
            return LookupService.GetAllProducts(businessUnitId);
        }

        /// <summary>
        /// Retrieves all <see cref="Department"/> entities within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("departments")]
        public IList<Department> GetAllDepartments(long businessUnitId)
        {
            return LookupService.GetAllDepartments(businessUnitId);
        }

        /// <summary>
        /// Retrieves all <see cref="AssessmentType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("assessmentTypes")]
        public IList<AssessmentType> GetAllAssessmentTypes()
        {
            return LookupService.GetAllAssessmentTypes();
        }

        /// <summary>
        /// Retrieves all <see cref="RiskExposure"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("riskExposures")]
        public IList<RiskExposure> GetAllRiskExposures()
        {
            return LookupService.GetAllRiskExposures();
        }

        /// <summary>
        /// Retrieves all <see cref="Category"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("categories")]
        public IList<Category> GetAllCategories()
        {
            return LookupService.GetAllCategories();
        }

        /// <summary>
        /// Retrieves all <see cref="LikelihoodOfOccurrence"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("likelihoodOfOccurrences")]
        public IList<LikelihoodOfOccurrence> GetAllLikelihoodOfOccurrences()
        {
            return LookupService.GetAllLikelihoodOfOccurrences();
        }

        /// <summary>
        /// Retrieves all <see cref="RiskImpact"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("riskImpacts")]
        public IList<RiskImpact> GetAllRiskImpacts()
        {
            return LookupService.GetAllRiskImpacts();
        }

        /// <summary>
        /// Retrieves all <see cref="KPICategory"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("KPICategories")]
        public IList<KPICategory> GetKPICategories()
        {
            return LookupService.GetKPICategories();
        }

        /// <summary>
        /// Retrieves all <see cref="ProcessRisk"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("processRisks")]
        public IList<ProcessRisk> GetAllProcessRisks()
        {
            return LookupService.GetAllProcessRisks();
        }

        /// <summary>
        /// Retrieves all <see cref="ControlFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("controlFrequencies")]
        public IList<ControlFrequency> GetAllControlFrequencies()
        {
            return LookupService.GetAllControlFrequencies();
        }

        /// <summary>
        /// Retrieves all <see cref="ControlTrigger"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("controlTriggers")]
        public IList<ControlTrigger> GetAllControlTriggers()
        {
            return LookupService.GetAllControlTriggers();
        }

        /// <summary>
        /// Retrieves all <see cref="KeyControlsMaturity"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("keyControlsMaturities")]
        public IList<KeyControlsMaturity> GetAllKeyControlsMaturities()
        {
            return LookupService.GetAllKeyControlsMaturities();
        }

        /// <summary>
        /// Retrieves all <see cref="ControlDesign"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("controlDesigns")]
        public IList<ControlDesign> GetAllControlDesigns()
        {
            return LookupService.GetAllControlDesigns();
        }

        /// <summary>
        /// Retrieves all <see cref="TestingFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("testingFrequencies")]
        public IList<TestingFrequency> GetAllTestingFrequencies()
        {
            return LookupService.GetAllTestingFrequencies();
        }

        /// <summary>
        /// Retrieves all <see cref="Percentage"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("percentages")]
        public IList<Percentage> GetAllPercentages()
        {
            return LookupService.GetAllPercentages();
        }

        /// <summary>
        /// Retrieves all <see cref="FunctionalAreaOwner"/> entities within business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("functionalAreaOwners")]
        public IList<FunctionalAreaOwner> GetFunctionalAreaOwners(long businessUnitId)
        {
            return LookupService.GetFunctionalAreaOwners(businessUnitId);
        }

        /// <summary>
        /// Retrieves all <see cref="CoreProcess"/> entities within functional area.
        /// </summary>
        ///
        /// <param name="functionalAreaId">The functional area Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("coreProcesses")]
        public IList<CoreProcess> GetCoreProcesses(long functionalAreaId)
        {
            return LookupService.GetCoreProcesses(functionalAreaId);
        }

        /// <summary>
        /// Retrieves all <see cref="FunctionalArea"/> entities within business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpGet]
        [Route("functionalAreas")]
        public IList<FunctionalArea> GetFunctionalAreas(long businessUnitId)
        {
            return LookupService.GetFunctionalAreas(businessUnitId);
        }
    }
}