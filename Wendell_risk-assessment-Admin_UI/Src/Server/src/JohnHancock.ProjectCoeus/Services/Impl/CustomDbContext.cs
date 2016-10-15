/*
 * Copyright (c) 2016, TopCoder, Inc. All rights reserved.
 */

using JohnHancock.ProjectCoeus.Entities;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace JohnHancock.ProjectCoeus.Services.Impl
{
    /// <summary>
    /// This class provides access to the database.
    /// </summary>
    ///
    /// <threadsafety>
    /// This class is mutable but effectively thread-safe.
    /// </threadsafety>
    ///
    /// <author>LOY, NightWolf</author>
    /// <version>1.0</version>
    /// <copyright>Copyright (c) 2016, TopCoder, Inc. All rights reserved.</copyright>
    public class CustomDbContext : DbContext
    {
        /// <summary>
        /// Gets or sets the assessment set.
        /// </summary>
        /// <value>
        /// The assessment set.
        /// </value>
        public DbSet<Assessment> AssessmentSet { get; set; }

        /// <summary>
        /// Gets or sets the token set.
        /// </summary>
        /// <value>
        /// The token set.
        /// </value>
        public DbSet<Token> TokenSet { get; set; }

        /// <summary>
        /// Gets or sets the action permission set.
        /// </summary>
        /// <value>
        /// The action permission set.
        /// </value>
        public DbSet<ActionPermission> ActionPermissionSet { get; set; }

        /// <summary>
        /// Gets or sets the audit record set.
        /// </summary>
        /// <value>
        /// The audit record set.
        /// </value>
        public DbSet<AuditRecord> AuditRecordSet { get; set; }

        /// <summary>
        /// Gets or sets the business unit set.
        /// </summary>
        /// <value>
        /// The business unit set.
        /// </value>
        public DbSet<BusinessUnit> BusinessUnitSet { get; set; }

        /// <summary>
        /// Gets or sets the department head set.
        /// </summary>
        /// <value>
        /// The department head set.
        /// </value>
        public DbSet<DepartmentHead> DepartmentHeadSet { get; set; }

        /// <summary>
        /// Gets or sets the product set.
        /// </summary>
        /// <value>
        /// The product set.
        /// </value>
        public DbSet<Product> ProductSet { get; set; }

        /// <summary>
        /// Gets or sets the department set.
        /// </summary>
        /// <value>
        /// The department set.
        /// </value>
        public DbSet<Department> DepartmentSet { get; set; }

        /// <summary>
        /// Gets or sets the risk exposure set.
        /// </summary>
        /// <value>
        /// The risk exposure set.
        /// </value>
        public DbSet<RiskExposure> RiskExposureSet { get; set; }

        /// <summary>
        /// Gets or sets the category set.
        /// </summary>
        /// <value>
        /// The category set.
        /// </value>
        public DbSet<Category> CategorySet { get; set; }

        /// <summary>
        /// Gets or sets the likelihood of occurrence set.
        /// </summary>
        /// <value>
        /// The likelihood of occurrence set.
        /// </value>
        public DbSet<LikelihoodOfOccurrence> LikelihoodOfOccurrenceSet { get; set; }

        /// <summary>
        /// Gets or sets the risk impact set.
        /// </summary>
        /// <value>
        /// The risk impact set.
        /// </value>
        public DbSet<RiskImpact> RiskImpactSet { get; set; }

        /// <summary>
        /// Gets or sets the KPICategory set.
        /// </summary>
        /// <value>
        /// The KPICategory set.
        /// </value>
        public DbSet<KPICategory> KPICategorySet { get; set; }

        /// <summary>
        /// Gets or sets the KPI set.
        /// </summary>
        /// <value>
        /// The KPI set.
        /// </value>
        public DbSet<KPI> KPISet { get; set; }

        /// <summary>
        /// Gets or sets the process risk set.
        /// </summary>
        /// <value>
        /// The process risk set.
        /// </value>
        public DbSet<ProcessRisk> ProcessRiskSet { get; set; }

        /// <summary>
        /// Gets or sets the control frequency set.
        /// </summary>
        /// <value>
        /// The control frequency set.
        /// </value>
        public DbSet<ControlFrequency> ControlFrequencySet { get; set; }

        /// <summary>
        /// Gets or sets the control trigger set.
        /// </summary>
        /// <value>
        /// The control trigger set.
        /// </value>
        public DbSet<ControlTrigger> ControlTriggerSet { get; set; }

        /// <summary>
        /// Gets or sets the key controls maturity set.
        /// </summary>
        /// <value>
        /// The key controls maturity set.
        /// </value>
        public DbSet<KeyControlsMaturity> KeyControlsMaturitySet { get; set; }

        /// <summary>
        /// Gets or sets the control design set.
        /// </summary>
        /// <value>
        /// The control design set.
        /// </value>
        public DbSet<ControlDesign> ControlDesignSet { get; set; }

        /// <summary>
        /// Gets or sets the testing frequency set.
        /// </summary>
        /// <value>
        /// The testing frequency set.
        /// </value>
        public DbSet<TestingFrequency> TestingFrequencySet { get; set; }

        /// <summary>
        /// Gets or sets the percentage set.
        /// </summary>
        /// <value>
        /// The percentage set.
        /// </value>
        public DbSet<Percentage> PercentageSet { get; set; }

        /// <summary>
        /// Gets or sets the functional area owner set.
        /// </summary>
        /// <value>
        /// The functional area owner set.
        /// </value>
        public DbSet<FunctionalAreaOwner> FunctionalAreaOwnerSet { get; set; }

        /// <summary>
        /// Gets or sets the functional area set.
        /// </summary>
        /// <value>
        /// The functional area set.
        /// </value>
        public DbSet<FunctionalArea> FunctionalAreaSet { get; set; }

        /// <summary>
        /// Gets or sets the control type set.
        /// </summary>
        /// <value>
        /// The control type set.
        /// </value>
        public DbSet<ControlType> ControlTypeSet { get; set; }

        /// <summary>
        /// Gets or sets the core process set.
        /// </summary>
        /// <value>
        /// The core process set.
        /// </value>
        public DbSet<CoreProcess> CoreProcessSet { get; set; }

        /// <summary>
        /// Gets or sets the sub process risk set.
        /// </summary>
        /// <value>
        /// The sub process risk set.
        /// </value>
        public DbSet<SubProcessRisk> SubProcessRiskSet { get; set; }

        /// <summary>
        /// Initializes the <see cref="CustomDbContext"/> class.
        /// </summary>
        static CustomDbContext()
        {
            Database.SetInitializer<CustomDbContext>(null);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CustomDbContext"/> class.
        /// </summary>
        /// <param name="connectionStringName">The name of the connection string to use.</param>
        public CustomDbContext(string connectionStringName)
            : base(connectionStringName)
        {
        }

        /// <summary>
        /// Customizes mappings between entity model and database.
        /// </summary>
        /// <param name="modelBuilder">The model builder.</param>
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            // set ignored fields
            modelBuilder.Entity<Assessment>().Ignore(x => x.BUFunctionalApprover);
            modelBuilder.Entity<Assessment>().Ignore(x => x.BURiskManagementApprover);
            modelBuilder.Entity<Assessment>().Ignore(x => x.DivisionalRiskManagementApprover);
            modelBuilder.Entity<Assessment>().Ignore(x => x.Rejecter);
            modelBuilder.Entity<Assessment>().Ignore(x => x.Submitter);

            modelBuilder.Entity<KPISLAAssessment>().ToTable("KPISLAAssessment");
            modelBuilder.Entity<FunctionalAreaProcessAssessment>().ToTable("FunctionalAreaProcessAssessment");
            modelBuilder.Entity<ProcessRiskAssessment>().ToTable("ProcessRiskAssessment");

            // many to many: FutureFunctionChanges
            modelBuilder.Entity<Assessment>().HasMany(x => x.FutureFunctionChanges)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("AssessmentId");
                    x.MapRightKey("FunctionChangeId");
                    x.ToTable("FutureFunctionChanges");
                });

            // many to many: PriorFunctionChanges
            modelBuilder.Entity<Assessment>().HasMany(x => x.PriorFunctionChanges)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("AssessmentId");
                    x.MapRightKey("FunctionChangeId");
                    x.ToTable("PriorFunctionChanges");
                });

            // many to many: ControlAssessment_ControlDesign
            modelBuilder.Entity<ControlAssessment>().HasMany(x => x.ControlDesigns)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("ControlAssessmentId");
                    x.MapRightKey("ControlDesignId");
                    x.ToTable("ControlAssessment_ControlDesign");
                });

            // many to many: ControlAssessment_ControlTrigger
            modelBuilder.Entity<ControlAssessment>().HasMany(x => x.ControlTriggers)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("ControlAssessmentId");
                    x.MapRightKey("ControlTriggerId");
                    x.ToTable("ControlAssessment_ControlTrigger");
                });

            // many to many: ControlAssessment_TestingFrequency
            modelBuilder.Entity<ControlAssessment>().HasMany(x => x.TestingFrequencies)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("ControlAssessmentId");
                    x.MapRightKey("TestingFrequencyId");
                    x.ToTable("ControlAssessment_TestingFrequency");
                });

            // many to many: ProcessControlAssessment_RiskImpact
            modelBuilder.Entity<ProcessControlAssessment>().HasMany(x => x.RiskImpacts)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("ProcessControlAssessmentId");
                    x.MapRightKey("RiskImpactId");
                    x.ToTable("ProcessControlAssessment_RiskImpact");
                });

            modelBuilder.Entity<CoreProcess>().HasMany(x => x.ControlTypes)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("CoreProcessId");
                    x.MapRightKey("ControlTypeId");
                    x.ToTable("CoreProcess_ControlType");
                });

            modelBuilder.Entity<ProcessRisk>().HasMany(x => x.ControlTypes)
                .WithMany().Map(x =>
                {
                    x.MapLeftKey("ProcessRiskId");
                    x.MapRightKey("ControlTypeId");
                    x.ToTable("ProcessRisk_ControlType");
                });
            base.OnModelCreating(modelBuilder);
        }
    }
}