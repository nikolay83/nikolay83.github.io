/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.API.Entities;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;
using JohnHancock.ProjectCoeus.Services;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace JohnHancock.ProjectCoeus.API.Controllers
{
    /// <summary>
    /// This controller exposes actions for managing assessments and
    /// calculating overall risk rating reports.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    /// <remarks>
    /// Changes in 1.1:
    ///     - Removed validation for percentage check while creating assessment as draft
    /// Changes in 1.2:
    ///     - Fixed search method criteria for 'BUFunctionalApprover'
    ///     - Updated search method to prevent approver to view assessment based on the role
    ///     - Removed validation for percentage check while updating assessment
    ///     - Updated CheckAccess method to check access permission based on the status of assessment
    ///     - updated CreateApprovedCriteria method to consider the status of assessment based on the role
    ///     - updated Reject method to accept the reason for rejection from body
    /// </remarks>
    /// <author>LOY, NightWolf, veshu</author>
    /// <version>1.2</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    [RoutePrefix("api/v1")]
    public class AssessmentController : BaseController
    {
        /// <summary>
        /// Represents the JSON serializer for auditing.
        /// </summary>
        private static readonly JsonSerializer Serializer = JsonSerializer.Create(Helper.SerializerSettings);

        /// <summary>
        /// The cached full name of the assessment entity.
        /// </summary>
        private static readonly string _assessmentTypeName = typeof(Assessment).FullName;

        /// <summary>
        /// Represents names of assessment properties to skip when creating audit records.
        /// These are the fields that do not present in DB.
        /// </summary>
        private static readonly IList<string> _propertiesToSkipAuditing = new List<string>
        {
            "BUFunctionalApprover",
            "BURiskManagementApprover",
            "DivisionalRiskManagementApprover",
            "Rejecter",
            "Submitter"
        };

        /// <summary>
        /// Gets or sets the <see cref="IAssessmentService"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for managing assessments.
        /// </remarks>
        ///
        /// <value>The <see cref="IAssessmentService"/> dependency.</value>
        [Dependency]
        public IAssessmentService AssessmentService { get; set; }

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
        /// Gets or sets the <see cref="IAuditService"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for creating audit records.
        /// </remarks>
        ///
        /// <value>The <see cref="IAuditService"/> dependency.</value>
        [Dependency]
        public IAuditService AuditService { get; set; }

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
        /// Initializes a new instance of the <see cref="AssessmentController"/> class.
        /// </summary>
        public AssessmentController()
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
            Helper.ValidateConfigPropertyNotNull(AssessmentService, nameof(AssessmentService));
            Helper.ValidateConfigPropertyNotNull(UserService, nameof(UserService));
            Helper.ValidateConfigPropertyNotNull(AuditService, nameof(AuditService));
            Helper.ValidateConfigPropertyNotNull(LookupService, nameof(LookupService));
        }

        /// <summary>
        /// Creates given assessment in draft state.
        /// </summary>
        ///
        /// <param name="entity">The entity to create.</param>
        /// <returns>The created entity.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="entity"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If entity is not in a valid state.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/draft")]
        public Assessment CreateAsDraft(Assessment entity)
        {
            return WithTransaction(() =>
            {
                Helper.ValidateArgumentNotNull(entity, nameof(entity));

                // populate audit fields
                PopulateAuditFields(entity, null, creating: true);

                // the submitter must be set to current user
                entity.Submitter = CurrentUser;
                entity.SubmitTime = null;
                entity.ApprovalStatus = ApprovalStatus.Draft;
                entity.Title = CreateAssessmentTitle(null, entity);
                // following fields should not be set
                ResetCreatedAssessmentFields(entity);

                // perform action
                Assessment result = AssessmentService.Create(entity);

                Audit(null, result);
                return result;
            });
        }

        /// <summary>
        /// Updates given assessment.
        /// </summary>
        ///
        /// <param name="entity">The updated entity.</param>
        /// <param name="id">The Id of the entity to update.</param>
        /// <returns>The updated entity.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="entity"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to modify the entity.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If entity is not in a valid state for update.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPut]
        [Route("assessment/{id}")]
        public Assessment Update(long id, Assessment entity)
        {
            return WithTransaction(() =>
            {
                Helper.ValidateArgumentNotNull(entity, nameof(entity));

                Assessment existing = AssessmentService.Get(id);

                CheckCanModify(existing);

                entity.Title = CreateAssessmentTitle(existing, entity);

                // populate audit fields
                PopulateAuditFields(entity, existing);

                // following fields should not be changed
                entity.Submitter = existing.Submitter;
                entity.ApprovalStatus = existing.ApprovalStatus;
                entity.BUFunctionalApprover = existing.BUFunctionalApprover;
                entity.BUFunctionalApproveTime = existing.BUFunctionalApproveTime;
                entity.BURiskManagementApprover = existing.BURiskManagementApprover;
                entity.BURiskManagementApproveTime = existing.BURiskManagementApproveTime;
                entity.DivisionalRiskManagementApprover = existing.DivisionalRiskManagementApprover;
                entity.DivisionalRiskManagementApproveTime = existing.DivisionalRiskManagementApproveTime;
                entity.Rejecter = existing.Rejecter;
                entity.RejectTime = existing.RejectTime;
                entity.RejectionReason = existing.RejectionReason;
                existing.SubmitTime = existing.SubmitTime;
                // update
                entity.Id = id;
                Assessment updated = AssessmentService.Update(entity);
                Audit(existing, updated);
                return updated;
            });
        }

        /// <summary>
        /// Retrieves assessment with the given Id.
        /// </summary>
        ///
        /// <param name="id">The id of the entity to retrieve.</param>
        /// <returns>The retrieved entity.</returns>
        ///
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to access the entity.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/{id}")]
        public Assessment Get(long id)
        {
            Assessment entity = AssessmentService.Get(id);
            CheckAccess(entity);
            return entity;
        }

        /// <summary>
        /// Retrieves assessments matching given search criteria.
        /// </summary>
        ///
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The matched assessments.</returns>
        ///
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments")]
        public SearchResult<Assessment> Search([FromUri]AssessmentSearchCriteria criteria)
        {
            criteria = criteria ?? new AssessmentSearchCriteria();
            criteria.ApproverUsernames = GetUsernames(criteria.ApproverRealName);
            criteria.SubmitterUsernames = GetUsernames(criteria.SubmitterRealName);

            criteria.DepartmentHeaderOrFunctionalAreaOwner = null;
            if (CurrentUser.Role == Role.Owner)
            {
                criteria.SubmitterUsernames = new List<string> { CurrentUser.Username };
            }
            else if (CurrentUser.Role == Role.BUFunctionalApprover)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBUFunctionalApproval,
                    ApprovalStatus.AwaitingBURiskManagementApproval,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval,
                    ApprovalStatus.Approved
                };
                criteria.DepartmentHeaderOrFunctionalAreaOwner = CurrentUser.Username;
            }
            else if (CurrentUser.Role == Role.BURiskManagementApprover)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBURiskManagementApproval,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval,
                    ApprovalStatus.Approved
                };
                criteria.BusinessUnitIds = GetBusinessUnitIds().ToList();
            }
            else if (CurrentUser.Role == Role.DivisionalRiskManagementApprover)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval,
                    ApprovalStatus.Approved
                };
            }

            return AssessmentService.Search(criteria);
        }

        /// <summary>
        /// Exports assessment with the given Id in the specified export format.
        /// </summary>
        ///
        /// <param name="id">The Id of the assessment to export.</param>
        /// <param name="format">The export document format.</param>
        /// <returns>The HTTP response message with the binary data representing exported document.</returns>
        ///
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to access the entity with the given Id.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/{id}/export")]
        public HttpResponseMessage ExportAssessment(long id, ExportFormat format)
        {
            Assessment entity = AssessmentService.Get(id);
            CheckAccess(entity);
            return ExportAssessment(entity, format);
        }

        /// <summary>
        /// Exports assessment in the specified export format.
        /// </summary>
        ///
        /// <param name="assessment">The assessment to export.</param>
        /// <param name="format">The export document format.</param>
        /// <returns>The HTTP response message with the binary data representing exported document.</returns>
        ///
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/export")]
        public HttpResponseMessage ExportAssessment(Assessment assessment, ExportFormat format)
        {
            var stream = new MemoryStream();
            AssessmentService.ExportAssessment(assessment, format, stream);
            stream.Position = 0;
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new StreamContent(stream);
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = "export.xlsx";

            //add content disposition in header
            result.Content.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
            return result;
        }

        /// <summary>
        /// Submits given assessment.
        /// </summary>
        ///
        /// <param name="entity">The assessment to submit.</param>
        /// <returns>The created or updated entity.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="entity"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to submit the entity.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If entity is not in a valid state for submit.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/submit")]
        public Assessment Submit(Assessment entity)
        {
            return WithTransaction(() =>
            {
                Helper.ValidateArgumentNotNull(entity, nameof(entity));

                Assessment existing = null;
                if (entity.Id > 0)
                {
                    existing = AssessmentService.Get(entity.Id);
                    CheckCanSubmit(existing);
                }

                CheckPerformedSitesSum(entity);

                // populate audit fields
                PopulateAuditFields(entity, existing, existing == null);
                entity.Title = CreateAssessmentTitle(existing, entity);
                // the submitter must be set to current user
                entity.Submitter = CurrentUser;
                entity.SubmitTime = DateTime.Now;
                entity.ApprovalStatus = ApprovalStatus.AwaitingBUFunctionalApproval;

                // following fields should not be set
                ResetCreatedAssessmentFields(entity);

                Assessment result = entity.Id > 0
                    ? AssessmentService.Update(entity)
                    : AssessmentService.Create(entity);

                Audit(existing, result);
                return result;
            });
        }

        /// <summary>
        /// Approves the assessment with the given assessment Id.
        /// </summary>
        ///
        /// <param name="assessmentId">The assessment Id.</param>
        ///
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to approve the assessment.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/{assessmentId}/approve")]
        public void Approve(long assessmentId)
        {
            WithTransaction(() =>
            {
                var entity = AssessmentService.Get(assessmentId);
                if (CurrentUser.Role == Role.BUFunctionalApprover)
                {
                    CheckCanApprove(entity, ApprovalStatus.AwaitingBUFunctionalApproval);
                    entity.ApprovalStatus = ApprovalStatus.AwaitingBURiskManagementApproval;
                    entity.BUFunctionalApprover = CurrentUser;
                    entity.BUFunctionalApproveTime = DateTime.Now;
                }
                else if (CurrentUser.Role == Role.BURiskManagementApprover)
                {
                    CheckCanApprove(entity, ApprovalStatus.AwaitingBURiskManagementApproval);
                    entity.ApprovalStatus = ApprovalStatus.AwaitingDivisionalRiskManagementApproval;
                    entity.BURiskManagementApprover = CurrentUser;
                    entity.BURiskManagementApproveTime = DateTime.Now;
                }
                else if (CurrentUser.Role == Role.DivisionalRiskManagementApprover)
                {
                    CheckCanApprove(entity, ApprovalStatus.AwaitingDivisionalRiskManagementApproval);
                    entity.ApprovalStatus = ApprovalStatus.Approved;
                    entity.DivisionalRiskManagementApprover = CurrentUser;
                    entity.DivisionalRiskManagementApproveTime = DateTime.Now;
                }
                else
                {
                    throw new AuthorizationException("Cannot approve the assessment.");
                }

                // retrieve entity state before updating
                Assessment oldEntity = AssessmentService.Get(assessmentId);

                // populate audit fields
                PopulateAuditFields(entity);

                // update and audit
                Assessment newEntity = AssessmentService.Update(entity);
                Audit(oldEntity, newEntity);
            });
        }

        /// <summary>
        /// Rejects the assessment with the given assessment Id.
        /// </summary>
        ///
        /// <param name="assessmentId">The assessment Id.</param>
        /// <param name="rejectionReason">The rejection reason.</param>
        ///
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to reject the assessment.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If assessment is not in a valid approval status for rejection.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/{assessmentId}/reject")]
        public void Reject(long assessmentId, [FromBody] string rejectionReason)
        {
            WithTransaction(() =>
            {
                Assessment entity = AssessmentService.Get(assessmentId);
                if (entity.ApprovalStatus == ApprovalStatus.AwaitingBUFunctionalApproval)
                {
                    CheckCanReject(entity, Role.BUFunctionalApprover);
                    entity.RejectPhase = RejectPhase.BUFunctionalApproval;
                    entity.ApprovalStatus = ApprovalStatus.Rejected;
                }
                else if (entity.ApprovalStatus == ApprovalStatus.AwaitingBURiskManagementApproval)
                {
                    CheckCanReject(entity, Role.BURiskManagementApprover);
                    entity.RejectPhase = RejectPhase.BURiskManagementApproval;
                    entity.ApprovalStatus = ApprovalStatus.AwaitingBUFunctionalApproval;
                }
                else if (entity.ApprovalStatus == ApprovalStatus.AwaitingDivisionalRiskManagementApproval)
                {
                    CheckCanReject(entity, Role.DivisionalRiskManagementApprover);
                    entity.RejectPhase = RejectPhase.DivisionalRiskManagementApproval;
                    entity.ApprovalStatus = ApprovalStatus.AwaitingBURiskManagementApproval;
                }
                else
                {
                    throw new ServiceException("Cannot reject the assessment in current status.");
                }

                entity.Rejecter = CurrentUser;
                entity.RejectTime = DateTime.Now;
                entity.RejectionReason = rejectionReason;

                // retrieve entity state before updating
                Assessment oldEntity = AssessmentService.Get(assessmentId);

                // populate audit fields
                PopulateAuditFields(entity, entity);

                // update and audit
                Assessment newEntity = AssessmentService.Update(entity);
                Audit(oldEntity, newEntity);
            });
        }

        /// <summary>
        /// Retrieves overall risk rating for the given assessment.
        /// </summary>
        ///
        /// <param name="assessment">The assessment.</param>
        /// <returns>The overall risk rating.</returns>
        ///
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpPost]
        [Route("assessments/overallRiskRatingReport")]
        public OverallRiskRatingReport GetOverallRiskRatingReport(Assessment assessment)
        {
            return AssessmentService.GetOverallRiskRatingReport(assessment);
        }

        /// <summary>
        /// Retrieves overall risk rating for the assessment with the given Id.
        /// </summary>
        ///
        /// <param name="assessmentId">The assessment Id.</param>
        /// <returns>The overall risk rating.</returns>
        ///
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to access the entity with the given Id.
        /// </exception>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/{assessmentId}/overallRiskRatingReport")]
        public OverallRiskRatingReport GetOverallRiskRatingReport(long assessmentId)
        {
            Assessment entity = AssessmentService.Get(assessmentId);
            CheckAccess(entity);
            return AssessmentService.GetOverallRiskRatingReport(entity);
        }

        /// <summary>
        /// Gets the count of draft assessments.
        /// </summary>
        ///
        /// <returns>The count of draft assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/draft/count")]
        public int GetDraftCount()
        {
            AssessmentSearchCriteria criteria = CreateDraftCriteria();
            return AssessmentService.GetCount(criteria);
        }

        /// <summary>
        /// Gets the count of awaiting approval assessments.
        /// </summary>
        ///
        /// <returns>The count of awaiting approval assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/awaitingApproval/count")]
        public int GetAwaitingApprovalCount()
        {
            AssessmentSearchCriteria criteria = CreateAwaitingApprovalCriteria();
            return AssessmentService.GetCount(criteria);
        }

        /// <summary>
        /// Gets the count of approved assessments.
        /// </summary>
        ///
        /// <returns>The count of approved assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/approved/count")]
        public int GetApprovedCount()
        {
            AssessmentSearchCriteria criteria = CreateApprovedCriteria();
            return AssessmentService.GetCount(criteria);
        }

        /// <summary>
        /// Gets the count of rejected assessments.
        /// </summary>
        ///
        /// <returns>The count of rejected assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/rejected/count")]
        public int GetRejectedCount()
        {
            AssessmentSearchCriteria criteria = CreateRejectedCriteria();
            return AssessmentService.GetCount(criteria);
        }

        /// <summary>
        /// Gets the draft assessments with optional pagination.
        /// </summary>
        ///
        /// <returns>The draft assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/draft")]
        public SearchResult<Assessment> GetDraftAssessments([FromUri]BaseSearchCriteria criteria)
        {
            AssessmentSearchCriteria assessmentCriteria = CreateDraftCriteria(criteria);
            return AssessmentService.Search(assessmentCriteria);
        }

        /// <summary>
        /// Gets the awaiting approval assessments with optional pagination.
        /// </summary>
        ///
        /// <returns>The awaiting approval assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/awaitingApproval")]
        public SearchResult<Assessment> GetAwaitingApprovalAssessments([FromUri]BaseSearchCriteria criteria)
        {
            AssessmentSearchCriteria assessmentCriteria = CreateAwaitingApprovalCriteria(criteria);
            return AssessmentService.Search(assessmentCriteria);
        }

        /// <summary>
        /// Gets the approved assessments with optional pagination.
        /// </summary>
        ///
        /// <returns>The approved assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/approved")]
        public SearchResult<Assessment> GetApprovedAssessments([FromUri]BaseSearchCriteria criteria)
        {
            AssessmentSearchCriteria assessmentCriteria = CreateApprovedCriteria(criteria);
            return AssessmentService.Search(assessmentCriteria);
        }

        /// <summary>
        /// Gets the rejected assessments with optional pagination.
        /// </summary>
        ///
        /// <returns>The rejected assessments.</returns>
        /// <remarks>All exceptions from services will be propagated.</remarks>
        [HttpGet]
        [Route("assessments/rejected")]
        public SearchResult<Assessment> GetRejectedAssessments([FromUri]BaseSearchCriteria criteria)
        {
            AssessmentSearchCriteria assessmentCriteria = CreateRejectedCriteria(criteria);
            return AssessmentService.Search(assessmentCriteria);
        }

        /// <summary>
        /// Audits assessment CUD operations.
        /// </summary>
        /// <param name="oldEntity">The old entity.</param>
        /// <param name="newEntity">The new entity.</param>
        /// <remarks>All exceptions will be propagated to caller method.</remarks>
        private void Audit(Assessment oldEntity, Assessment newEntity)
        {
            JObject oldObject = null;
            JObject newObject = JObject.FromObject(newEntity);
            IList<JProperty> oldProperties = null;
            IList<JProperty> newProperties = newObject.Properties().ToList();

            if (oldEntity != null)
            {
                oldObject = JObject.FromObject(oldEntity);
                oldProperties = oldObject.Properties().ToList();
            }

            // keep time, so that all records have the same timestamp (also slightly improves performance)
            DateTime now = DateTime.Now;

            // iterate through all object properties
            IEnumerable<string> propertyNames = (oldProperties ?? newProperties).Select(p => p.Name);
            foreach (string propertyName in propertyNames)
            {
                if (_propertiesToSkipAuditing.Contains(propertyName))
                {
                    continue;
                }

                JToken oldPropertyValue = null;
                JToken newPropertyValue = newObject.Property(propertyName).Value;

                if (oldEntity != null)
                {
                    oldPropertyValue = oldObject.Property(propertyName).Value;
                }

                // skip when both are null
                if (newPropertyValue.Type == JTokenType.Null && oldPropertyValue == null)
                {
                    continue;
                }

                // when properties are the same - skip auditing
                if (JToken.DeepEquals(oldPropertyValue, newPropertyValue))
                {
                    continue;
                }

                var record = new AuditRecord
                {
                    Action = Helper.GetFullActionName(ActionContext, includeController: false),
                    Field = propertyName,
                    ItemId = newEntity.Id,
                    ItemType = _assessmentTypeName,
                    Timestamp = now,
                    PreviousValue = GetJtokenValue(oldPropertyValue),
                    NewValue = GetJtokenValue(newPropertyValue),
                    Username = CurrentUser.Username
                };

                AuditService.Create(record);
            }
        }

        /// <summary>
        /// Gets the string representation of JToken value.
        /// </summary>
        /// <param name="token">The JToken.</param>
        /// <returns>The string representation of JToken value.</returns>
        private static string GetJtokenValue(JToken token)
        {
            return token != null && token.Type != JTokenType.Null
                ? token.ToString()
                : null;
        }

        /// <summary>
        /// Gets the current user's business unit Ids.
        /// </summary>
        /// <returns>The current user's business unit Ids.</returns>
        private IEnumerable<long> GetBusinessUnitIds()
        {
            return CurrentUser.BusinessUnits.Select(bu => bu.Id);
        }

        /// <summary>
        /// Gets the usernames of users whose real name contains given <paramref name="realName"/>.
        /// </summary>
        /// <param name="realName">The substring of user real name.</param>
        /// <returns>The usernames of matched users.</returns>
        /// <remarks>All exceptions will be propagated to caller method.</remarks>
        private IList<string> GetUsernames(string realName)
        {
            if (realName == null)
            {
                return null;
            }

            return UserService.GetByRealName(realName).Select(u => u.Username).ToList();
        }

        /// <summary>
        /// Sets properties that should not be set during assessment creation to <c>null</c>.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        private static void ResetCreatedAssessmentFields(Assessment entity)
        {
            entity.BUFunctionalApprover = null;
            entity.BUFunctionalApproveTime = null;
            entity.BURiskManagementApprover = null;
            entity.BURiskManagementApproveTime = null;
            entity.DivisionalRiskManagementApprover = null;
            entity.DivisionalRiskManagementApproveTime = null;
            entity.Rejecter = null;
            entity.RejectTime = null;
            entity.RejectionReason = null;
        }

        /// <summary>
        /// Checks whether entity can be modified by current user.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <exception cref="AuthorizationException">If current user is not allowed to modify the entity.</exception>
        private void CheckCanModify(Assessment entity)
        {
            if (CurrentUser.Role != Role.Admin)
            {
                if (CurrentUser.Role == Role.Owner)
                {
                    if (entity.Submitter?.Username != CurrentUser.Username &&
                        entity.ApprovalStatus != ApprovalStatus.Draft &&
                        entity.ApprovalStatus != ApprovalStatus.Rejected)
                    {
                        throw new AuthorizationException("Cannot update the assessment at current status.");
                    }
                }
                else if (CurrentUser.Role == Role.BUFunctionalApprover)
                {
                    CheckCanModify(entity, ApprovalStatus.AwaitingBUFunctionalApproval);
                }
                else if (CurrentUser.Role == Role.BURiskManagementApprover)
                {
                    CheckCanModify(entity, ApprovalStatus.AwaitingBURiskManagementApproval);
                }
                else if (CurrentUser.Role == Role.DivisionalRiskManagementApprover)
                {
                    CheckCanModify(entity, ApprovalStatus.AwaitingDivisionalRiskManagementApproval);
                }
                else
                {
                    throw new AuthorizationException("Cannot approve the assessment at current status.");
                }
            }
        }

        /// <summary>
        /// Checks whether assessment can be submitted for review.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <exception cref="AuthorizationException">
        /// If assessment's can not be submitted.
        /// </exception>
        private static void CheckCanSubmit(Assessment entity)
        {
            if (entity.ApprovalStatus != ApprovalStatus.Draft && entity.ApprovalStatus != ApprovalStatus.Rejected)
            {
                throw new AuthorizationException("Cannot submit the assessment at current status.");
            }
        }

        /// <summary>
        /// Checks whether assessment can be updated.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <param name="validStatus">The valid entity status for assessment approval.</param>
        /// <exception cref="AuthorizationException">
        /// If assessment's approval status doesn't match <paramref name="validStatus"/>.
        /// </exception>
        private static void CheckCanModify(Assessment entity, ApprovalStatus validStatus)
        {
            if (entity.ApprovalStatus != validStatus)
            {
                throw new AuthorizationException("Cannot update the assessment at current status.");
            }
        }

        /// <summary>
        /// Checks whether entity can be accessed by current user.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <exception cref="AuthorizationException">If current user is not allowed to access the entity.</exception>
        private void CheckAccess(Assessment entity)
        {
            if (!(entity.Submitter?.Username == CurrentUser.Username
                || (CurrentUser.Role == Role.BUFunctionalApprover
                    && (CurrentUser.Username == entity.DepartmentHead?.Name ||
                        CurrentUser.Username == entity.FunctionalAreaOwner?.Name)
                   && (entity.ApprovalStatus == ApprovalStatus.AwaitingBUFunctionalApproval ||
                        entity.ApprovalStatus == ApprovalStatus.AwaitingBURiskManagementApproval ||
                        entity.ApprovalStatus == ApprovalStatus.AwaitingDivisionalRiskManagementApproval ||
                        entity.ApprovalStatus == ApprovalStatus.Approved)
                || (CurrentUser.Role == Role.BURiskManagementApprover
                    && entity.BusinessUnit != null
                    && GetBusinessUnitIds().Any(id => id == entity.BusinessUnit.Id)
                    && (entity.ApprovalStatus == ApprovalStatus.AwaitingBURiskManagementApproval ||
                        entity.ApprovalStatus == ApprovalStatus.AwaitingDivisionalRiskManagementApproval ||
                        entity.ApprovalStatus == ApprovalStatus.Approved))
                || (CurrentUser.Role == Role.DivisionalRiskManagementApprover
                    && (entity.ApprovalStatus == ApprovalStatus.AwaitingDivisionalRiskManagementApproval ||
                        entity.ApprovalStatus == ApprovalStatus.Approved))
                || CurrentUser.Role == Role.Admin)))
            {
                throw new AuthorizationException("You are not allowed to access the assessment.");
            }
        }

        /// <summary>
        /// Checks whether assessment can be approved.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <param name="validStatus">The valid entity status for assessment approval.</param>
        /// <exception cref="AuthorizationException">
        /// If assessment's approval status doesn't match <paramref name="validStatus"/>.
        /// </exception>
        private static void CheckCanApprove(Assessment entity, ApprovalStatus validStatus)
        {
            if (entity.ApprovalStatus != validStatus)
            {
                throw new AuthorizationException("Cannot approve the assessment.");
            }
        }

        /// <summary>
        /// Checks whether current user is allowed to reject the assessment.
        /// </summary>
        /// <param name="entity">The assessment.</param>
        /// <param name="validRole">The valid user role for assessment rejection.</param>
        /// <exception cref="AuthorizationException">
        /// If current user is not allowed to reject the assessment.
        /// </exception>
        private void CheckCanReject(Assessment entity, Role validRole)
        {
            if (CurrentUser.Role != validRole && CurrentUser.Role != Role.Admin)
            {
                throw new AuthorizationException("Cannot reject the assessment.");
            }
        }

        /// <summary>
        /// Checks whether sum of performed sites is equal to 100.
        /// </summary>
        /// <param name="assessment">The assessment.</param>
        /// <exception cref="ServiceException">
        /// If the sum of performed sites is not equal to 100.
        /// </exception>
        private void CheckPerformedSitesSum(Assessment assessment)
        {
            IList<Percentage> percentages = LookupService.GetAllPercentages();
            if (assessment.FunctionPerformedSites == null)
            {
                throw new ArgumentException("The FunctionPerformedSites should not be null.",
                    "assessment.FunctionPerformedSites");
            }

            if (assessment.FunctionPerformedSites.Any(x => x == null))
            {
                throw new ArgumentException("The FunctionPerformedSites should not contain null elements.",
                    "assessment.FunctionPerformedSites");
            }

            if (assessment.FunctionPerformedSites.Any(x => x.Percentage == null))
            {
                throw new ArgumentException("The FunctionPerformedSites[].Percentage should not be null.",
                    "assessment.FunctionPerformedSites[].Percentage");
            }

            IList<long> notFoundIds = assessment.FunctionPerformedSites.Where(x =>
                !percentages.Any(p => p.Id == x.Percentage.Id)).Select(x => x.Percentage.Id).ToList();

            if (notFoundIds.Count > 0)
            {
                throw new EntityNotFoundException(
                    "FunctionPerformedSites[].Percentage with following Ids were not found: " +
                    string.Join(",", notFoundIds));
            }

            if (assessment.FunctionPerformedSites.Sum(
                    x => percentages.First(p => p.Id == x.Percentage.Id).Value) != 100)
            {
                throw new ServiceException("The sum of FunctionPerformedSites[].Percentage should be 100.");
            }
        }

        /// <summary>
        /// Creates the search criteria for draft assessments, optionally applying pagination.
        /// </summary>
        /// <param name="baseCriteria">The pagination options.</param>
        /// <returns>The search criteria for draft assessments.</returns>
        private AssessmentSearchCriteria CreateDraftCriteria(BaseSearchCriteria baseCriteria = null)
        {
            var criteria = new AssessmentSearchCriteria();
            CopyCriteria(baseCriteria, criteria);

            criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Draft };
            if (CurrentUser.Role == Role.Owner)
            {
                // approvers cannot access this method
                criteria.SubmitterUsernames = new List<string> { CurrentUser.Username };
            }

            return criteria;
        }

        /// <summary>
        /// Creates the search criteria for awaiting approval assessments, optionally applying pagination.
        /// </summary>
        /// <param name="baseCriteria">The pagination options.</param>
        /// <returns>The search criteria for awaiting approval assessments.</returns>
        private AssessmentSearchCriteria CreateAwaitingApprovalCriteria(BaseSearchCriteria baseCriteria = null)
        {
            var criteria = new AssessmentSearchCriteria();
            CopyCriteria(baseCriteria, criteria);

            if (CurrentUser.Role == Role.Owner)
            {
                criteria.SubmitterUsernames = new List<string> { CurrentUser.Username };
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBUFunctionalApproval,
                    ApprovalStatus.AwaitingBURiskManagementApproval,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval
                };
            }
            else if (CurrentUser.Role == Role.BUFunctionalApprover)
            {
                criteria.DepartmentHeaderOrFunctionalAreaOwner = CurrentUser.Username;
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBUFunctionalApproval
                };
            }
            else if (CurrentUser.Role == Role.BURiskManagementApprover)
            {
                criteria.BusinessUnitIds = GetBusinessUnitIds().ToList();
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBURiskManagementApproval
                };
            }
            else if (CurrentUser.Role == Role.DivisionalRiskManagementApprover)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval
                };
            }
            else if (CurrentUser.Role == Role.Admin)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.AwaitingBUFunctionalApproval,
                    ApprovalStatus.AwaitingBURiskManagementApproval,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval
                };
            }

            return criteria;
        }

        /// <summary>
        /// Creates the search criteria for approved assessments, optionally applying pagination.
        /// </summary>
        /// <param name="baseCriteria">The pagination options.</param>
        /// <returns>The search criteria for approved assessments.</returns>
        private AssessmentSearchCriteria CreateApprovedCriteria(BaseSearchCriteria baseCriteria = null)
        {
            var criteria = new AssessmentSearchCriteria();
            CopyCriteria(baseCriteria, criteria);

            if (CurrentUser.Role == Role.Owner)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Approved };
                criteria.SubmitterUsernames = new List<string> { CurrentUser.Username };
            }
            else if (CurrentUser.Role == Role.BUFunctionalApprover)
            {
                criteria.BUFunctionalApproverUsername = CurrentUser.Username;
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.Approved,
                    ApprovalStatus.AwaitingBURiskManagementApproval,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval
               };
            }
            else if (CurrentUser.Role == Role.BURiskManagementApprover)
            {
                criteria.BURiskManagementApproverUsername = CurrentUser.Username;
                criteria.ApprovalStatuses = new List<ApprovalStatus>
                {
                    ApprovalStatus.Approved,
                    ApprovalStatus.AwaitingDivisionalRiskManagementApproval
               };
            }
            else if (CurrentUser.Role == Role.DivisionalRiskManagementApprover)
            {
                criteria.DivisionRiskManagementApproverUsername = CurrentUser.Username;
                criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Approved };
            }
            else if (CurrentUser.Role == Role.Admin)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Approved };
            }

            return criteria;
        }

        /// <summary>
        /// Creates the search criteria for rejected assessments, optionally applying pagination.
        /// </summary>
        /// <param name="baseCriteria">The pagination options.</param>
        /// <returns>The search criteria for rejected assessments.</returns>
        private AssessmentSearchCriteria CreateRejectedCriteria(BaseSearchCriteria baseCriteria = null)
        {
            var criteria = new AssessmentSearchCriteria();
            CopyCriteria(baseCriteria, criteria);
            if (CurrentUser.Role == Role.Owner)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Rejected };
                criteria.SubmitterUsernames = new List<string> { CurrentUser.Username };
            }
            else if (CurrentUser.Role == Role.BUFunctionalApprover ||
                CurrentUser.Role == Role.BURiskManagementApprover ||
                CurrentUser.Role == Role.DivisionalRiskManagementApprover)
            {
                criteria.RejecterUsername = CurrentUser.Username;
            }
            else if (CurrentUser.Role == Role.Admin)
            {
                criteria.ApprovalStatuses = new List<ApprovalStatus> { ApprovalStatus.Rejected };
            }

            return criteria;
        }

        /// <summary>
        /// Copies the pagination options from <paramref name="baseCriteria"/> to <paramref name="criteria"/>.
        /// </summary>
        /// <param name="baseCriteria">The pagination options.</param>
        /// <param name="criteria">The assessment search criteria.</param>
        private static void CopyCriteria(BaseSearchCriteria baseCriteria, AssessmentSearchCriteria criteria)
        {
            if (baseCriteria != null)
            {
                criteria.PageNumber = baseCriteria.PageNumber;
                criteria.PageSize = baseCriteria.PageSize;
                criteria.SortBy = baseCriteria.SortBy;
                criteria.SortType = baseCriteria.SortType;
            }
        }

        /// <summary>
        /// Creates the assessment title from assessment.
        /// </summary>
        /// <param name="existing">The existing assessment.</param>
        /// <param name="entity">The entity to create or update</param>
        /// <returns>The assessment title</returns>
        private static string CreateAssessmentTitle(Assessment existing, Assessment entity)
        {
            Helper.ValidateArgumentNotNull(entity.FunctionalArea, nameof(entity.FunctionalArea));
            var name = entity.BusinessUnit.Name + " - " + entity.FunctionalArea.Name
                + " - " + string.Format("{0:yyyy-MM-dd}", DateTime.Now);
            // if functional area is changed or functional area name is modified then update the name.
            if (existing != null)
            {
                if (existing.FunctionalArea.Id != entity.FunctionalArea.Id
                    || existing.FunctionalArea.Name != entity.FunctionalArea.Name)
                {
                    name = entity.BusinessUnit.Name + " - " + entity.FunctionalArea.Name
                 + " - " + string.Format("{0:yyyy-MM-dd}", DateTime.Now);
                }
                else
                {
                    name = existing.Title;
                }
            }
            return name;
        }
    }
}