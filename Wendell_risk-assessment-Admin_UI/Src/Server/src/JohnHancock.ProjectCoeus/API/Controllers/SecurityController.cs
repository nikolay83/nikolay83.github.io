/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using JohnHancock.ProjectCoeus.Services;
using Microsoft.Practices.Unity;
using JohnHancock.ProjectCoeus.API.Entities;
using System.Web.Http;
using JohnHancock.ProjectCoeus.Exceptions;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Entities;

namespace JohnHancock.ProjectCoeus.API.Controllers
{
    /// <summary>
    /// This controller exposes security related actions.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    [RoutePrefix("api/v1")]
    public class SecurityController : BaseController
    {
        /// <summary>
        /// Gets or sets the <see cref="ISecurityService"/> dependency.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> after initialization.
        /// </para>
        /// It is used for authentication and token management operations.
        /// </remarks>
        ///
        /// <value>The <see cref="ISecurityService"/> dependency.</value>
        [Dependency]
        public ISecurityService SecurityService { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SecurityController"/> class.
        /// </summary>
        public SecurityController()
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
            Helper.ValidateConfigPropertyNotNull(SecurityService, nameof(SecurityService));
        }

        /// <summary>
        /// Logs in the specified user with email and password.
        /// </summary>
        ///
        /// <param name="loginRequest">The login details.</param>
        /// <returns>The login result entity, or null if fails to log in.</returns>
        /// 
        /// <exception cref="AuthenticationException">
        /// If cannot authenticate user with the given credentials.</exception>
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public LoginResult Login(LoginRequest loginRequest)
        {
            Helper.ValidateArgumentNotNull(loginRequest, nameof(loginRequest));

            User user = SecurityService.Authenticate(loginRequest.Username, loginRequest.Password);
            if (user == null)
            {
                throw new AuthenticationException("Cannot authenticate user with the given credentials.");
            }

            Token token = SecurityService.GenerateToken(user.Username);
            return new LoginResult { Token = token, User = user };
        }

        /// <summary>
        /// Revokes the current user token.
        /// </summary>
        ///
        /// <remarks>All exceptions from back-end services will be propagated.</remarks>
        [HttpPost]
        [Route("revokeToken")]
        public void RevokeToken()
        {
            string token = ActionContext.Request.Headers.Authorization.Parameter;
            SecurityService.RevokeToken(token);
        }
    }
}
