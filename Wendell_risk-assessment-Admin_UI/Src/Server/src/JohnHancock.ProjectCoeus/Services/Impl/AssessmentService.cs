/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using ClosedXML.Excel;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This service class provides operations for managing assessments and
    /// calculating overall risk rating reports.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <remarks>
    /// changes in 1.1:
    /// - fixed issues 'functionChange' should be created while creating assessment
    /// - removed duplicate category in risk report
    /// - added null condition check for nullable property
    ///
    /// changes in 1.2:
    /// - Updated 'WriteProcessControlAssessment' to export test comment if set
    /// </remarks>
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.2</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class AssessmentService : BasePersistenceService, IAssessmentService
    {
        /// <summary>
        /// The export date format.
        /// </summary>
        protected const string ExportDateFormat = "M/d/yyyy";

        /// <summary>
        /// Represents 'None' string in exported files.
        /// </summary>
        private const string None = "None";

        /// <summary>
        /// The headers for functional area process control assessment in exported documents.
        /// </summary>
        private static readonly string[] _fcaHeaders =
        {
            "Likelihood of Occurrence",
            "Risk Impact",
            "Risk Exposure",
            "Controls",
            "Controls Objective",
            "Control Frequency",
            "Control Design",
            "Testing & Frequency",
            "Control Trigger",
            "Key Controls Maturity"
        };

        /// <summary>
        /// The headers for process control assessment in exported documents.
        /// </summary>
        private static readonly string[] _pcaHeaders =
        {
            "Risk Exposure",
            "Controls",
            "Control Frequency",
            "Control Design",
            "Testing & Frequency",
            "Key Controls Maturity"
        };

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
        /// Gets or sets the <see cref="IRiskScoreCalculator"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for calculating risk score.
        /// </remarks>
        ///
        /// <value>The <see cref="IRiskScoreCalculator"/> dependency.</value>
        [Dependency]
        public IRiskScoreCalculator RiskScoreCalculator { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="IUserService"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for retrieving users.
        /// </remarks>
        ///
        /// <value>The <see cref="IUserService"/> dependency.</value>
        [Dependency]
        public IUserService UserService { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AssessmentService"/> class.
        /// </summary>
        public AssessmentService()
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
            Helper.ValidateConfigPropertyNotNull(RiskScoreCalculator, nameof(RiskScoreCalculator));
            Helper.ValidateConfigPropertyNotNull(UserService, nameof(UserService));
        }

        /// <summary>
        /// Creates given assessment.
        /// </summary>
        ///
        /// <param name="entity">The entity to create.</param>
        /// <returns>The created entity.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="entity"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public Assessment Create(Assessment entity)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(entity, nameof(entity));

                // get existing child entities from DB, otherwise new entities will be created in database
                ResolveChildEntities(db, entity);

                entity = db.AssessmentSet.Add(entity);
                db.SaveChanges();

                // load entity again to return all fields populated, including user properties
                return Get(entity.Id);
            },
            "creating the assessment",
            parameters: entity);
        }

        /// <summary>
        /// Updates given assessment.
        /// </summary>
        ///
        /// <param name="entity">The entity to update.</param>
        /// <returns>The updated entity.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="entity"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="EntityNotFoundException">
        /// If entity with the given Id doesn't exist in DB.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public Assessment Update(Assessment entity)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(entity, nameof(entity));

                Assessment existing = Get(db, entity.Id, "entity.Id");

                // get existing child entities from DB, otherwise new entities will be created in database
                ResolveChildEntities(db, entity);

                // delete one-to-many children, so that they will be re-created
                DeleteChildEntities(db, existing);

                // copy fields to existing entity (attach approach doesn't work for child entities)
                UpdateEntityFields(existing, entity, db);
                db.SaveChanges();

                // load entity again to return all fields populated, including user properties
                return Get(entity.Id);
            },
            "updating the assessment",
            parameters: entity);
        }

        /// <summary>
        /// Retrieves assessment with the given Id.
        /// </summary>
        ///
        /// <param name="id">The id of the entity to retrieve.</param>
        /// <returns>The retrieved entity.</returns>
        ///
        /// <exception cref="ArgumentException">
        /// If <paramref name="id"/> is not positive.
        /// </exception>
        /// <exception cref="EntityNotFoundException">
        /// If entity with the given Id doesn't exist in DB.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public Assessment Get(long id)
        {
            return ProcessWithDb(db =>
            {
                return Get(db, id);
            },
            "retrieving the assessment",
            parameters: id);
        }

        /// <summary>
        /// Retrieves assessments matching given search criteria.
        /// </summary>
        ///
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The matched assessments.</returns>
        ///
        /// <exception cref="ArgumentNullException">If the <paramref name="criteria"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException">If the <paramref name="criteria"/> is incorrect,
        /// e.g. PageNumber is negative, or PageNumber is positive and PageSize is not positive.</exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public SearchResult<Assessment> Search(AssessmentSearchCriteria criteria)
        {
            return ProcessWithDb(db =>
            {
                Helper.CheckSearchCriteria(criteria);

                // include navigation properties
                IQueryable<Assessment> query = IncludeNavigationProperties(db.AssessmentSet);

                // construct query conditions
                query = ConstructQueryConditions(query, criteria);

                // set total count of filtered records
                var result = new SearchResult<Assessment>();
                result.TotalRecords = query.Count();

                // adjust SortBy
                criteria.SortBy = criteria.SortBy ?? "Id";

                // construct SortBy property selector expression
                query = criteria.SortType == SortType.Ascending
                    ? query.OrderBy(criteria.SortBy)
                    : query.OrderByDescending(criteria.SortBy);

                // select required page
                if (criteria.PageNumber > 0)
                {
                    query = query.Skip(criteria.PageSize * (criteria.PageNumber - 1)).Take(criteria.PageSize);
                }

                // execute query and set result properties
                result.Items = query.ToList();

                // populate users
                foreach (Assessment item in result.Items)
                {
                    SetAssessmentUsers(item);
                }

                SetSearchResultPageInfo(result, criteria);
                return result;
            },
            $"searching assessments",
            parameters: criteria);
        }

        /// <summary>
        /// Exports assessment to the stream in the specified export format.
        /// </summary>
        ///
        /// <param name="assessment">The assessment to export.</param>
        /// <param name="format">The export document format.</param>
        /// <param name="outputStream">The output stream.</param>
        ///
        /// <exception cref="ArgumentNullException">
        /// If the <paramref name="assessment"/> or <paramref name="outputStream"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public void ExportAssessment(Assessment assessment, ExportFormat format, Stream outputStream)
        {
            ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(assessment, nameof(assessment));
                Helper.ValidateArgumentNotNull(outputStream, nameof(outputStream));
                var sheetNames = new List<string>();
                using (var wb = new XLWorkbook())
                {
                    // adding a worksheet for "Business Unit Information"
                    ExportBusinessUnitSheet(wb, assessment, sheetNames);

                    // adding a worksheet for "Function Modifications Info"
                    ExportFunctionModificationsSheet(wb, assessment, sheetNames);

                    // adding a worksheet for "KPI's_SLA's"
                    ExportKPISLASheet(wb, assessment, sheetNames);

                    // adding a worksheet for functional area
                    ExportFunctionalAreaProcessSheet(wb, assessment, sheetNames);

                    // add worksheets for all ProcessRiskAssessments grouped by category
                    if (assessment.ProcessRiskAssessments != null)
                    {
                        foreach (var categoryPRAs in assessment.ProcessRiskAssessments.GroupBy(x => x.Category.Name))
                        {
                            // truncate sheet name to 31 characters
                            string sheetName = categoryPRAs.Key;
                            sheetName = GetSheetName(sheetNames, sheetName);

                            // add a worksheet
                            IXLWorksheet ws = wb.Worksheets.Add(sheetName);
                            ExportProcessRiskAssessmentsSheet(ws, categoryPRAs.ToList());
                        }
                    }

                    wb.SaveAs(outputStream);
                }
            },
            "exporting assessments",
            parameters: new object[] { assessment, format, outputStream });
        }

        /// <summary>
        /// Retrieves overall risk rating for the given assessment.
        /// </summary>
        ///
        /// <param name="assessment">The assessment.</param>
        /// <returns>The overall risk rating.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="assessment"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public OverallRiskRatingReport GetOverallRiskRatingReport(Assessment assessment)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(assessment, nameof(assessment));

                // get all categories
                IList<Category> allCategories = LookupService.GetAllCategories();

                // get combined list of KPISLAAssessments and ProcessRiskAssessments
                // IEnumerable<ProcessControlAssessment> pcas = assessment.KPISLAAssessments;
                IEnumerable<ProcessControlAssessment> pcas = assessment.FunctionalAreaProcessAssessments;
                pcas = pcas.Concat(assessment.ProcessRiskAssessments);

                // construct LikelihoodOfOccurrenceReport
                IList<LikelihoodOfOccurrence> allLikelihoodOfOccurrences =
                    LookupService.GetAllLikelihoodOfOccurrences();
                RiskReport likelihoodOfOccurrenceReport = CreateRiskReport(allCategories, pcas,
                    allLikelihoodOfOccurrences, pca => pca.LikelihoodOfOccurrence?.Name);

                // construct RiskExposureReport
                IList<RiskExposure> allRiskExposures = LookupService.GetAllRiskExposures();
                RiskReport riskExposureReport = CreateRiskReport(
                    allCategories, pcas, allRiskExposures, pca => pca.RiskExposure?.Name);

                // construct KeyControlsMaturityReport
                RiskReport keyControlsMaturityReport = CreateKeyControlsMaturityReport(allCategories, pcas);

                // construct ResidualRiskReport
                ResidualRiskReport residualRiskReport = CreateResidualRiskReport(allCategories, pcas, assessment);

                // calculate OverallRiskScore for reports
                var parameter = new Dictionary<string, object> { ["assessment"] = assessment };
                likelihoodOfOccurrenceReport.OverallRiskScore = RiskScoreCalculator.GetRiskScore(
                    "LikelihoodOfOccurrenceOverallRiskScore", parameter);
                riskExposureReport.OverallRiskScore = RiskScoreCalculator.GetRiskScore(
                    "RiskExposureOverallRiskScore", parameter);
                keyControlsMaturityReport.OverallRiskScore = RiskScoreCalculator.GetRiskScore(
                    "KeyControlsMaturityOverallRiskScore", parameter);
                residualRiskReport.OverallRiskScore = RiskScoreCalculator.GetRiskScore(
                    "ResidualOverallRiskScore", parameter);

                // construct result from all reports
                return new OverallRiskRatingReport
                {
                    LikelihoodOfOccurrenceReport = likelihoodOfOccurrenceReport,
                    RiskExposureReport = riskExposureReport,
                    KeyControlsMaturityReport = keyControlsMaturityReport,
                    ResidualRiskReport = residualRiskReport,
                    Categories = allCategories
                };
                //return new OverallRiskRatingReport();
            },
            "retrieving overall risk rating report",
            parameters: assessment);
        }

        /// <summary>
        /// Retrieves count of assessments matching given search criteria. The pagination will be ignored.
        /// </summary>
        ///
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The matched assessments count.</returns>
        ///
        /// <exception cref="ArgumentNullException">If the <paramref name="criteria"/> is <c>null</c>.</exception>
        /// <exception cref="PersistenceException">
        /// If a DB-based error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public int GetCount(AssessmentSearchCriteria criteria)
        {
            return ProcessWithDb(db =>
            {
                Helper.ValidateArgumentNotNull(criteria, nameof(criteria));

                // construct query conditions and return count of matched entities
                return ConstructQueryConditions(db.AssessmentSet, criteria).Count();
            },
            "retrieving count of assessments matching given criteria",
            parameters: criteria);
        }

        /// <summary>
        /// Retrieves entity with the given Id.
        /// </summary>
        ///
        /// <param name="context">The database context.</param>
        /// <param name="id">The id of the entity to retrieve.</param>
        /// <param name="idParamName">The name of the Id parameter in the method.</param>
        /// <returns>The retrieved entity.</returns>
        ///
        /// <exception cref="ArgumentException">
        /// If <paramref name="id"/> is not positive.
        /// </exception>
        /// <exception cref="EntityNotFoundException">
        /// If entity with the given Id doesn't exist in DB.
        /// </exception>
        /// <remarks>Other exceptions will be propagated.</remarks>
        private Assessment Get(CustomDbContext context, long id, string idParamName = "id")
        {
            Helper.ValidateArgumentPositive(id, idParamName);

            IQueryable<Assessment> query = context.AssessmentSet;
            query = IncludeNavigationProperties(query);

            Assessment entity = query.FirstOrDefault(e => e.Id == id);
            Helper.CheckFoundEntity(entity, id);

            SetAssessmentUsers(entity);
            return entity;
        }

        /// <summary>
        /// Resolves user properties according to corresponding username properties.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private void SetAssessmentUsers(Assessment entity)
        {
            entity.Submitter = GetUser(entity.SubmitterUsername);
            entity.BUFunctionalApprover = GetUser(entity.BUFunctionalApproverUsername);
            entity.BURiskManagementApprover = GetUser(entity.BURiskManagementApproverUsername);
            entity.DivisionalRiskManagementApprover = GetUser(entity.DivisionalRiskManagementApproverUsername);
            entity.Rejecter = GetUser(entity.RejecterUsername);
        }

        /// <summary>
        /// Gets user with the given username.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <returns>The user.</returns>
        /// <remarks>All exceptions will be propagated.</remarks>
        private User GetUser(string username)
        {
            if (username == null)
            {
                return null;
            }

            return UserService.GetByUsername(username);
        }

        /// <summary>
        /// Includes the navigation properties loading for the entity.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <returns>The updated query.</returns>
        private static IQueryable<Assessment> IncludeNavigationProperties(IQueryable<Assessment> query)
        {
            return query.Include(x => x.AssessmentStatus)
                .Include(x => x.AssessmentType)
                .Include(x => x.BusinessUnit)
                .Include(x => x.Department)
                .Include(x => x.DepartmentHead)
                .Include(x => x.FunctionalArea)
                .Include(x => x.FunctionalAreaOwner)
                .Include(x => x.FunctionPerformedSites.Select(f => f.Percentage))
                .Include(x => x.FunctionPerformedSites.Select(f => f.Site))
                .Include(x => x.FutureFunctionChanges.Select(p => p.ChangeType))
                .Include(x => x.KPISLAAssessments.Select(k => k.Category))
                .Include(x => x.KPISLAAssessments.Select(k => k.KPICategory.KPIs))
                .Include(x => x.KPISLAAssessments.Select(k => k.KPICategory.SLAs))
                .Include(x => x.KPISLAAssessments.Select(k => k.KPI))
                .Include(x => x.KPISLAAssessments.Select(k => k.SelectedSLA))
                .Include(x => x.PriorFunctionChanges.Select(p => p.ChangeType))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.Category))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlDesigns)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.ControlFrequency)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlTriggers)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlType)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.KeyControlsMaturity)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.TestingFrequencies)))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.CoreProcess.Category))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.CoreProcess.ControlTypes))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.CoreProcess.SubProcessRisks))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.LikelihoodOfOccurrence))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.RiskExposure))
                .Include(x => x.FunctionalAreaProcessAssessments.Select(p => p.RiskImpacts))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.Category))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlDesigns)))
                .Include(x => x.ProcessRiskAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.ControlFrequency)))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlTriggers)))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.ControlAssessments.Select(c => c.ControlType)))
                .Include(x => x.ProcessRiskAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.KeyControlsMaturity)))
                .Include(x => x.ProcessRiskAssessments.Select(
                    p => p.ControlAssessments.Select(c => c.TestingFrequencies)))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.ProcessRisk.Category))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.ProcessRisk.ControlTypes))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.LikelihoodOfOccurrence))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.RiskExposure))
                .Include(x => x.ProcessRiskAssessments.Select(p => p.RiskImpacts))
                .Include(x => x.Product);
        }

        /// <summary>
        /// Applies filters to the given query.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The updated query with applied filters.</returns>
        private static IQueryable<Assessment> ConstructQueryConditions(
            IQueryable<Assessment> query, AssessmentSearchCriteria criteria)
        {
            if (criteria.Title != null)
            {
                query = query.Where(x => x.Title.ToUpper().Contains(criteria.Title.ToUpper()));
            }

            if (criteria.SubmitDateStart != null)
            {
                query = query.Where(x => DbFunctions.TruncateTime(x.SubmitTime) >= criteria.SubmitDateStart);
            }

            if (criteria.SubmitDateEnd != null)
            {
                query = query.Where(x => DbFunctions.TruncateTime(x.SubmitTime) <= criteria.SubmitDateEnd);
            }

            if (criteria.ApprovalStatuses != null)
            {
                query = query.Where(x => criteria.ApprovalStatuses.Contains(x.ApprovalStatus));
            }

            if (criteria.BusinessUnitIds != null)
            {
                query = query.Where(x => criteria.BusinessUnitIds.Contains(x.BusinessUnit.Id));
            }

            if (criteria.ApproverUsernames != null)
            {
                query = query.Where(x =>
                    (x.BUFunctionalApproverUsername != null &&
                    criteria.ApproverUsernames.Contains(x.BUFunctionalApproverUsername)) ||
                    (x.BURiskManagementApproverUsername != null &&
                    criteria.ApproverUsernames.Contains(x.BURiskManagementApproverUsername)) ||
                    (x.DivisionalRiskManagementApproverUsername != null &&
                    criteria.ApproverUsernames.Contains(x.DivisionalRiskManagementApproverUsername)) ||
                    (x.RejecterUsername != null &&
                    criteria.ApproverUsernames.Contains(x.RejecterUsername)));
            }

            if (criteria.SubmitterUsernames != null)
            {
                query = query.Where(x => x.SubmitterUsername != null &&
                    criteria.SubmitterUsernames.Contains(x.SubmitterUsername));
            }

            if (criteria.DepartmentHeaderOrFunctionalAreaOwner != null)
            {
                query = query.Where(x => x.DepartmentHead.Name == criteria.DepartmentHeaderOrFunctionalAreaOwner
                    || x.FunctionalAreaOwner.Name == criteria.DepartmentHeaderOrFunctionalAreaOwner);
            }

            if (criteria.BUFunctionalApproverUsername != null)
            {
                query = query.Where(x => x.BUFunctionalApproverUsername == criteria.BUFunctionalApproverUsername);
            }

            if (criteria.BURiskManagementApproverUsername != null)
            {
                query = query.Where(x =>
                    x.BURiskManagementApproverUsername == criteria.BURiskManagementApproverUsername);
            }

            if (criteria.DivisionRiskManagementApproverUsername != null)
            {
                query = query.Where(x =>
                    x.DivisionalRiskManagementApproverUsername == criteria.DivisionRiskManagementApproverUsername);
            }

            if (criteria.RejecterUsername != null)
            {
                query = query.Where(x => x.RejecterUsername == criteria.RejecterUsername);
            }

            return query;
        }

        /// <summary>
        /// Deletes child entities from the database context.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="entity">The entity to delete children for.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void DeleteChildEntities(CustomDbContext context, Assessment entity)
        {
            context.Set<FunctionPerformedSite>().RemoveRange(entity.FunctionPerformedSites);

            context.Set<FunctionChange>().RemoveRange(entity.PriorFunctionChanges);
            context.Set<FunctionChange>().RemoveRange(entity.FutureFunctionChanges);

            context.Set<KPISLAAssessment>().RemoveRange(entity.KPISLAAssessments);
            foreach (FunctionalAreaProcessAssessment item in entity.FunctionalAreaProcessAssessments)
            {
                context.Set<ControlAssessment>().RemoveRange(item.ControlAssessments);
            }
            context.Set<FunctionalAreaProcessAssessment>().RemoveRange(entity.FunctionalAreaProcessAssessments);
            foreach (ProcessRiskAssessment item in entity.ProcessRiskAssessments)
            {
                context.Set<ControlAssessment>().RemoveRange(item.ControlAssessments);
            }
            context.Set<ProcessRiskAssessment>().RemoveRange(entity.ProcessRiskAssessments);
        }

        /// <summary>
        /// Updates child entities by loading them from the database context.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="entity">The entity to resolve.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ResolveChildEntities(CustomDbContext context, Assessment entity)
        {
            entity.SubmitterUsername = entity.Submitter?.Username;
            entity.BUFunctionalApproverUsername = entity.BUFunctionalApprover?.Username;
            entity.BURiskManagementApproverUsername = entity.BURiskManagementApprover?.Username;
            entity.DivisionalRiskManagementApproverUsername = entity.DivisionalRiskManagementApprover?.Username;
            entity.RejecterUsername = entity.Rejecter?.Username;

            // resolve lookup entities
            entity.BusinessUnit = ResolveChildEntity(context, entity.BusinessUnit);
            entity.Product = ResolveChildEntity(context, entity.Product);
            entity.Department = ResolveChildEntity(context, entity.Department);
            entity.DepartmentHead = ResolveChildEntity(context, entity.DepartmentHead);
            entity.FunctionalAreaOwner = ResolveChildEntity(context, entity.FunctionalAreaOwner);
            entity.FunctionalArea = ResolveChildEntity(context, entity.FunctionalArea);
            entity.AssessmentType = ResolveChildEntity(context, entity.AssessmentType);
            entity.AssessmentStatus = ResolveChildEntity(context, entity.AssessmentStatus);

            // Resolve many-to-many relationships

            // sites should be created, but Site and Percentage shouldn't
            if (entity.FunctionPerformedSites != null)
            {
                for (int i = 0; i < entity.FunctionPerformedSites.Count; i++)
                {
                    // Site and Percentage shouldn't be created
                    entity.FunctionPerformedSites[i].Site = ResolveChildEntity(context,
                        entity.FunctionPerformedSites[i].Site);
                    entity.FunctionPerformedSites[i].Percentage = ResolveChildEntity(context,
                        entity.FunctionPerformedSites[i].Percentage);
                }
            }

            // function changes
            if (entity.FutureFunctionChanges != null)
            {
                foreach (var functionChange in entity.FutureFunctionChanges)
                {
                    functionChange.ChangeType = ResolveChildEntity(context, functionChange.ChangeType);
                }
            }

            if (entity.PriorFunctionChanges != null)
            {
                foreach (var functionChange in entity.PriorFunctionChanges)
                {
                    functionChange.ChangeType = ResolveChildEntity(context, functionChange.ChangeType);
                }
            }

            // KPISLAAssessments
            if (entity.KPISLAAssessments != null)
            {
                for (int i = 0; i < entity.KPISLAAssessments.Count; i++)
                {
                    KPISLAAssessment item = entity.KPISLAAssessments[i];

                    // many-to-one
                    item.SelectedSLA = ResolveChildEntity(context, item.SelectedSLA);
                    item.KPI = ResolveChildEntity(context, item.KPI);
                    item.KPICategory = ResolveChildEntity(context, item.KPICategory);
                    item.Category = ResolveChildEntity(context, item.Category);
                }
            }
            // FunctionalAreaProcessAssessments
            if (entity.FunctionalAreaProcessAssessments != null)
            {
                for (int i = 0; i < entity.FunctionalAreaProcessAssessments.Count; i++)
                {
                    FunctionalAreaProcessAssessment item = entity.FunctionalAreaProcessAssessments[i];

                    // many-to-one
                    item.CoreProcess = ResolveChildEntity(context, item.CoreProcess);
                    item.SubProcessRisk = ResolveChildEntity(context, item.SubProcessRisk);
                    // resolve all other referenced entities of the base ProcessControlAssessment class
                    ResolveProcessControlAssessment(context, item);
                }
            }
            // ProcessRiskAssessments
            if (entity.ProcessRiskAssessments != null)
            {
                for (int i = 0; i < entity.ProcessRiskAssessments.Count; i++)
                {
                    ProcessRiskAssessment item = entity.ProcessRiskAssessments[i];

                    // many-to-one
                    item.ProcessRisk = ResolveChildEntity(context, item.ProcessRisk);

                    // resolve all other referenced entities of the base ProcessControlAssessment class
                    ResolveProcessControlAssessment(context, item);
                }
            }
        }

        /// <summary>
        /// Resolves entities associated with given process control assessment.
        /// </summary>
        /// <param name="context">The DB context.</param>
        /// <param name="pca">The process control assessment.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ResolveProcessControlAssessment(CustomDbContext context, ProcessControlAssessment pca)
        {
            pca.LikelihoodOfOccurrence = ResolveChildEntity(context, pca.LikelihoodOfOccurrence);
            pca.RiskExposure = ResolveChildEntity(context, pca.RiskExposure);
            pca.Category = ResolveChildEntity(context, pca.Category);

            // many-to-many
            ResolveEntities(context, pca.RiskImpacts);

            // control assessments (should be created, but children lookups shouldn't)
            if (pca.ControlAssessments != null)
            {
                for (int j = 0; j < pca.ControlAssessments.Count; j++)
                {
                    ControlAssessment control = pca.ControlAssessments[j];

                    // many-to-one
                    control.ControlFrequency = ResolveChildEntity(context, control.ControlFrequency);
                    control.ControlType = ResolveChildEntity(context, control.ControlType);
                    control.KeyControlsMaturity = ResolveChildEntity(context, control.KeyControlsMaturity);

                    // many-to-many
                    ResolveEntities(context, control.ControlDesigns);
                    ResolveEntities(context, control.ControlTriggers);
                    ResolveEntities(context, control.TestingFrequencies);
                }
            }
        }

        /// <summary>
        /// Resolves given identifiable entities.
        /// </summary>
        /// <typeparam name="T">The actual type of entities in the collection.</typeparam>
        /// <param name="context">The DB context.</param>
        /// <param name="items">The entities to resolve.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ResolveEntities<T>(CustomDbContext context, IList<T> items)
            where T : IdentifiableEntity
        {
            if (items != null)
            {
                for (int i = 0; i < items.Count; i++)
                {
                    items[i] = ResolveChildEntity(context, items[i]);
                }
            }
        }

        /// <summary>
        /// Check that entity is not <c>null</c> and tries to retrieve its updated value from the database context.
        /// </summary>
        /// <typeparam name="TEntity">The type of the entity.</typeparam>
        /// <param name="context">The database context.</param>
        /// <param name="entity">The entity.</param>
        /// <returns>The updated entity from the database context.</returns>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static TEntity ResolveChildEntity<TEntity>(DbContext context, TEntity entity)
            where TEntity : IdentifiableEntity
        {
            if (entity == null)
            {
                return null;
            }

            TEntity child = context.Set<TEntity>().Find(entity.Id);
            if (child == null)
            {
                throw new ServiceException(
                    $"Child entity {typeof(TEntity).Name} with Id={entity.Id} was not found.");
            }

            return child;
        }

        /// <summary>
        /// Updates the <paramref name="existing"/> entity according to <paramref name="newEntity"/> entity.
        /// </summary>
        /// <remarks>Override in child services to update navigation properties.</remarks>
        /// <param name="existing">The existing entity.</param>
        /// <param name="newEntity">The new entity.</param>
        /// <param name="context">The database context.</param>
        private static void UpdateEntityFields(Assessment existing, Assessment newEntity, CustomDbContext context)
        {
            context.Entry(existing).CurrentValues.SetValues(newEntity);
            existing.ApprovalStatus = newEntity.ApprovalStatus;
            existing.AssessmentStatus = newEntity.AssessmentStatus;
            existing.AssessmentType = newEntity.AssessmentType;
            existing.BusinessUnit = newEntity.BusinessUnit;
            existing.Department = newEntity.Department;
            existing.DepartmentHead = newEntity.DepartmentHead;
            existing.FunctionalArea = newEntity.FunctionalArea;
            existing.FunctionalAreaOwner = newEntity.FunctionalAreaOwner;
            existing.FunctionPerformedSites = newEntity.FunctionPerformedSites;
            existing.FutureFunctionChanges = newEntity.FutureFunctionChanges;
            existing.PriorFunctionChanges = newEntity.PriorFunctionChanges;
            existing.KPISLAAssessments = newEntity.KPISLAAssessments;
            existing.FunctionalAreaProcessAssessments = newEntity.FunctionalAreaProcessAssessments;
            existing.ProcessRiskAssessments = newEntity.ProcessRiskAssessments;
            existing.Product = newEntity.Product;
        }

        #region Report generation

        /// <summary>
        /// Creates risk report using provided details.
        /// </summary>
        /// <typeparam name="T">The actual type of the risk type entities.</typeparam>
        /// <param name="allCategories">All categories.</param>
        /// <param name="pcas">The process control assessments.</param>
        /// <param name="riskTypes">The risk types.</param>
        /// <param name="riskTypeGetter">The risk type getter used to get risk type from the PCA.</param>
        /// <returns>Created report.</returns>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static RiskReport CreateRiskReport<T>(IList<Category> allCategories,
            IEnumerable<ProcessControlAssessment> pcas, IList<T> riskTypes,
            Func<ProcessControlAssessment, string> riskTypeGetter)
            where T : LookupEntity
        {
            RiskReport report = CreateRiskReport(riskTypes, allCategories);

            // get counts for each category bar
            foreach (ProcessControlAssessment pca in pcas)
            {
                CompositeBar compositeBar = report.CompositeBars.FirstOrDefault(x => x.RiskType == riskTypeGetter(pca));
                CategoryBar categoryBar = compositeBar?.CategoryBars.FirstOrDefault(x => x.Category.Id == pca.Category.Id);
                if (categoryBar != null)
                {
                    categoryBar.Value++;
                }
            }

            SetMaxRiskTypeAndRemoveEmptyBars(report);
            return report;
        }

        /// <summary>
        /// Creates key controls maturity report.
        /// </summary>
        /// <param name="allCategories">All categories.</param>
        /// <param name="pcas">The process control assessments.</param>
        /// <returns>Created risk report.</returns>
        /// <remarks>All exceptions will be propagated.</remarks>
        private RiskReport CreateKeyControlsMaturityReport(IList<Category> allCategories,
            IEnumerable<ProcessControlAssessment> pcas)
        {
            IList<KeyControlsMaturity> allKeyControlsMaturities = LookupService.GetAllKeyControlsMaturities();
            RiskReport report = CreateRiskReport(allKeyControlsMaturities, allCategories);

            // get counts for each category bar
            foreach (ProcessControlAssessment pca in pcas)
            {
                if (pca.ControlAssessments != null)
                {
                    foreach (ControlAssessment controlAssessment in pca.ControlAssessments)
                    {
                        CompositeBar compositeBar = report.CompositeBars.FirstOrDefault(
                            x => x.RiskType == controlAssessment.KeyControlsMaturity?.Name);
                        CategoryBar categoryBar = compositeBar?.CategoryBars.First(
                            x => x.Category.Id == pca.Category.Id);
                        if (categoryBar != null)
                        {
                            categoryBar.Value++;
                        }
                    }
                }
            }

            SetMaxRiskTypeAndRemoveEmptyBars(report);
            return report;
        }

        /// <summary>
        /// Creates residual risk report.
        /// </summary>
        /// <param name="allCategories">All categories.</param>
        /// <param name="pcas">The process control assessments.</param>
        /// <param name="assessment">The assessment to provide to risk score calculator.</param>
        /// <returns>Created risk report.</returns>
        /// <remarks>All exceptions will be propagated.</remarks>
        private ResidualRiskReport CreateResidualRiskReport(IList<Category> allCategories,
            IEnumerable<ProcessControlAssessment> pcas, Assessment assessment)
        {
            var report = new ResidualRiskReport { CategoryBars = new List<CategoryBar>() };
            var parameters = new Dictionary<string, object> { ["assessment"] = assessment };
            report.OverallRiskScore = RiskScoreCalculator.GetRiskScore("ResidualOverallRiskScore", parameters);

            // calculate MaxRiskType
            double maxValue = double.MinValue;
            foreach (Category category in allCategories)
            {
                parameters["category"] = category;
                double value = RiskScoreCalculator.GetRiskScore(
                    "ResidualCategoryRiskScore", parameters);

                if (value > maxValue)
                {
                    maxValue = value;
                    report.MaxRiskType = category.Name;
                }
                else if (value == maxValue)
                {
                    report.MaxRiskType += ", " + category.Name;
                }

                report.CategoryBars.Add(new CategoryBar
                {
                    Category = category,
                    Value = value
                });
            }

            return report;
        }

        /// <summary>
        /// Creates risk report with common information using provided details.
        /// </summary>
        /// <typeparam name="T">The actual type of the risk type entities.</typeparam>
        /// <param name="riskTypes">The risk types.</param>
        /// <param name="allCategories">All categories.</param>
        /// <returns>Created report.</returns>
        private static RiskReport CreateRiskReport<T>(IList<T> riskTypes, IList<Category> allCategories)
            where T : LookupEntity
        {
            var riskReport = new RiskReport { CompositeBars = new List<CompositeBar>() };
            foreach (T riskType in riskTypes)
            {
                var compositeBar = new CompositeBar
                {
                    RiskType = riskType.Name,
                    CategoryBars = allCategories.Select(c => new CategoryBar { Category = c }).ToList()
                };

                riskReport.CompositeBars.Add(compositeBar);
            }

            return riskReport;
        }

        /// <summary>
        /// Sets the maximum risk type and removes empty bars from the report.
        /// </summary>
        /// <param name="report">The report.</param>
        private static void SetMaxRiskTypeAndRemoveEmptyBars(RiskReport report)
        {
            report.MaxRiskType = string.Empty;
            double maxSum = 0;
            for (int i = report.CompositeBars.Count - 1; i >= 0; i--)
            {
                CompositeBar compositeBar = report.CompositeBars[i];

                double sum = compositeBar.CategoryBars.Sum(x => x.Value);
                if (sum == 0)
                {
                    report.CompositeBars.RemoveAt(i);
                }

                if (sum > maxSum)
                {
                    maxSum = sum;
                    report.MaxRiskType = compositeBar.RiskType;
                }
                else if (sum > 0 && sum == maxSum)
                {
                    report.MaxRiskType += ", " + compositeBar.RiskType;
                }
            }
        }

        #endregion Report generation

        #region Export

        /// <summary>
        /// Exports the 'Business Unit Information' sheet.
        /// </summary>
        /// <param name="wb">The excel workbook.</param>
        /// <param name="assessment">The assessment.</param>
        /// <param name="sheetNames">The sheet names used to make sure no duplicate sheet name will occur.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ExportBusinessUnitSheet(XLWorkbook wb, Assessment assessment, IList<string> sheetNames)
        {
            var sheetName = "Business Unit Information";
            sheetName = GetSheetName(sheetNames, sheetName);
            // add a worksheet
            IXLWorksheet ws = wb.Worksheets.Add(sheetName);

            // Unit
            SetBoldCells(ws, 1, 1, "Unit");
            SetCells(ws, 2, 1, "Business Unit", assessment.BusinessUnit?.Name);
            SetCells(ws, 3, 1, "Product", assessment.Product?.Name);
            SetCells(ws, 4, 1, "Department", assessment.Department?.Name);
            SetCells(ws, 5, 1, "Department Lead", assessment.DepartmentHead?.Name);

            // Assessment
            SetBoldCells(ws, 7, 1, "Assessment");
            SetCells(ws, 8, 1, "Assessment Type", assessment.AssessmentType?.Name);
            SetCells(ws, 9, 1, "Assessment Status", assessment.AssessmentStatus?.Name);
            SetCells(ws, 10, 1, "Assessment Due Date", assessment.AssessmentDueDate != null
                ? assessment.AssessmentDueDate.Value.ToString(ExportDateFormat)
                : null);

            // Functional Area
            SetBoldCells(ws, 1, 4, "Functional Area");
            SetCells(ws, 2, 4, "Functional Area Owner", assessment.FunctionalAreaOwner?.Name);
            SetCells(ws, 3, 4, "Individual Completing Assessment", assessment.Submitter == null
                ? null
                : assessment.Submitter.FirstName + " " + assessment.Submitter.LastName);
            SetCells(ws, 4, 4, "Functional Area", assessment.FunctionalArea?.Name);
            SetCells(ws, 5, 4, "Functional Area Description", assessment.FunctionalAreaDescription);

            // performed sites
            SetBoldCells(ws, 6, 4, "In what site(s) is the function performed:");
            if (assessment.FunctionPerformedSites?.Count > 0)
            {
                for (int i = 0; i < assessment.FunctionPerformedSites.Count; i++)
                {
                    FunctionPerformedSite site = assessment.FunctionPerformedSites[i];
                    SetCells(ws, 7 + i, 4, site.Site.Name, site.Percentage.Name);
                }
            }
            else
            {
                SetCells(ws, 7, 4, None);
            }
        }

        /// <summary>
        /// Exports the 'Function Modifications Info' sheet.
        /// </summary>
        /// <param name="wb">The excel workbook.</param>
        /// <param name="assessment">The assessment.</param>
        /// <param name="sheetNames">The sheet names used to make sure no duplicate sheet name will occur.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ExportFunctionModificationsSheet(XLWorkbook wb, Assessment assessment,
            IList<string> sheetNames)
        {
            var sheetName = "Function Modifications Info";
            sheetName = GetSheetName(sheetNames, sheetName);
            // add a worksheet
            IXLWorksheet ws = wb.Worksheets.Add(sheetName);

            // Prior Changes
            SetBoldCells(ws, 1, 1, "Prior Changes");
            SetCells(ws, 2, 1, "Were there any changes to the function in the prior reporting period?");
            SetBoldCells(ws, 3, 1, "Change Type", "Description of change", "When did change occur?");
            WriteFunctionChanges(ws, 4, assessment.PriorFunctionChanges);

            // Anticipated Changes
            int startRow = 5 + Math.Max(assessment.PriorFunctionChanges?.Count ?? 0, 1);
            SetBoldCells(ws, startRow, 1, "Anticipated Changes");
            SetCells(ws, startRow + 1, 1,
                "Do you anticipate any changes to the function in the next reporting period?");
            SetBoldCells(ws, startRow + 2, 1, "Change Type", "Description of change", "When did change occur?");
            WriteFunctionChanges(ws, startRow + 3, assessment.FutureFunctionChanges);
        }

        /// <summary>
        /// Exports the 'KPI's_SLA's' sheet.
        /// </summary>
        /// <param name="wb">The excel workbook.</param>
        /// <param name="assessment">The assessment.</param>
        /// <param name="sheetNames">The sheet names used to make sure no duplicate sheet name will occur.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ExportKPISLASheet(XLWorkbook wb, Assessment assessment, IList<string> sheetNames)
        {
            var sheetName = assessment.KPISLAAssessments?.FirstOrDefault().Category?.Name;
            sheetName = sheetName ?? "KPI's_SLA's";
            sheetName = GetSheetName(sheetNames, sheetName);
            // add a worksheet
            IXLWorksheet ws = wb.Worksheets.Add(sheetName);

            // Headers
            int row = 1;
            SetBoldCells(ws, row, 1, "Category", "KPI", "SLA");
            for (int i = 0; i < assessment.KPISLAAssessments?.Count; i++)
            {
                row++;
                KPISLAAssessment kpi = assessment.KPISLAAssessments[i];

                // KPI & SLA names
                SetBoldCells(ws, row, 1, kpi.KPICategory?.Name ?? kpi.AdditionalKPICategory);
                SetBoldCells(ws, row, 2, kpi.KPI?.Name ?? kpi.AdditionalKPI);
                SetCells(ws, row, 3, kpi.SelectedSLA?.Name ?? kpi.AdditionalSLA);
            }
        }

        /// <summary>
        /// Exports the 'Functional area processes' sheet.
        /// </summary>
        /// <param name="wb">The excel workbook.</param>
        /// <param name="assessment">The assessment.</param>
        /// <param name="sheetNames">The sheet names used to make sure no duplicate sheet name will occur.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private void ExportFunctionalAreaProcessSheet(XLWorkbook wb, Assessment assessment, List<string> sheetNames)
        {
            var sheetName = assessment.FunctionalAreaProcessAssessments?.FirstOrDefault().Category?.Name;
            sheetName = sheetName ?? "Functional Area Processes";
            sheetName = GetSheetName(sheetNames, sheetName);

            // add a worksheet
            IXLWorksheet ws = wb.Worksheets.Add(sheetName);

            ExportFunctionalAreaProcessAssessmentsSheet(ws, assessment.FunctionalAreaProcessAssessments);
        }

        /// <summary>
        /// Exports functional area process assessments to the given worksheet.
        /// </summary>
        /// <param name="ws">The excel worksheet.</param>
        /// <param name="functionalAreaProcessAssessments">The functional area process assessments.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ExportFunctionalAreaProcessAssessmentsSheet(
            IXLWorksheet ws, IList<FunctionalAreaProcessAssessment> functionalAreaProcessAssessments)
        {
            // Headers
            int row = 1;
            SetBoldCells(ws, row, 1, "Core Process", "Sub-processes", "Risks");
            SetBoldCells(ws, row, 4, _fcaHeaders);
            if (functionalAreaProcessAssessments != null)
            {
                for (int i = 0; i < functionalAreaProcessAssessments.Count; i++)
                {
                    row++;
                    FunctionalAreaProcessAssessment process = functionalAreaProcessAssessments[i];

                    // Processes & Risk
                    SetCells(ws, row, 1, process.CoreProcess?.Name ?? process.AdditionalCoreProcess);
                    SetCells(ws, row, 2, process.SubProcessRisk?.Risk ?? process.AdditionalSubProcess);
                    SetCells(ws, row, 3, process.SubProcessRisk?.Risk ?? process.AdditionalRisk);
                    WriteFunctionalAreaProcessControlAssessment(ws, row, process);
                    row += process.ControlAssessments?.Count ?? 0;
                }
            }
        }

        /// <summary>
        /// Writes the functional area process control assessment to the given worksheet.
        /// </summary>
        /// <param name="sheet">The worksheet.</param>
        /// <param name="row">The target row index to write to.</param>
        /// <param name="pca">The process control assessment.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void WriteFunctionalAreaProcessControlAssessment(IXLWorksheet sheet, int row,
            ProcessControlAssessment pca)
        {
            SetCells(sheet, row, 4,
                pca.OtherLikelihoodOfOccurrence ?? pca.LikelihoodOfOccurrence?.Name,
                GetLookupCvs(pca.RiskImpacts),
                pca.RiskExposure?.Name,
                (pca.ControlAssessments?.Count ?? 0) + " control(s)");

            if (pca.ControlAssessments?.Count > 0)
            {
                for (int i = 0; i < pca.ControlAssessments.Count; i++)
                {
                    row++;

                    ControlAssessment control = pca.ControlAssessments[i];
                    var testingFrequencies = GetLookupCvs(control.TestingFrequencies);
                    if (!string.IsNullOrEmpty(control.OtherTestingFrequency))
                    {
                        testingFrequencies = testingFrequencies + ", " + control.OtherTestingFrequency;
                    }
                    SetCells(sheet, row, 7,
                    control.OtherControlType ?? control.ControlType?.Name,
                    control.ControlObjective,
                    control.ControlFrequency?.Name,
                    GetLookupCvs(control.ControlDesigns),
                    testingFrequencies,
                    GetLookupCvs(control.ControlTriggers),
                    control.OtherKeyControlMaturity ?? control.KeyControlsMaturity?.Name);
                }
            }
        }

        /// <summary>
        /// Exports process risk assessments to the given worksheet.
        /// </summary>
        /// <param name="ws">The excel worksheet.</param>
        /// <param name="processRisks">The process risk assessments.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void ExportProcessRiskAssessmentsSheet(
            IXLWorksheet ws, IList<ProcessRiskAssessment> processRisks)
        {
            // Headers
            int row = 1;
            SetBoldCells(ws, row, 1, "Processes", "Risk");
            SetBoldCells(ws, row, 3, _pcaHeaders);

            for (int i = 0; i < processRisks.Count; i++)
            {
                row++;
                ProcessRiskAssessment process = processRisks[i];

                // Processes & Risk
                SetCells(ws, row, 1, process.ProcessRisk?.Name ?? process.AdditionalProcess);
                SetCells(ws, row, 2, process.ProcessRisk?.Risk ?? process.AdditionalRisk);
                WriteProcessControlAssessment(ws, row, process);
                row += process.ControlAssessments?.Count ?? 0;
            }
        }

        /// <summary>
        /// Writes the process control assessment to the given worksheet.
        /// </summary>
        /// <param name="sheet">The worksheet.</param>
        /// <param name="row">The target row index to write to.</param>
        /// <param name="pca">The process control assessment.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void WriteProcessControlAssessment(IXLWorksheet sheet, int row, ProcessControlAssessment pca)
        {
            SetCells(sheet, row, 3,
                pca.RiskExposure?.Name,
                (pca.ControlAssessments?.Count ?? 0) + " control(s)");

            if (pca.ControlAssessments?.Count > 0)
            {
                for (int i = 0; i < pca.ControlAssessments.Count; i++)
                {
                    row++;

                    ControlAssessment control = pca.ControlAssessments[i];
                    var testingFrequencies = GetLookupCvs(control.TestingFrequencies);
                    if (!string.IsNullOrEmpty(control.OtherTestingFrequency))
                    {
                        testingFrequencies = testingFrequencies + ", " + control.OtherTestingFrequency;
                    }
                    SetCells(sheet, row, 4,
                    control.OtherControlType ?? control.ControlType?.Name,
                    control.ControlFrequency?.Name,
                    GetLookupCvs(control.ControlDesigns),
                    testingFrequencies,
                    control.OtherKeyControlMaturity ?? control.KeyControlsMaturity?.Name);
                }
            }
        }

        /// <summary>
        /// Writes the function changes to the given worksheet.
        /// </summary>
        /// <param name="sheet">The sheet.</param>
        /// <param name="startRow">The index of the row to start writing to.</param>
        /// <param name="items">The function changes.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void WriteFunctionChanges(IXLWorksheet sheet, int startRow, IList<FunctionChange> items)
        {
            if (items?.Count > 0)
            {
                for (int i = 0; i < items.Count; i++)
                {
                    FunctionChange function = items[i];
                    SetCells(sheet, startRow + i, 1, function.ChangeType?.Name,
                        function.ChangeDescription, function.ChangeTime.ToString(ExportDateFormat));
                }
            }
            else
            {
                SetCells(sheet, startRow, 1, None);
            }
        }

        /// <summary>
        /// Sets the cells values.
        /// </summary>
        /// <param name="sheet">The worksheet.</param>
        /// <param name="row">The row.</param>
        /// <param name="startColumn">The start column.</param>
        /// <param name="isBold">Determines whether font style should be bold.</param>
        /// <param name="values">The values to write.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void SetCells(IXLWorksheet sheet, int row, int startColumn, bool isBold, params string[] values)
        {
            for (int i = 0; i < values.Length; i++)
            {
                string cellAddress = GetCellAddress(row, startColumn + i);

                DateTime datetime;
                if (DateTime.TryParseExact(values[i], ExportDateFormat,
                    CultureInfo.CurrentCulture, DateTimeStyles.None, out datetime))
                {
                    sheet.Cell(cellAddress).Style.DateFormat.SetFormat(ExportDateFormat);
                }

                IXLCell cell = sheet.Cell(cellAddress);
                cell.Style.Font.Bold = isBold;
                cell.Value = values[i];
            }
        }

        /// <summary>
        /// Sets the cells values in bold font style.
        /// </summary>
        /// <param name="sheet">The worksheet.</param>
        /// <param name="row">The row.</param>
        /// <param name="startColumn">The start column.</param>
        /// <param name="values">The values to write.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void SetBoldCells(IXLWorksheet sheet, int row, int startColumn, params string[] values)
        {
            SetCells(sheet, row, startColumn, true, values);
        }

        /// <summary>
        /// Sets the cells values in normal (non-bold) font style.
        /// </summary>
        /// <param name="sheet">The worksheet.</param>
        /// <param name="row">The row.</param>
        /// <param name="startColumn">The start column.</param>
        /// <param name="values">The values to write.</param>
        /// <remarks>All exceptions will be propagated.</remarks>
        private static void SetCells(IXLWorksheet sheet, int row, int startColumn,
            params string[] values)
        {
            SetCells(sheet, row, startColumn, false, values);
        }

        /// <summary>
        /// Gets the cell address in excel format.
        /// </summary>
        /// <param name="row">The row index.</param>
        /// <param name="column">The column index.</param>
        /// <returns>The cell address in excel format</returns>
        private static string GetCellAddress(int row, int column)
        {
            char columnName = (char)('A' + column - 1);
            return $"{columnName}{row}";
        }

        /// <summary>
        /// Gets the CVS string constructed from the given lookup entities' names.
        /// </summary>
        /// <typeparam name="T">The actual type of lookup entities.</typeparam>
        /// <param name="items">The lookup entities.</param>
        /// <returns>The CVS string.</returns>
        private static string GetLookupCvs<T>(IList<T> items)
            where T : LookupEntity
        {
            if (items == null || items.Count == 0)
            {
                return null;
            }

            return string.Join(",", items.Select(item => item.Name));
        }

        /// <summary>
        /// Gets the sheetname so that no duplicate sheet name will occur.
        /// </summary>
        /// <param name="sheetNames">The sheet names.</param>
        /// <param name="sheetName">The expected sheetname.</param>
        /// <returns>The sheetname.</returns>
        private static string GetSheetName(IList<string> sheetNames, string sheetName)
        {
            var correctSheetName = sheetName.Length <= 31 ? sheetName : sheetName.Substring(0, 31);
            correctSheetName = correctSheetName.Replace("/", "_");
            if (sheetNames.Contains(sheetName))
            {
                int foundSheetNamesCount = sheetNames.Where(p => p == sheetName).Count();
                correctSheetName = correctSheetName.Length + foundSheetNamesCount.ToString().Length <= 31 ? correctSheetName :
                    correctSheetName.Substring(0, 31 - foundSheetNamesCount.ToString().Length);
                correctSheetName = correctSheetName + foundSheetNamesCount;
            }
            sheetNames.Add(sheetName);
            return correctSheetName;
        }

        #endregion Export
    }
}