/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System;
using System.Runtime.Serialization;

namespace JohnHancock.ProjectCoeus.Exceptions
{
    /// <summary>
    /// This is the exception to indicate authentication related errors.
    /// <para>
    /// It extends <see cref="ServiceException"/>.
    /// </para>
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is not thread safe because its base class is not thread safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    [Serializable]
    public class AuthenticationException : ServiceException
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationException"/> class.
        /// </summary>
        public AuthenticationException()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationException"/> class
        /// with a specified error message.
        /// </summary>
        ///
        /// <param name="message">The message that describes the error.</param>
        public AuthenticationException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationException"/> class
        /// with a specified error message and a reference to the inner exception that is the cause of this exception.
        /// </summary>
        ///
        /// <param name="message">
        /// The error message that explains the reason for the exception.
        /// </param>
        /// <param name="innerException">
        /// The exception that is the cause of the current exception, or a null reference if no inner exception is
        /// specified.
        /// </param>
        public AuthenticationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationException"/> class with serialized data.
        /// </summary>
        ///
        /// <param name="info">
        /// The <see cref="SerializationInfo"/> that holds the serialized object data about the exception being thrown.
        /// </param>
        /// <param name="context">
        /// The <see cref="StreamingContext"/> that contains contextual information about the source or destination.
        /// </param>
        protected AuthenticationException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
