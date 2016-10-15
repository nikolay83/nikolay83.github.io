/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Exceptions;
using System;
using System.Collections.Generic;

namespace JohnHancock.ProjectCoeus.Services
{
    /// <summary>
    /// This service interface defines methods to retrieve lookup entities.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <remarks>
    /// Changes in 1.1:
    /// - Added new methods for site, assessmentStatus and changeType</remarks>
    ///
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.1</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface ILookupService
    {
        /// <summary>
        /// Retrieves all <see cref="AssessmentStatus"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<AssessmentStatus> GetAllAssessmentStatuses();

        /// <summary>
        /// Retrieves all <see cref="ChangeType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<ChangeType> GetAllChangeTypes();

        /// <summary>
        /// Retrieves all <see cref="Site"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<Site> GetAllSites();

        /// <summary>
        /// Retrieves all <see cref="BusinessUnit"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<BusinessUnit> GetAllBusinessUnits();

        /// <summary>
        /// Retrieves all <see cref="DepartmentHead"/> entities within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<DepartmentHead> GetAllDepartmentHeads(long businessUnitId);

        /// <summary>
        /// Retrieves all <see cref="Product"/> entities within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<Product> GetAllProducts(long businessUnitId);

        /// <summary>
        /// Retrieves all <see cref="Department"/> entities within a business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit id.</param>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<Department> GetAllDepartments(long businessUnitId);

        /// <summary>
        /// Retrieves all <see cref="AssessmentType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<AssessmentType> GetAllAssessmentTypes();

        /// <summary>
        /// Retrieves all <see cref="RiskExposure"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<RiskExposure> GetAllRiskExposures();

        /// <summary>
        /// Retrieves all <see cref="Category"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<Category> GetAllCategories();

        /// <summary>
        /// Retrieves all <see cref="LikelihoodOfOccurrence"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<LikelihoodOfOccurrence> GetAllLikelihoodOfOccurrences();

        /// <summary>
        /// Retrieves all <see cref="RiskImpact"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<RiskImpact> GetAllRiskImpacts();

        /// <summary>
        /// Retrieves all <see cref="KPICategory"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<KPICategory> GetKPICategories();

        /// <summary>
        /// Retrieves all <see cref="ProcessRisk"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<ProcessRisk> GetAllProcessRisks();

        /// <summary>
        /// Retrieves all <see cref="ControlFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<ControlFrequency> GetAllControlFrequencies();

        /// <summary>
        /// Retrieves all <see cref="ControlTrigger"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<ControlTrigger> GetAllControlTriggers();

        /// <summary>
        /// Retrieves all <see cref="KeyControlsMaturity"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<KeyControlsMaturity> GetAllKeyControlsMaturities();

        /// <summary>
        /// Retrieves all <see cref="ControlDesign"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<ControlDesign> GetAllControlDesigns();

        /// <summary>
        /// Retrieves all <see cref="TestingFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<TestingFrequency> GetAllTestingFrequencies();

        /// <summary>
        /// Retrieves all <see cref="Percentage"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<Percentage> GetAllPercentages();

        /// <summary>
        /// Retrieves all <see cref="FunctionalAreaOwner"/> entities within business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="ArgumentException">
        /// If <paramref name="businessUnitId"/> is not positive.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<FunctionalAreaOwner> GetFunctionalAreaOwners(long businessUnitId);

        /// <summary>
        /// Retrieves all <see cref="CoreProcess"/> entities within functional area.
        /// </summary>
        /// <param name="functionalAreaId">The functional area Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="ArgumentException">
        /// If <paramref name="functionalAreaId"/> is not positive.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        IList<CoreProcess> GetCoreProcesses(long functionalAreaId);

        /// <summary>
        /// Retrieves all <see cref="FunctionalArea"/> entities within business unit.
        /// </summary>
        ///
        /// <param name="businessUnitId">The business unit Id.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="ArgumentException">
        /// If <paramref name="businessUnitId"/> is not positive.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        IList<FunctionalArea> GetFunctionalAreas(long businessUnitId);
    }
}