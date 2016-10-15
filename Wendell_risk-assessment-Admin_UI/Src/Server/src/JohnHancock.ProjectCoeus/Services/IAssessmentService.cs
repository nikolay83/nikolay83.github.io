/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.IO;
using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;

namespace JohnHancock.ProjectCoeus.Services
{
    /// <summary>
    /// This service interface defines operations for managing assessments and
    /// calculating overall risk rating reports.
    /// </summary>
    ///
    /// <threadsafety>
    /// Implementations of this interface should be effectively thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public interface IAssessmentService
    {
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
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        Assessment Create(Assessment entity);

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
        /// If entity with the given Id doesn't exist.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        Assessment Update(Assessment entity);

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
        /// If entity with the given Id doesn't exist.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        Assessment Get(long id);

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
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        SearchResult<Assessment> Search(AssessmentSearchCriteria criteria);

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
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        void ExportAssessment(Assessment assessment, ExportFormat format, Stream outputStream);

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
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        OverallRiskRatingReport GetOverallRiskRatingReport(Assessment assessment);

        /// <summary>
        /// Retrieves count of assessments matching given search criteria. The pagination will be ignored.
        /// </summary>
        ///
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The matched assessments count.</returns>
        ///
        /// <exception cref="ArgumentNullException">If the <paramref name="criteria"/> is <c>null</c>.</exception>
        /// <exception cref="PersistenceException">
        /// If error occurs while accessing the persistence.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        int GetCount(AssessmentSearchCriteria criteria);
    }
}
