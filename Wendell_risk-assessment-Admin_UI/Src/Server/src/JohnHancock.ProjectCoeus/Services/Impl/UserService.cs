/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using JohnHancock.ProjectCoeus.Entities.DTOs;
using JohnHancock.ProjectCoeus.Exceptions;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This service class provides operations for retrieving users from Active Directory.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class UserService : BaseService, IUserService
    {
        /// <summary>
        /// The first name key in AD property mappings.
        /// </summary>
        private const string FirstNameKey = "FirstName";

        /// <summary>
        /// The last name key in AD property mappings.
        /// </summary>
        private const string LastNameKey = "LastName";

        /// <summary>
        /// The business units key in AD property mappings.
        /// </summary>
        private const string BusinessUnitsKey = "BusinessUnits";

        /// <summary>
        /// Gets or sets the Active Directory users domain path.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization.
        /// </para>
        /// It is used for accessing users in Active Directory.
        /// </remarks>
        ///
        /// <value>The Active Directory users domain path.</value>
        [Dependency]
        public string ADUsersDomain { get; set; }

        /// <summary>
        /// Gets or sets the Active Directory admin username.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization.
        /// </para>
        /// It is used for connecting to Active Directory.
        /// </remarks>
        ///
        /// <value>The Active Directory admin username.</value>
        [Dependency]
        public string ADAdminUsername { get; set; }

        /// <summary>
        /// Gets or sets the Active Directory admin user password.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization.
        /// </para>
        /// It is used for connecting to Active Directory.
        /// </remarks>
        ///
        /// <value>The Active Directory admin user password.</value>
        [Dependency]
        public string ADAdminPassword { get; set; }

        /// <summary>
        /// Gets or sets the Active Directory user property mappings.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization. Should not contain empty keys or null/empty values.
        /// </para>
        /// It is used for mapping user properties to Active Directory properties.
        /// </remarks>
        ///
        /// <value>The Active Directory user property mappings.</value>
        [Dependency]
        public IDictionary<string, string> ADPropertyNameMapping { get; set; }

        /// <summary>
        /// Gets or sets the database Role to Active Directory Group mappings.
        /// </summary>
        ///
        /// <remarks>
        /// <para>
        /// It is expected to be initialized by Unity and never changed after that.
        /// Should not be <c>null</c> or empty after initialization. Should not contain empty keys or null/empty values.
        /// </para>
        /// It is used for mapping database Roles to Active Directory Groups.
        /// </remarks>
        ///
        /// <value>The database Role to Active Directory Group mappings.</value>
        [Dependency]
        public IDictionary<string, string> ADGroupNameMapping { get; set; }

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
        /// Initializes a new instance of the <see cref="UserService"/> class.
        /// </summary>
        public UserService()
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
            Helper.ValidateConfigPropertyNotNullOrEmpty(ADUsersDomain, nameof(ADUsersDomain));
            Helper.ValidateConfigPropertyNotNullOrEmpty(ADAdminUsername, nameof(ADAdminUsername));
            Helper.ValidateConfigPropertyNotNullOrEmpty(ADAdminPassword, nameof(ADAdminPassword));

            Helper.ValidateConfigProperty(ADPropertyNameMapping, nameof(ADPropertyNameMapping));
            Helper.ValidateConfigProperty(ADGroupNameMapping, nameof(ADGroupNameMapping));

            CheckMapping(FirstNameKey);
            CheckMapping(LastNameKey);
            CheckMapping(BusinessUnitsKey);
        }

        /// <summary>
        /// Gets the user by username.
        /// </summary>
        ///
        /// <param name="username">The username.</param>
        /// <returns>The user with the given username, or null if not found.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="username"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="username"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If Active Directory related error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public User GetByUsername(string username)
        {
            return Logger.Process(() =>
            {
                Helper.ValidateArgumentNotNullOrEmpty(username, nameof(username));

                var criteria = new UserSearchCriteria { Username = username };
                IList<User> users = Search(criteria);
                return users.FirstOrDefault();
            },
            "retrieving user by username",
            parameters: username);
        }

        /// <summary>
        /// Gets all users whose real name (first name + ' ' + last name) contains <paramref name="realName"/>.
        /// </summary>
        ///
        /// <param name="realName">The user real name substring to match.</param>
        /// <returns>Matching users, or empty list if none were found.</returns>
        ///
        /// <exception cref="ArgumentNullException">
        /// If <paramref name="realName"/> is <c>null</c>.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// If <paramref name="realName"/> is empty.
        /// </exception>
        /// <exception cref="PersistenceException">
        /// If Active Directory related error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If any other errors occur while performing this operation.
        /// </exception>
        public IList<User> GetByRealName(string realName)
        {
            return Logger.Process(() =>
            {
                Helper.ValidateArgumentNotNull(realName, nameof(realName));

                var criteria = new UserSearchCriteria { RealName = realName };
                return Search(criteria);
            },
            "retrieving users by real user name",
            parameters: realName);
        }

        /// <summary>
        /// Searches users matching given criteria.
        /// </summary>
        ///
        /// <param name="criteria">The search criteria.</param>
        /// <returns>The search result.</returns>
        ///
        /// <exception cref="PersistenceException">
        /// If Active Directory related error occurs.
        /// </exception>
        /// <exception cref="ServiceException">
        /// If user doesn't have business units,
        /// or if user business unit are not valid.
        /// </exception>
        /// <remarks>Other exceptions will be propagated.</remarks>
        private IList<User> Search(UserSearchCriteria criteria)
        {
            try
            {
                using (DirectoryEntry de = GetUsersDirectoryEntry())
                {
                    var ds = new DirectorySearcher
                    {
                        SearchRoot = de,
                        Filter = "(&(objectClass=user)"
                    };
                    if (criteria.Username != null)
                    {
                        ds.Filter += $"(CN={criteria.Username})";
                    }
                    ds.Filter += ")";
                    ds.SearchScope = SearchScope.Subtree;

                    var result = new List<User>();
                    IList<BusinessUnit> allBusinessUnits = LookupService.GetAllBusinessUnits();
                    SearchResultCollection searchResultCollection = ds.FindAll();
                    foreach (SearchResult searchResult in searchResultCollection)
                    {
                        string firstName = GetPropertyValue(searchResult.Properties, FirstNameKey);
                        string lastName = GetPropertyValue(searchResult.Properties, LastNameKey);

                        if (criteria.RealName != null)
                        {
                            if (!(firstName + " " + lastName).ToUpper().Contains(criteria.RealName.ToUpper()))
                            {
                                continue;
                            }
                        }

                        string businessUnitsValue = GetPropertyValue(searchResult.Properties, BusinessUnitsKey);
                        if (string.IsNullOrWhiteSpace(businessUnitsValue))
                        {
                            throw new ServiceException("The user doesn't have business units.");
                        }

                        var businessUnits = new List<BusinessUnit>();
                        IList<string> businessUnitNames = businessUnitsValue.Split(
                            new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                        foreach (string businessUnitName in businessUnitNames)
                        {
                            BusinessUnit businessUnit =
                                allBusinessUnits.FirstOrDefault(x => x.Name == businessUnitName);
                            if (businessUnit == null)
                            {
                                throw new ServiceException("The user has invalid business unit(s).");
                            }

                            businessUnits.Add(businessUnit);
                        }

                        string username = searchResult.Properties["CN"][0].ToString();
                        result.Add(new User
                        {
                            Username = username,
                            Role = GetRoleFromAD(username),
                            FirstName = firstName,
                            LastName = lastName,
                            BusinessUnits = businessUnits
                        });
                    }

                    return result;
                }
            }
            catch (ServiceException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new PersistenceException("An error occurred while searching users in Active Directory.", ex);
            }
        }

        /// <summary>
        /// Gets the property value.
        /// </summary>
        /// <remarks>The internal exception may be thrown directly.</remarks>
        /// <param name="properties">The user properties collection.</param>
        /// <param name="propertyName">The name of the property to get.</param>
        /// <returns>The property value.</returns>
        private string GetPropertyValue(ResultPropertyCollection properties, string propertyName)
        {
            string adPropertyName = ADPropertyNameMapping[propertyName];
            if (properties.Contains(adPropertyName))
            {
                ResultPropertyValueCollection values = properties[adPropertyName];
                if (values.Count > 0)
                {
                    return values[0].ToString();
                }
            }

            return null;
        }

        /// <summary>
        /// Gets role of the user in Active Directory.
        /// </summary>
        /// <remarks>The internal exception may be thrown directly.</remarks>
        /// <param name="username">The username.</param>
        /// <returns>The role of the user in Active Directory, or null if role was not found.</returns>
        private Role? GetRoleFromAD(string username)
        {
            // get user entry
            var de = GetUsersDirectoryEntry().Children.Find("CN=" + username, "user");

            PropertyValueCollection roles = de.Properties["memberOf"];
            if (roles.Count > 0)
            {
                foreach (object roleValue in roles)
                {
                    string groupFullName = roleValue.ToString();
                    if (groupFullName.StartsWith("CN=", StringComparison.OrdinalIgnoreCase))
                    {
                        string groupName = groupFullName.Split(',')[0].Split('=')[1].ToString();
                        string roleName = ADGroupNameMapping.FirstOrDefault(x => x.Value == groupName).Key;
                        if (roleName != null)
                        {
                            Role role = (Role)Enum.Parse(typeof(Role), roleName);
                            return role;
                        }
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Gets users DirectoryEntry in Active Directory.
        /// </summary>
        /// <returns>The users DirectoryEntry.</returns>
        private DirectoryEntry GetUsersDirectoryEntry()
        {
            return new DirectoryEntry(ADUsersDomain, ADAdminUsername, ADAdminPassword, AuthenticationTypes.Secure);
        }

        /// <summary>
        /// Checks that AD property mapping exists.
        /// </summary>
        /// <param name="propertyKey">The key of the property.</param>
        /// <exception cref="ConfigurationException">
        /// If <c>ADPropertyNameMapping</c> doesn't contain <paramref name="propertyKey"/> key.
        /// </exception>
        private void CheckMapping(string propertyKey)
        {
            if (!ADPropertyNameMapping.ContainsKey(propertyKey))
            {
                throw new ConfigurationException(
                    $"{propertyKey} key is missing in configurable property {nameof(ADPropertyNameMapping)}.");
            }
        }
    }
}