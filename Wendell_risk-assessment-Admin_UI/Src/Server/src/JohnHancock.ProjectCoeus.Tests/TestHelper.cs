/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using log4net;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace JohnHancock.ProjectCoeus.Tests
{
    /// <summary>
    /// This class provides common methods used in unit tests.
    /// </summary>
    ///
    /// <author>NightWolf</author>
    ///
    /// <version>1.0</version>
    ///
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    internal static class TestHelper
    {
        /// <summary>
        /// Represents the connection string name of a test database.
        /// </summary>
        internal const string ConnectionStringName = "DefaultConnectionString";

        /// <summary>
        /// Represents the path to the files with test results in JSON format.
        /// </summary>
        internal const string TestResultsPath = @"..\..\..\JohnHancock.ProjectCoeus.Tests\TestJsonResults\";

        /// <summary>
        /// Represents the path where exported files should be saved.
        /// </summary>
        internal static readonly string ExportedFilesPath =
            ConfigurationManager.AppSettings["ExportedFilesPath"];

        /// <summary>
        /// Represents the JSON serializer settings.
        /// </summary>
        internal static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            DateFormatString = "MM/dd/yyyy HH:mm:ss",
            DateTimeZoneHandling = DateTimeZoneHandling.Utc,
            Formatting = Formatting.Indented
        };

        /// <summary>
        /// Gets or sets the unity container.
        /// </summary>
        /// <value>
        /// The unity container.
        /// </value>
        internal static UnityContainer UnityContainer { get; set; }

        /// <summary>
        /// Initializes the <see cref="TestHelper"/> class.
        /// </summary>
        static TestHelper()
        {
            log4net.Config.XmlConfigurator.Configure();

            UnityContainer = new UnityContainer();
            UnityContainer.RegisterType<ILog>(
                new InjectionFactory(factory => LogManager.GetLogger("default")));
            ((UnityConfigurationSection)ConfigurationManager.GetSection("unity")).Configure(UnityContainer);
        }

        /// <summary>
        /// Adds test data to the database.
        /// </summary>
        internal static void FillDatabase()
        {
            Execute(File.ReadAllText(@"..\..\..\..\Database\TestData.sql"));
        }

        /// <summary>
        /// Clears test data from the database.
        /// </summary>
        internal static void ClearDatabase()
        {
            Execute(File.ReadAllText(@"..\..\..\..\Database\ClearTestData.sql"));
        }

        /// <summary>
        /// Asserts that record exists in the database with given parameters.
        /// </summary>
        ///
        /// <param name="tableName">The table's name.</param>
        /// <param name="parameters">The SQL statement parameters.</param>
        internal static void AssertDatabaseRecordExists(string tableName, IDictionary<string, object> parameters)
        {
            AssertDatabaseRecordCount(tableName, parameters, 1);
        }

        /// <summary>
        /// Asserts that there are exactly <paramref name="expectedRecordCount"/> records exists in
        /// the database with given parameters.
        /// </summary>
        ///
        /// <param name="tableName">The table's name.</param>
        /// <param name="parameters">The SQL statement parameters.</param>
        /// <param name="expectedRecordCount">The expected matched record count.</param>
        internal static void AssertDatabaseRecordCount(string tableName,
            IDictionary<string, object> parameters, int expectedRecordCount)
        {
            StringBuilder sql = new StringBuilder();

            sql.AppendFormat("SELECT COUNT(*) FROM [{0}] WHERE 1 = 1", tableName);

            // Build WHERE clause
            foreach (KeyValuePair<string, object> pair in parameters)
            {
                sql.AppendFormat(" AND [{0}] " + (pair.Value == null ? "IS NULL" : "= @{0}"), pair.Key);
            }

            int recordCount = (int)Execute(sql.ToString(), parameters);
            Assert.AreEqual(expectedRecordCount, recordCount,
                string.Format("Expected {0} records in {1} table with given parameters, but was {2}.",
                expectedRecordCount, tableName, recordCount));
        }

        /// <summary>
        /// Gets <see cref="IDbConnection"/> instance to access the persistence.
        /// </summary>
        ///
        /// <returns>The created connection.</returns>
        private static IDbConnection GetConnection()
        {
            IDbConnection connection = null;
            try
            {
                // Create the connection
                connection = new SqlConnection(
                    ConfigurationManager.ConnectionStrings[ConnectionStringName].ConnectionString);

                // Open the connection
                connection.Open();

                // Return the opened connection
                return connection;
            }
            catch
            {
                // Be sure to dispose of connection object if it isn't null
                if (connection != null)
                {
                    connection.Dispose();
                }
                throw;
            }
        }

        /// <summary>
        /// Executes the given SQL statement.
        /// </summary>
        ///
        /// <param name="sql">The SQL statement to execute.</param>
        /// <param name="parameters">The parameters for the statement.</param>
        /// <returns>The scalar result of executed query.</returns>
        private static object Execute(string sql, IEnumerable<KeyValuePair<string, object>> parameters = null)
        {
            using (IDbConnection connection = GetConnection())
            {
                using (IDbCommand cmd = connection.CreateCommand())
                {
                    cmd.CommandText = sql;
                    if (parameters != null)
                    {
                        foreach (KeyValuePair<string, object> pair in parameters)
                        {
                            if (pair.Value == null)
                            {
                                continue;
                            }
                            IDataParameter parameter = cmd.CreateParameter();
                            parameter.ParameterName = "@" + pair.Key;
                            parameter.Value = pair.Value;
                            cmd.Parameters.Add(parameter);
                        }
                    }
                    return cmd.ExecuteScalar();
                }
            }
        }
    }
}
