/*
 * Hibernate, Relational Persistence for Idiomatic Java
 *
 * License: GNU Lesser General Public License (LGPL), version 2.1 or later.
 * See the lgpl.txt file in the root directory or <http://www.gnu.org/licenses/lgpl-2.1.html>.
 */

package org.hibernate.dialect;

import jakarta.persistence.TemporalType;
import org.hibernate.LockMode;
import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.dialect.identity.InterSystemsIRISIdentityColumnSupport;
import org.hibernate.dialect.lock.*;
import org.hibernate.dialect.pagination.LimitHandler;
import org.hibernate.dialect.pagination.TopLimitHandler;
import org.hibernate.dialect.sequence.NoSequenceSupport;
import org.hibernate.dialect.sequence.SequenceSupport;
import org.hibernate.engine.jdbc.dialect.spi.DialectResolutionInfo;
import org.hibernate.engine.jdbc.env.spi.IdentifierHelper;
import org.hibernate.engine.jdbc.env.spi.IdentifierHelperBuilder;
import org.hibernate.engine.jdbc.env.spi.NameQualifierSupport;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.exception.ConstraintViolationException;
import org.hibernate.exception.DataException;
import org.hibernate.exception.spi.SQLExceptionConversionDelegate;
import org.hibernate.exception.spi.TemplatedViolatedConstraintNameExtractor;
import org.hibernate.exception.spi.ViolatedConstraintNameExtractor;
import org.hibernate.function.IRISFunctionFactory;
import org.hibernate.internal.util.JdbcExceptionHelper;
import org.hibernate.persister.entity.Lockable;
import org.hibernate.query.sqm.IntervalType;
import org.hibernate.query.sqm.TemporalUnit;
import org.hibernate.sql.ast.SqlAstNodeRenderingMode;
import org.hibernate.sql.ast.SqlAstTranslator;
import org.hibernate.sql.ast.SqlAstTranslatorFactory;
import org.hibernate.sql.ast.spi.SqlAppender;
import org.hibernate.sql.ast.spi.StandardSqlAstTranslatorFactory;
import org.hibernate.sql.ast.tree.Statement;
import org.hibernate.sql.exec.spi.JdbcOperation;
import org.hibernate.type.StandardBasicTypes;
import org.hibernate.type.descriptor.jdbc.JdbcType;
import org.hibernate.type.descriptor.jdbc.spi.JdbcTypeRegistry;

import java.sql.*;

import static org.hibernate.exception.spi.TemplatedViolatedConstraintNameExtractor.extractUsingTemplate;
import static org.hibernate.query.sqm.produce.function.FunctionParameterType.INTEGER;
import static org.hibernate.query.sqm.produce.function.FunctionParameterType.STRING;
import static org.hibernate.type.SqlTypes.BOOLEAN;
import static org.hibernate.type.SqlTypes.TIMESTAMP_WITH_TIMEZONE;

public class InterSystemsIRISDialect extends Dialect {

    static final DatabaseVersion MINIMUM_VERSION = DatabaseVersion.make(2019, 1);

    public InterSystemsIRISDialect() {
        super(MINIMUM_VERSION);
    }

    public InterSystemsIRISDialect(DialectResolutionInfo info) {
        super(info);
    }

    public InterSystemsIRISDialect(DatabaseVersion version) {
        super(version);
    }

    @Override
    protected DatabaseVersion getMinimumSupportedVersion() {
        return MINIMUM_VERSION;
    }

    @Override
    public int getDefaultStatementBatchSize() {
        return 15;
    }

    @Override
    public int getMaxVarcharLength() {
        return 3_641_144;
    }

    @Override
    public int getDefaultDecimalPrecision() {
        return 19;
    }

    @Override
    public NameQualifierSupport getNameQualifierSupport() {
        return NameQualifierSupport.SCHEMA;
    }

    @Override
    public IdentifierHelper buildIdentifierHelper(
        IdentifierHelperBuilder builder,
        DatabaseMetaData dbMetaData) throws SQLException {
        builder.setAutoQuoteKeywords(true);
        builder.applyReservedWords(
            "absolute",
            "asc",
            "assertion",
            "avg",
            "bit",
            "bit_length",
            "cascade",
            "character_length",
            "char_length",
            "coalesce",
            "connection",
            "constraints",
            "convert",
            "count",
            "deferrable",
            "deferred",
            "desc",
            "descriptor",
            "diagnostics",
            "domain",
            "endexec",
            "exception",
            "extract",
            "first",
            "found",
            "go",
            "goto",
            "initially",
            "isolation",
            "last",
            "level",
            "lower",
            "max",
            "min",
            "names",
            "next",
            "nullif",
            "octet_length",
            "option",
            "pad",
            "partial",
            "preserve",
            "prior",
            "privileges",
            "public",
            "read",
            "relative",
            "restrict",
            "role",
            "schema",
            "section",
            "session_user",
            "shard",
            "space",
            "sqlerror",
            "statistics",
            "substring",
            "sum",
            "sysdate",
            "temporary",
            "top",
            "transaction",
            "trim",
            "upper",
            "work",
            "write ");
        return super.buildIdentifierHelper(builder, dbMetaData);
    }

    @Override
    public boolean supportsAlterColumnType() {
        return true;
    }

    @Override
    public String getCascadeConstraintsString() {
        return " CASCADE";
    }

    @Override
    public boolean supportsIfExistsBeforeTableName() {
        return true;
    }

    @Override
    public boolean supportsColumnCheck() {
        return false;
    }

    @Override
    public boolean supportsNullPrecedence() {
        return false;
    }

    @Override
    protected String columnType(int sqlTypeCode) {
        return switch (sqlTypeCode) {
            case BOOLEAN -> "bit";
            case Types.TIMESTAMP -> "timestamp";
            case TIMESTAMP_WITH_TIMEZONE -> "timestamp";
            default -> super.columnType(sqlTypeCode);
        };
    }

    @Override
    protected void initDefaultProperties() {
        super.initDefaultProperties();
        getDefaultProperties().setProperty(AvailableSettings.USE_SQL_COMMENTS, "false" );
    }



    private static void useJdbcEscape(FunctionContributions queryEngine, String name) {
        //Yep, this seems to be truly necessary for certain functions
        queryEngine.getFunctionRegistry().wrapInJdbcEscape(
            name,
            queryEngine.getFunctionRegistry().findFunctionDescriptor(name)
        );
    }

    @Override
    public JdbcType resolveSqlTypeDescriptor(
        String columnTypeName,
        int jdbcTypeCode,
        int precision,
        int scale,
        JdbcTypeRegistry jdbcTypeRegistry) {
        if ( jdbcTypeCode == Types.BIT ) {
            return jdbcTypeRegistry.getDescriptor( Types.BOOLEAN );
        }
        return super.resolveSqlTypeDescriptor(
            columnTypeName,
            jdbcTypeCode,
            precision,
            scale,
            jdbcTypeRegistry
        );
    }

    @Override
    public int getPreferredSqlTypeCodeForBoolean() {
        return Types.BIT;
    }

    @Override
    public void initializeFunctionRegistry(FunctionContributions functionContributions) {
        super.initializeFunctionRegistry(functionContributions);

        IRISFunctionFactory functionFactory = new IRISFunctionFactory(functionContributions);
        functionFactory.repeat();
        functionFactory.trim2();
        functionFactory.substr();
        functionFactory.cot();
        //also natively supports ANSI-style substring()
        functionFactory.concat_pipeOperator();
        functionFactory.log10();
        functionFactory.log();
        functionFactory.pi();
        functionFactory.space();
        functionFactory.hourMinuteSecond();
        functionFactory.yearMonthDay();
        functionFactory.weekQuarter();
        functionFactory.daynameMonthname();
        functionFactory.toCharNumberDateTimestamp();
        functionFactory.characterLength_length( SqlAstNodeRenderingMode.DEFAULT );
        functionFactory.trunc_truncate();
        functionFactory.dayofweekmonthyear();
        functionFactory.repeat_replicate();
        functionFactory.datepartDatename();
        functionFactory.ascii();
        functionFactory.chr_char();
        functionFactory.nowCurdateCurtime();
        functionFactory.sysdate();
        functionFactory.stddev();
        functionFactory.stddevPopSamp();
        functionFactory.variance();
        functionFactory.varPopSamp();
        functionFactory.lastDay();
        functionFactory.sinCosTanAtan2();
        functionFactory.exp();

        functionContributions.getFunctionRegistry().registerBinaryTernaryPattern(
            "locate",
            functionContributions.getTypeConfiguration().getBasicTypeRegistry().resolve( StandardBasicTypes.INTEGER ),
            "$find(?2,?1)",
            "$find(?2,?1,?3)",
            STRING, STRING, INTEGER,
            functionContributions.getTypeConfiguration()
        ).setArgumentListSignature("(pattern, string[, start])");

        functionFactory.bitLength_pattern( "($length(?1)*8)" );

        useJdbcEscape(functionContributions, "asin");
        useJdbcEscape(functionContributions, "acos");
        useJdbcEscape(functionContributions, "atan");
        useJdbcEscape(functionContributions, "log");
        useJdbcEscape(functionContributions, "log10");

        useJdbcEscape(functionContributions, "left");
        useJdbcEscape(functionContributions, "right");

        useJdbcEscape(functionContributions, "hour");
        useJdbcEscape(functionContributions, "minute");
        useJdbcEscape(functionContributions, "second");
        useJdbcEscape(functionContributions, "week");
        useJdbcEscape(functionContributions, "quarter");

        useJdbcEscape(functionContributions, "trunc");
        useJdbcEscape(functionContributions, "curdate");
        useJdbcEscape(functionContributions, "curtime");
    }

    @Override
    public String extractPattern(TemporalUnit unit) {
        return "datepart(?1,?2)";
    }

    @Override
    public String timestampaddPattern(TemporalUnit unit, TemporalType temporalType, IntervalType intervalType) {
        return switch (unit) {
            case NANOSECOND, NATIVE -> "dateadd(millisecond,(?2)/1e6,?3)";
            default -> "dateadd(?1,?2,?3)";
        };
    }

    @Override
    public String timestampdiffPattern(TemporalUnit unit, TemporalType fromTemporalType, TemporalType toTemporalType) {
        return switch (unit) {
            case NANOSECOND, NATIVE -> "datediff(millisecond,?2,?3)*1e6";
            default -> "datediff(?1,?2,?3)";
        };
    }

    // DDL support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public boolean qualifyIndexName() {
        // Do we need to qualify index names with the schema name?
        return false;
    }

    @Override
    public String getAddForeignKeyConstraintString(
        String constraintName,
        String[] foreignKey,
        String referencedTable,
        String[] primaryKey,
        boolean referencesPrimaryKey) {
        // The syntax used to add a foreign key constraint to a table.
        return " ADD CONSTRAINT " +
            constraintName +
            " FOREIGN KEY " +
            constraintName +
            " (" +
            String.join(", ", foreignKey) +
            ") REFERENCES " +
            referencedTable +
            " (" +
            String.join(", ", primaryKey) +
            ") ";
    }

    @Override
    public boolean hasSelfReferentialForeignKeyBug() {
        return true;
    }


    @Override
    public String getNativeIdentifierGeneratorStrategy() {
        return "identity";
    }

    // IDENTITY support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public IdentityColumnSupport getIdentityColumnSupport() {
        return InterSystemsIRISIdentityColumnSupport.INSTANCE;
    }

    @Override
    public SequenceSupport getSequenceSupport() {
        return NoSequenceSupport.INSTANCE;
    }

    // lock acquisition support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public boolean supportsOuterJoinForUpdate() {
        return false;
    }

    @Override
    public LockingStrategy getLockingStrategy(Lockable lockable, LockMode lockMode) {
        // InterSystems IRIS' does not current support "SELECT ... FOR UPDATE" syntax...
        // Set your transaction mode to READ_COMMITTED before using
        switch (lockMode) {
            case PESSIMISTIC_FORCE_INCREMENT -> {
                return new PessimisticForceIncrementLockingStrategy(lockable, lockMode);
            }
            case PESSIMISTIC_WRITE -> {
                return new PessimisticWriteUpdateLockingStrategy(lockable, lockMode);
            }
            case PESSIMISTIC_READ -> {
                return new PessimisticReadUpdateLockingStrategy(lockable, lockMode);
            }
            case OPTIMISTIC -> {
                return new OptimisticLockingStrategy(lockable, lockMode);
            }
            case OPTIMISTIC_FORCE_INCREMENT -> {
                return new OptimisticForceIncrementLockingStrategy(lockable, lockMode);
            }
        }
        if ( lockMode.greaterThan( LockMode.READ ) ) {
            return new UpdateLockingStrategy( lockable, lockMode );
        }
        else {
            return new SelectLockingStrategy( lockable, lockMode );
        }
    }

    @Override
    public SqlAstTranslatorFactory getSqlAstTranslatorFactory() {
        return new StandardSqlAstTranslatorFactory() {
            @Override
            protected <T extends JdbcOperation> SqlAstTranslator<T> buildTranslator(
                SessionFactoryImplementor sessionFactory, Statement statement) {
                return new InterSystemsIRISSqlAstTranslator<>( sessionFactory, statement );
            }
        };
    }

    // LIMIT support (ala TOP) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public LimitHandler getLimitHandler() {
        return TopLimitHandler.INSTANCE;
    }

    // callable statement support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public int registerResultSetOutParameter(CallableStatement statement, int col) {
        return col;
    }

    @Override
    public ResultSet getResultSet(CallableStatement ps) throws SQLException {
        ps.execute();
        return (ResultSet) ps.getObject( 1 );
    }

    // miscellaneous support ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public String getNullColumnString() {
        // The keyword used to specify a nullable column.
        return " null";
    }

    @Override
    public String getNoColumnsInsertString() {
        // The keyword used to insert a row without specifying
        // any column values
        return " default values";
    }

    @Override
    public SQLExceptionConversionDelegate buildSQLExceptionConversionDelegate() {
        return (sqlException, message, sql) -> {
            String sqlStateClassCode = JdbcExceptionHelper.extractSqlStateClassCode( sqlException );
            if ( sqlStateClassCode != null ) {
                int errorCode = JdbcExceptionHelper.extractErrorCode( sqlException );
                if ( errorCode >= 119 && errorCode <= 127 && errorCode != 126 ) {
                    final String constraintName = getViolatedConstraintNameExtractor().extractConstraintName(sqlException);
                    return new ConstraintViolationException( message, sqlException, sql, constraintName );
                }

                if ( sqlStateClassCode.equals("22")
                    || sqlStateClassCode.equals("21")
                    || sqlStateClassCode.equals("02") ) {
                    return new DataException( message, sqlException, sql );
                }
            }
            return null; // allow other delegates the chance to look
        };
    }

    @Override
    public ViolatedConstraintNameExtractor getViolatedConstraintNameExtractor() {
        return EXTRACTOR;
    }

    private static final ViolatedConstraintNameExtractor EXTRACTOR =
        new TemplatedViolatedConstraintNameExtractor( sqle ->
            extractUsingTemplate( "constraint (", ") violated", sqle.getMessage() )
        );


    // Overridden informational metadata ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @Override
    public boolean supportsOrderByInSubquery() {
        // This is just a guess
        return false;
    }

    @Override
    public boolean supportsResultSetPositionQueryMethodsOnForwardOnlyCursor() {
        return false;
    }

    @Override
    public void appendDatetimeFormat(SqlAppender appender, String format) {
        //I don't think IRIS needs FM
        appender.appendSql( OracleDialect.datetimeFormat( format, false, false ).result() );
    }

    @Override
    public boolean supportsCurrentTimestampSelection() {
        return true;
    }

    @Override
    public String getCurrentTimestampSelectString() {
        return "select now()";
    }

    @Override
    public boolean isCurrentTimestampSelectStringCallable() {
        return false;
    }

    @Override
    public void appendBinaryLiteral(SqlAppender appender, byte[] bytes) {
        appendLiteral(appender, new String(bytes));
    }

}
