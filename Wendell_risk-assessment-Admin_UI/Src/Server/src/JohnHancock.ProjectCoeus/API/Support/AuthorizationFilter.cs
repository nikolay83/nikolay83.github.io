/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;
using JohnHancock.ProjectCoeus.Services;
using log4net;
using Microsoft.Practices.Unity;

namespace JohnHancock.ProjectCoeus.API.Support
{
    /// <summary>
    /// This action filter checks if user is logged in, and has permission to perform the action.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class AuthorizationFilter : ActionFilterAttribute
    {
        /// <summary>
        /// Gets or sets the logger used for logging in this class.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for logging in this class and its sub-classes.
        /// </remarks>
        ///
        /// <value>The logger.</value>
        [Dependency]
        public ILog Logger { get; set; }

        /// <summary>
        /// Gets or sets the Security service.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for user authentication.
        /// </remarks>
        ///
        /// <value>The Security service.</value>
        [Dependency]
        public ISecurityService SecurityService { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorizationFilter"/> class.
        /// </summary>
        public AuthorizationFilter()
        {
        }

        /// <summary>
        /// Checks that all configuration properties were properly initialized.
        /// </summary>
        ///
        /// <exception cref="ConfigurationException">
        /// If any of required injection fields are not injected or have invalid values.
        /// </exception>
        public void CheckConfiguration()
        {
            Helper.ValidateConfigPropertyNotNull(Logger, nameof(Logger));
            Helper.ValidateConfigPropertyNotNull(SecurityService, nameof(SecurityService));
        }

        /// <summary>
        /// Validates user token and authorization.
        /// </summary>
        ///
        /// <remarks>
        /// All exceptions from back-end services will be propagated.
        /// </remarks>
        ///
        /// <param name="context">The action context.</param>
        /// 
        /// <exception cref="AuthenticationException">
        /// If Bearer token is not provided or token is invalid or expired.
        /// </exception>
        /// <exception cref="AuthorizationException">
        /// If user is not authorized to perform current action.
        /// </exception>
        public override void OnActionExecuting(HttpActionContext context)
        {
            string methodName = $"{nameof(AuthorizationFilter)}.{nameof(OnActionExecuting)}";
            Logger.DebugFormat("Entering '{0}' to validate the token.", methodName);

            // skip controllers or actions which allow anonymous access
            var actionDescriptor = context.ActionDescriptor;
            if (actionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>(true).Any() ||
                actionDescriptor.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>(true).Any())
            {
                Logger.Debug("Token is not required for the current action.");
                return;
            }

            // check whether Bearer token is provided
            if (context.Request.Headers.Authorization == null ||
                context.Request.Headers.Authorization.Scheme != "Bearer")
            {
                throw new AuthenticationException("Bearer Token is missing.");
            }

            // perform authentication
            User user = SecurityService.Authenticate(context.Request.Headers.Authorization.Parameter);
            if (user == null)
            {
                throw new AuthenticationException("Token was not found or has been expired.");
            }

            Logger.Debug("Token is valid.");

            // check authorization
            string actionName = context.GetFullActionName(false);
            if (user.Role == null || !SecurityService.IsAuthorized(user.Role.Value, actionName))
            {
                throw new AuthorizationException("You are not authorized to perform this action.");
            }

            context.Request.Properties.Add(Helper.CurrentUserPropertyName, user);
            Logger.DebugFormat("Exiting '{0}'.", methodName);
        }
    }
}
