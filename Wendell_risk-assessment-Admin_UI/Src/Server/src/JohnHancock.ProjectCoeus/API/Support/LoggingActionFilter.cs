/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using JohnHancock.ProjectCoeus.API.Entities;
using JohnHancock.ProjectCoeus.Exceptions;
using log4net;
using Microsoft.Practices.Unity;

namespace JohnHancock.ProjectCoeus.API.Support
{
    /// <summary>
    /// This filter provides logging for action entries, parameter information, action exits and return values.
    /// </summary>
    /// 
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class LoggingActionFilter : ActionFilterAttribute
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
        /// Initializes a new instance of the <see cref="LoggingActionFilter"/> class.
        /// </summary>
        public LoggingActionFilter()
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
        }

        /// <summary>
        /// Called when action starts executing.
        /// </summary>
        /// <param name="context">The action context.</param>
        public override void OnActionExecuting(HttpActionContext context)
        {
            string actionName = context.GetFullActionName();

            // Log the action entry
            var message = new StringBuilder();
            message.Append($"Entering action '{actionName}'.");
            if (context.ActionArguments.Count > 0)
            {
                message.AppendLine().Append("Action parameters:");
                foreach (KeyValuePair<string, object> parameter in context.ActionArguments)
                {
                    object valueToLog = parameter.Value;
                    var login = parameter.Value as LoginRequest;
                    if (login != null)
                    {
                        valueToLog = new LoginRequest
                        {
                            Username = login.Username,
                            Password = Helper.PasswordMask
                        };
                    }

                    string argumentDesctiption = Helper.GetObjectDescription(valueToLog);
                    message.AppendLine().Append($"\t {parameter.Key}: {argumentDesctiption}");
                }
            }

            Logger.Debug(message.ToString());
        }

        /// <summary>
        /// Called when action ends execution.
        /// </summary>
        /// <param name="context">The action executed context.</param>
        public override void OnActionExecuted(HttpActionExecutedContext context)
        {
            var message = new StringBuilder();
            message.AppendFormat("Exiting action '{0}.{1}'.",
                context.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName,
                context.ActionContext.ActionDescriptor.ActionName);

            if (context.Response != null)
            {
                var responseObject = context.Response.Content as ObjectContent;
                if (responseObject != null)
                {
                    object valueToLog = responseObject.Value;

                    // mask token,  if needed
                    var loginResult = responseObject.Value as LoginResult;
                    if (loginResult != null)
                    {
                        valueToLog = new LoginResult
                        {
                            User = loginResult.User,
                            Token = Helper.MaskToken(loginResult.Token)
                        };
                    }

                    message.AppendLine().AppendFormat("Action Result: {0}",
                        Helper.GetObjectDescription(valueToLog)).AppendLine();
                }
            }

            Logger.Debug(message.ToString());
        }
    }
}
