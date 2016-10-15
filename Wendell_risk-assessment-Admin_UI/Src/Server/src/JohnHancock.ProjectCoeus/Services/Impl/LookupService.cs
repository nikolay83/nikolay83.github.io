/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Exceptions;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This service class provides operations for retrieving lookup entities.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    /// <remarks>
    /// Changes in 1.1:
    /// - Added new methods for site, assessmentStatus and changeType</remarks>
    ///
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.1</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class LookupService : BasePersistenceService, ILookupService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LookupService"/> class.
        /// </summary>
        public LookupService()
        {
        }

        /// <summary>
        /// Retrieves all <see cref="AssessmentStatus"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<AssessmentStatus> GetAllAssessmentStatuses()
        {
            return GetAll<AssessmentStatus>();
        }

        /// <summary>
        /// Retrieves all <see cref="ChangeType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<ChangeType> GetAllChangeTypes()
        {
            return GetAll<ChangeType>();
        }

        /// <summary>
        /// Retrieves all <see cref="Site"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<Site> GetAllSites()
        {
            return GetAll<Site>();
        }

        /// <summary>
        /// Retrieves all <see cref="BusinessUnit"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<BusinessUnit> GetAllBusinessUnits()
        {
            return GetAll<BusinessUnit>();
        }

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
        public IList<DepartmentHead> GetAllDepartmentHeads(long businessUnitId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(businessUnitId, nameof(businessUnitId));
                return db.DepartmentHeadSet.Where(x => x.BusinessUnitId == businessUnitId).ToList();
            },
           $"retrieving {typeof(DepartmentHead).Name} entities",
           parameters: businessUnitId);
        }

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
        public IList<Product> GetAllProducts(long businessUnitId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(businessUnitId, nameof(businessUnitId));
                return db.ProductSet.Where(x => x.BusinessUnitId == businessUnitId).ToList();
            },
            $"retrieving {typeof(Product).Name} entities",
            parameters: businessUnitId);
        }

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
        public IList<Department> GetAllDepartments(long businessUnitId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(businessUnitId, nameof(businessUnitId));
                return db.DepartmentSet.Where(x => x.BusinessUnitId == businessUnitId).ToList();
            },
             $"retrieving {typeof(Department).Name} entities",
             parameters: businessUnitId);
        }

        /// <summary>
        /// Retrieves all <see cref="AssessmentType"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<AssessmentType> GetAllAssessmentTypes()
        {
            return GetAll<AssessmentType>();
        }

        /// <summary>
        /// Retrieves all <see cref="RiskExposure"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<RiskExposure> GetAllRiskExposures()
        {
            return GetAll<RiskExposure>();
        }

        /// <summary>
        /// Retrieves all <see cref="Category"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<Category> GetAllCategories()
        {
            return GetAll<Category>();
        }

        /// <summary>
        /// Retrieves all <see cref="LikelihoodOfOccurrence"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<LikelihoodOfOccurrence> GetAllLikelihoodOfOccurrences()
        {
            return GetAll<LikelihoodOfOccurrence>();
        }

        /// <summary>
        /// Retrieves all <see cref="RiskImpact"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<RiskImpact> GetAllRiskImpacts()
        {
            return GetAll<RiskImpact>();
        }

        /// <summary>
        /// Retrieves all <see cref="KPICategory"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<KPICategory> GetKPICategories()
        {
            return GetAll<KPICategory>(includeChildren: query => query.Include(x => x.SLAs).Include(p => p.KPIs));
        }

        /// <summary>
        /// Retrieves all <see cref="ProcessRisk"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<ProcessRisk> GetAllProcessRisks()
        {
            return GetAll<ProcessRisk>(includeChildren: query =>
                query.Include(x => x.Category).Include(x => x.ControlTypes));
        }

        /// <summary>
        /// Retrieves all <see cref="ControlFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<ControlFrequency> GetAllControlFrequencies()
        {
            return GetAll<ControlFrequency>();
        }

        /// <summary>
        /// Retrieves all <see cref="ControlTrigger"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<ControlTrigger> GetAllControlTriggers()
        {
            return GetAll<ControlTrigger>();
        }

        /// <summary>
        /// Retrieves all <see cref="KeyControlsMaturity"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<KeyControlsMaturity> GetAllKeyControlsMaturities()
        {
            return GetAll<KeyControlsMaturity>();
        }

        /// <summary>
        /// Retrieves all <see cref="ControlDesign"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<ControlDesign> GetAllControlDesigns()
        {
            return GetAll<ControlDesign>();
        }

        /// <summary>
        /// Retrieves all <see cref="TestingFrequency"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<TestingFrequency> GetAllTestingFrequencies()
        {
            return GetAll<TestingFrequency>();
        }

        /// <summary>
        /// Retrieves all <see cref="Percentage"/> entities.
        /// </summary>
        ///
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        public IList<Percentage> GetAllPercentages()
        {
            return GetAll<Percentage>();
        }

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
        public IList<FunctionalAreaOwner> GetFunctionalAreaOwners(long businessUnitId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(businessUnitId, nameof(businessUnitId));
                return db.FunctionalAreaOwnerSet.Where(x => x.BusinessUnitId == businessUnitId).ToList();
            },
            $"retrieving {typeof(FunctionalAreaOwner).Name} entities",
            parameters: businessUnitId);
        }

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
        public IList<CoreProcess> GetCoreProcesses(long functionalAreaId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(functionalAreaId, nameof(functionalAreaId));
                return db.CoreProcessSet.Where(c => c.FunctionalAreaId == functionalAreaId)
                .Include(x => x.ControlTypes).Include(x => x.Category).Include(x => x.SubProcessRisks).ToList();
            },
            $"retrieving {typeof(CoreProcess).Name} entities",
            parameters: functionalAreaId);
        }

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
        public IList<FunctionalArea> GetFunctionalAreas(long businessUnitId)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentPositive(businessUnitId, nameof(businessUnitId));
                return db.FunctionalAreaSet.Where(x => x.BusinessUnitId == businessUnitId).ToList();
            },
            $"retrieving {typeof(FunctionalArea).Name} entities",
            parameters: businessUnitId);
        }

        /// <summary>
        /// Retrieves all lookup entities of type <typeparamref name="T"/> matching given
        /// predicate in case it is not <c>null</c>.
        /// </summary>
        ///
        /// <typeparam name="T">The type of the lookup entities to retrieve.</typeparam>
        /// <param name="predicate">The optional predicate to match.</param>
        /// <param name="includeChildren">The optional delegate that is used to include child entities.</param>
        /// <returns>The retrieved entities. Empty list will be returned in case none is found.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        private IList<T> GetAll<T>(Expression<Func<T, bool>> predicate = null,
            Func<IQueryable<T>, IQueryable<T>> includeChildren = null)
            where T : LookupEntity
        {
            return ProcessWithDb(
                db =>
                {
                    IQueryable<T> query = db.Set<T>();
                    if (predicate != null)
                    {
                        query = query.Where(predicate);
                    }

                    if (includeChildren != null)
                    {
                        query = includeChildren(query);
                    }

                    return query.ToList();
                },
                $"retrieving {typeof(T).Name} entities",
                callingMethod: new StackTrace().GetFrame(1).GetMethod());
        }
    }
}