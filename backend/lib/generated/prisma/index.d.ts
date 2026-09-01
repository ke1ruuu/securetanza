
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CrimeIncident
 * 
 */
export type CrimeIncident = $Result.DefaultSelection<Prisma.$CrimeIncidentPayload>
/**
 * Model Barangay
 * 
 */
export type Barangay = $Result.DefaultSelection<Prisma.$BarangayPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model NotificationRule
 * 
 */
export type NotificationRule = $Result.DefaultSelection<Prisma.$NotificationRulePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ExportSchedule
 * 
 */
export type ExportSchedule = $Result.DefaultSelection<Prisma.$ExportSchedulePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model UserPermission
 * 
 */
export type UserPermission = $Result.DefaultSelection<Prisma.$UserPermissionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NotificationSeverity: {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

export type NotificationSeverity = (typeof NotificationSeverity)[keyof typeof NotificationSeverity]


export const NotificationCategory: {
  PEAK_HOUR: 'PEAK_HOUR',
  CRIME_ACTIVITY: 'CRIME_ACTIVITY',
  DATASET_PROCESSING: 'DATASET_PROCESSING',
  SYSTEM: 'SYSTEM'
};

export type NotificationCategory = (typeof NotificationCategory)[keyof typeof NotificationCategory]


export const RuleConditionType: {
  HOURLY_PERCENT_EXCEEDS: 'HOURLY_PERCENT_EXCEEDS',
  BARANGAY_INCREASE_PERCENT: 'BARANGAY_INCREASE_PERCENT',
  HEINOUS_CRIME_DETECTED: 'HEINOUS_CRIME_DETECTED',
  SPECIFIC_CRIME_THRESHOLD: 'SPECIFIC_CRIME_THRESHOLD',
  UPLOAD_VALIDATION_ERROR_RATE: 'UPLOAD_VALIDATION_ERROR_RATE'
};

export type RuleConditionType = (typeof RuleConditionType)[keyof typeof RuleConditionType]

}

export type NotificationSeverity = $Enums.NotificationSeverity

export const NotificationSeverity: typeof $Enums.NotificationSeverity

export type NotificationCategory = $Enums.NotificationCategory

export const NotificationCategory: typeof $Enums.NotificationCategory

export type RuleConditionType = $Enums.RuleConditionType

export const RuleConditionType: typeof $Enums.RuleConditionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more CrimeIncidents
 * const crimeIncidents = await prisma.crimeIncident.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more CrimeIncidents
   * const crimeIncidents = await prisma.crimeIncident.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.crimeIncident`: Exposes CRUD operations for the **CrimeIncident** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrimeIncidents
    * const crimeIncidents = await prisma.crimeIncident.findMany()
    * ```
    */
  get crimeIncident(): Prisma.CrimeIncidentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.barangay`: Exposes CRUD operations for the **Barangay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Barangays
    * const barangays = await prisma.barangay.findMany()
    * ```
    */
  get barangay(): Prisma.BarangayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificationRule`: Exposes CRUD operations for the **NotificationRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationRules
    * const notificationRules = await prisma.notificationRule.findMany()
    * ```
    */
  get notificationRule(): Prisma.NotificationRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exportSchedule`: Exposes CRUD operations for the **ExportSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExportSchedules
    * const exportSchedules = await prisma.exportSchedule.findMany()
    * ```
    */
  get exportSchedule(): Prisma.ExportScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPermission`: Exposes CRUD operations for the **UserPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPermissions
    * const userPermissions = await prisma.userPermission.findMany()
    * ```
    */
  get userPermission(): Prisma.UserPermissionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CrimeIncident: 'CrimeIncident',
    Barangay: 'Barangay',
    AuditLog: 'AuditLog',
    Notification: 'Notification',
    NotificationRule: 'NotificationRule',
    User: 'User',
    ExportSchedule: 'ExportSchedule',
    Permission: 'Permission',
    UserPermission: 'UserPermission'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "crimeIncident" | "barangay" | "auditLog" | "notification" | "notificationRule" | "user" | "exportSchedule" | "permission" | "userPermission"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CrimeIncident: {
        payload: Prisma.$CrimeIncidentPayload<ExtArgs>
        fields: Prisma.CrimeIncidentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrimeIncidentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrimeIncidentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          findFirst: {
            args: Prisma.CrimeIncidentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrimeIncidentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          findMany: {
            args: Prisma.CrimeIncidentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>[]
          }
          create: {
            args: Prisma.CrimeIncidentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          createMany: {
            args: Prisma.CrimeIncidentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrimeIncidentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>[]
          }
          delete: {
            args: Prisma.CrimeIncidentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          update: {
            args: Prisma.CrimeIncidentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          deleteMany: {
            args: Prisma.CrimeIncidentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrimeIncidentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CrimeIncidentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>[]
          }
          upsert: {
            args: Prisma.CrimeIncidentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrimeIncidentPayload>
          }
          aggregate: {
            args: Prisma.CrimeIncidentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrimeIncident>
          }
          groupBy: {
            args: Prisma.CrimeIncidentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrimeIncidentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrimeIncidentCountArgs<ExtArgs>
            result: $Utils.Optional<CrimeIncidentCountAggregateOutputType> | number
          }
        }
      }
      Barangay: {
        payload: Prisma.$BarangayPayload<ExtArgs>
        fields: Prisma.BarangayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BarangayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BarangayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          findFirst: {
            args: Prisma.BarangayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BarangayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          findMany: {
            args: Prisma.BarangayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          create: {
            args: Prisma.BarangayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          createMany: {
            args: Prisma.BarangayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BarangayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          delete: {
            args: Prisma.BarangayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          update: {
            args: Prisma.BarangayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          deleteMany: {
            args: Prisma.BarangayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BarangayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BarangayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          upsert: {
            args: Prisma.BarangayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          aggregate: {
            args: Prisma.BarangayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBarangay>
          }
          groupBy: {
            args: Prisma.BarangayGroupByArgs<ExtArgs>
            result: $Utils.Optional<BarangayGroupByOutputType>[]
          }
          count: {
            args: Prisma.BarangayCountArgs<ExtArgs>
            result: $Utils.Optional<BarangayCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      NotificationRule: {
        payload: Prisma.$NotificationRulePayload<ExtArgs>
        fields: Prisma.NotificationRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          findFirst: {
            args: Prisma.NotificationRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          findMany: {
            args: Prisma.NotificationRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          create: {
            args: Prisma.NotificationRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          createMany: {
            args: Prisma.NotificationRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          delete: {
            args: Prisma.NotificationRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          update: {
            args: Prisma.NotificationRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          deleteMany: {
            args: Prisma.NotificationRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>[]
          }
          upsert: {
            args: Prisma.NotificationRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationRulePayload>
          }
          aggregate: {
            args: Prisma.NotificationRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationRule>
          }
          groupBy: {
            args: Prisma.NotificationRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationRuleCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationRuleCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ExportSchedule: {
        payload: Prisma.$ExportSchedulePayload<ExtArgs>
        fields: Prisma.ExportScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExportScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExportScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          findFirst: {
            args: Prisma.ExportScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExportScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          findMany: {
            args: Prisma.ExportScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          create: {
            args: Prisma.ExportScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          createMany: {
            args: Prisma.ExportScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExportScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          delete: {
            args: Prisma.ExportScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          update: {
            args: Prisma.ExportScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          deleteMany: {
            args: Prisma.ExportScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExportScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExportScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          upsert: {
            args: Prisma.ExportScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          aggregate: {
            args: Prisma.ExportScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExportSchedule>
          }
          groupBy: {
            args: Prisma.ExportScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExportScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExportScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ExportScheduleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      UserPermission: {
        payload: Prisma.$UserPermissionPayload<ExtArgs>
        fields: Prisma.UserPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findFirst: {
            args: Prisma.UserPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findMany: {
            args: Prisma.UserPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          create: {
            args: Prisma.UserPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          createMany: {
            args: Prisma.UserPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          delete: {
            args: Prisma.UserPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          update: {
            args: Prisma.UserPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          deleteMany: {
            args: Prisma.UserPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserPermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          upsert: {
            args: Prisma.UserPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          aggregate: {
            args: Prisma.UserPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPermission>
          }
          groupBy: {
            args: Prisma.UserPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    crimeIncident?: CrimeIncidentOmit
    barangay?: BarangayOmit
    auditLog?: AuditLogOmit
    notification?: NotificationOmit
    notificationRule?: NotificationRuleOmit
    user?: UserOmit
    exportSchedule?: ExportScheduleOmit
    permission?: PermissionOmit
    userPermission?: UserPermissionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AuditLogCountOutputType
   */

  export type AuditLogCountOutputType = {
    notifications: number
  }

  export type AuditLogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | AuditLogCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * AuditLogCountOutputType without action
   */
  export type AuditLogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLogCountOutputType
     */
    select?: AuditLogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuditLogCountOutputType without action
   */
  export type AuditLogCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    permissions: number
    exportSchedules: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | UserCountOutputTypeCountPermissionsArgs
    exportSchedules?: boolean | UserCountOutputTypeCountExportSchedulesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExportSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportScheduleWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    users: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | PermissionCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CrimeIncident
   */

  export type AggregateCrimeIncident = {
    _count: CrimeIncidentCountAggregateOutputType | null
    _avg: CrimeIncidentAvgAggregateOutputType | null
    _sum: CrimeIncidentSumAggregateOutputType | null
    _min: CrimeIncidentMinAggregateOutputType | null
    _max: CrimeIncidentMaxAggregateOutputType | null
  }

  export type CrimeIncidentAvgAggregateOutputType = {
    suspectCount: number | null
    victimCount: number | null
    latitude: number | null
    longitude: number | null
  }

  export type CrimeIncidentSumAggregateOutputType = {
    suspectCount: number | null
    victimCount: number | null
    latitude: number | null
    longitude: number | null
  }

  export type CrimeIncidentMinAggregateOutputType = {
    id: string | null
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string | null
    street: string | null
    typeOfPlace: string | null
    dateReported: Date | null
    timeReported: string | null
    dateCommitted: Date | null
    timeCommitted: string | null
    incidentType: string | null
    isCrime: boolean | null
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean | null
    sensational: boolean | null
    threatGrp: boolean | null
    grpAffiliation: string | null
    incidentTypeThreatGrp: string | null
    mrs: string | null
    suspectIsEGO: boolean | null
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean | null
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CrimeIncidentMaxAggregateOutputType = {
    id: string | null
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string | null
    street: string | null
    typeOfPlace: string | null
    dateReported: Date | null
    timeReported: string | null
    dateCommitted: Date | null
    timeCommitted: string | null
    incidentType: string | null
    isCrime: boolean | null
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean | null
    sensational: boolean | null
    threatGrp: boolean | null
    grpAffiliation: string | null
    incidentTypeThreatGrp: string | null
    mrs: string | null
    suspectIsEGO: boolean | null
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean | null
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CrimeIncidentCountAggregateOutputType = {
    id: number
    blotterNo: number
    dateEncoded: number
    pro: number
    ppo: number
    stn: number
    pcp: number
    region: number
    province: number
    municipal: number
    barangay: number
    street: number
    typeOfPlace: number
    dateReported: number
    timeReported: number
    dateCommitted: number
    timeCommitted: number
    incidentType: number
    isCrime: number
    modeReporting: number
    stageOfFelony: number
    offense: number
    offenseType: number
    section: number
    modus: number
    suspectMotive: number
    suspectSubMotive: number
    heinous: number
    sensational: number
    threatGrp: number
    grpAffiliation: number
    incidentTypeThreatGrp: number
    mrs: number
    suspectIsEGO: number
    suspectEGOPosition: number
    suspectEGOClass: number
    suspectCount: number
    suspectArrested: number
    victimIsEGO: number
    victimEGOPosition: number
    victimEGOClass: number
    victimCount: number
    caseStatus: number
    investigator: number
    headInves: number
    latitude: number
    longitude: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CrimeIncidentAvgAggregateInputType = {
    suspectCount?: true
    victimCount?: true
    latitude?: true
    longitude?: true
  }

  export type CrimeIncidentSumAggregateInputType = {
    suspectCount?: true
    victimCount?: true
    latitude?: true
    longitude?: true
  }

  export type CrimeIncidentMinAggregateInputType = {
    id?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    incidentType?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    incidentTypeThreatGrp?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CrimeIncidentMaxAggregateInputType = {
    id?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    incidentType?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    incidentTypeThreatGrp?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CrimeIncidentCountAggregateInputType = {
    id?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    incidentType?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    incidentTypeThreatGrp?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CrimeIncidentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrimeIncident to aggregate.
     */
    where?: CrimeIncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrimeIncidents to fetch.
     */
    orderBy?: CrimeIncidentOrderByWithRelationInput | CrimeIncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrimeIncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrimeIncidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrimeIncidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrimeIncidents
    **/
    _count?: true | CrimeIncidentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CrimeIncidentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CrimeIncidentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrimeIncidentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrimeIncidentMaxAggregateInputType
  }

  export type GetCrimeIncidentAggregateType<T extends CrimeIncidentAggregateArgs> = {
        [P in keyof T & keyof AggregateCrimeIncident]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrimeIncident[P]>
      : GetScalarType<T[P], AggregateCrimeIncident[P]>
  }




  export type CrimeIncidentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrimeIncidentWhereInput
    orderBy?: CrimeIncidentOrderByWithAggregationInput | CrimeIncidentOrderByWithAggregationInput[]
    by: CrimeIncidentScalarFieldEnum[] | CrimeIncidentScalarFieldEnum
    having?: CrimeIncidentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrimeIncidentCountAggregateInputType | true
    _avg?: CrimeIncidentAvgAggregateInputType
    _sum?: CrimeIncidentSumAggregateInputType
    _min?: CrimeIncidentMinAggregateInputType
    _max?: CrimeIncidentMaxAggregateInputType
  }

  export type CrimeIncidentGroupByOutputType = {
    id: string
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string
    street: string | null
    typeOfPlace: string | null
    dateReported: Date
    timeReported: string
    dateCommitted: Date
    timeCommitted: string
    incidentType: string
    isCrime: boolean
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean
    sensational: boolean
    threatGrp: boolean
    grpAffiliation: string | null
    incidentTypeThreatGrp: string | null
    mrs: string | null
    suspectIsEGO: boolean
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date
    updatedAt: Date
    _count: CrimeIncidentCountAggregateOutputType | null
    _avg: CrimeIncidentAvgAggregateOutputType | null
    _sum: CrimeIncidentSumAggregateOutputType | null
    _min: CrimeIncidentMinAggregateOutputType | null
    _max: CrimeIncidentMaxAggregateOutputType | null
  }

  type GetCrimeIncidentGroupByPayload<T extends CrimeIncidentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrimeIncidentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrimeIncidentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrimeIncidentGroupByOutputType[P]>
            : GetScalarType<T[P], CrimeIncidentGroupByOutputType[P]>
        }
      >
    >


  export type CrimeIncidentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    incidentType?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    incidentTypeThreatGrp?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["crimeIncident"]>

  export type CrimeIncidentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    incidentType?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    incidentTypeThreatGrp?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["crimeIncident"]>

  export type CrimeIncidentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    incidentType?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    incidentTypeThreatGrp?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["crimeIncident"]>

  export type CrimeIncidentSelectScalar = {
    id?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    incidentType?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    incidentTypeThreatGrp?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CrimeIncidentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "blotterNo" | "dateEncoded" | "pro" | "ppo" | "stn" | "pcp" | "region" | "province" | "municipal" | "barangay" | "street" | "typeOfPlace" | "dateReported" | "timeReported" | "dateCommitted" | "timeCommitted" | "incidentType" | "isCrime" | "modeReporting" | "stageOfFelony" | "offense" | "offenseType" | "section" | "modus" | "suspectMotive" | "suspectSubMotive" | "heinous" | "sensational" | "threatGrp" | "grpAffiliation" | "incidentTypeThreatGrp" | "mrs" | "suspectIsEGO" | "suspectEGOPosition" | "suspectEGOClass" | "suspectCount" | "suspectArrested" | "victimIsEGO" | "victimEGOPosition" | "victimEGOClass" | "victimCount" | "caseStatus" | "investigator" | "headInves" | "latitude" | "longitude" | "createdAt" | "updatedAt", ExtArgs["result"]["crimeIncident"]>

  export type $CrimeIncidentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrimeIncident"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      blotterNo: string | null
      dateEncoded: Date | null
      pro: string | null
      ppo: string | null
      stn: string | null
      pcp: string | null
      region: string | null
      province: string | null
      municipal: string | null
      barangay: string
      street: string | null
      typeOfPlace: string | null
      dateReported: Date
      timeReported: string
      dateCommitted: Date
      timeCommitted: string
      incidentType: string
      isCrime: boolean
      modeReporting: string | null
      stageOfFelony: string | null
      offense: string | null
      offenseType: string | null
      section: string | null
      modus: string | null
      suspectMotive: string | null
      suspectSubMotive: string | null
      heinous: boolean
      sensational: boolean
      threatGrp: boolean
      grpAffiliation: string | null
      incidentTypeThreatGrp: string | null
      mrs: string | null
      suspectIsEGO: boolean
      suspectEGOPosition: string | null
      suspectEGOClass: string | null
      suspectCount: number | null
      suspectArrested: boolean | null
      victimIsEGO: boolean
      victimEGOPosition: string | null
      victimEGOClass: string | null
      victimCount: number | null
      caseStatus: string | null
      investigator: string | null
      headInves: string | null
      latitude: number | null
      longitude: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["crimeIncident"]>
    composites: {}
  }

  type CrimeIncidentGetPayload<S extends boolean | null | undefined | CrimeIncidentDefaultArgs> = $Result.GetResult<Prisma.$CrimeIncidentPayload, S>

  type CrimeIncidentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CrimeIncidentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CrimeIncidentCountAggregateInputType | true
    }

  export interface CrimeIncidentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrimeIncident'], meta: { name: 'CrimeIncident' } }
    /**
     * Find zero or one CrimeIncident that matches the filter.
     * @param {CrimeIncidentFindUniqueArgs} args - Arguments to find a CrimeIncident
     * @example
     * // Get one CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrimeIncidentFindUniqueArgs>(args: SelectSubset<T, CrimeIncidentFindUniqueArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CrimeIncident that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CrimeIncidentFindUniqueOrThrowArgs} args - Arguments to find a CrimeIncident
     * @example
     * // Get one CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrimeIncidentFindUniqueOrThrowArgs>(args: SelectSubset<T, CrimeIncidentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrimeIncident that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentFindFirstArgs} args - Arguments to find a CrimeIncident
     * @example
     * // Get one CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrimeIncidentFindFirstArgs>(args?: SelectSubset<T, CrimeIncidentFindFirstArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CrimeIncident that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentFindFirstOrThrowArgs} args - Arguments to find a CrimeIncident
     * @example
     * // Get one CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrimeIncidentFindFirstOrThrowArgs>(args?: SelectSubset<T, CrimeIncidentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CrimeIncidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrimeIncidents
     * const crimeIncidents = await prisma.crimeIncident.findMany()
     * 
     * // Get first 10 CrimeIncidents
     * const crimeIncidents = await prisma.crimeIncident.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crimeIncidentWithIdOnly = await prisma.crimeIncident.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrimeIncidentFindManyArgs>(args?: SelectSubset<T, CrimeIncidentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CrimeIncident.
     * @param {CrimeIncidentCreateArgs} args - Arguments to create a CrimeIncident.
     * @example
     * // Create one CrimeIncident
     * const CrimeIncident = await prisma.crimeIncident.create({
     *   data: {
     *     // ... data to create a CrimeIncident
     *   }
     * })
     * 
     */
    create<T extends CrimeIncidentCreateArgs>(args: SelectSubset<T, CrimeIncidentCreateArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CrimeIncidents.
     * @param {CrimeIncidentCreateManyArgs} args - Arguments to create many CrimeIncidents.
     * @example
     * // Create many CrimeIncidents
     * const crimeIncident = await prisma.crimeIncident.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrimeIncidentCreateManyArgs>(args?: SelectSubset<T, CrimeIncidentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrimeIncidents and returns the data saved in the database.
     * @param {CrimeIncidentCreateManyAndReturnArgs} args - Arguments to create many CrimeIncidents.
     * @example
     * // Create many CrimeIncidents
     * const crimeIncident = await prisma.crimeIncident.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrimeIncidents and only return the `id`
     * const crimeIncidentWithIdOnly = await prisma.crimeIncident.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrimeIncidentCreateManyAndReturnArgs>(args?: SelectSubset<T, CrimeIncidentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CrimeIncident.
     * @param {CrimeIncidentDeleteArgs} args - Arguments to delete one CrimeIncident.
     * @example
     * // Delete one CrimeIncident
     * const CrimeIncident = await prisma.crimeIncident.delete({
     *   where: {
     *     // ... filter to delete one CrimeIncident
     *   }
     * })
     * 
     */
    delete<T extends CrimeIncidentDeleteArgs>(args: SelectSubset<T, CrimeIncidentDeleteArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CrimeIncident.
     * @param {CrimeIncidentUpdateArgs} args - Arguments to update one CrimeIncident.
     * @example
     * // Update one CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrimeIncidentUpdateArgs>(args: SelectSubset<T, CrimeIncidentUpdateArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CrimeIncidents.
     * @param {CrimeIncidentDeleteManyArgs} args - Arguments to filter CrimeIncidents to delete.
     * @example
     * // Delete a few CrimeIncidents
     * const { count } = await prisma.crimeIncident.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrimeIncidentDeleteManyArgs>(args?: SelectSubset<T, CrimeIncidentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrimeIncidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrimeIncidents
     * const crimeIncident = await prisma.crimeIncident.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrimeIncidentUpdateManyArgs>(args: SelectSubset<T, CrimeIncidentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrimeIncidents and returns the data updated in the database.
     * @param {CrimeIncidentUpdateManyAndReturnArgs} args - Arguments to update many CrimeIncidents.
     * @example
     * // Update many CrimeIncidents
     * const crimeIncident = await prisma.crimeIncident.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CrimeIncidents and only return the `id`
     * const crimeIncidentWithIdOnly = await prisma.crimeIncident.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CrimeIncidentUpdateManyAndReturnArgs>(args: SelectSubset<T, CrimeIncidentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CrimeIncident.
     * @param {CrimeIncidentUpsertArgs} args - Arguments to update or create a CrimeIncident.
     * @example
     * // Update or create a CrimeIncident
     * const crimeIncident = await prisma.crimeIncident.upsert({
     *   create: {
     *     // ... data to create a CrimeIncident
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrimeIncident we want to update
     *   }
     * })
     */
    upsert<T extends CrimeIncidentUpsertArgs>(args: SelectSubset<T, CrimeIncidentUpsertArgs<ExtArgs>>): Prisma__CrimeIncidentClient<$Result.GetResult<Prisma.$CrimeIncidentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CrimeIncidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentCountArgs} args - Arguments to filter CrimeIncidents to count.
     * @example
     * // Count the number of CrimeIncidents
     * const count = await prisma.crimeIncident.count({
     *   where: {
     *     // ... the filter for the CrimeIncidents we want to count
     *   }
     * })
    **/
    count<T extends CrimeIncidentCountArgs>(
      args?: Subset<T, CrimeIncidentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrimeIncidentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrimeIncident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CrimeIncidentAggregateArgs>(args: Subset<T, CrimeIncidentAggregateArgs>): Prisma.PrismaPromise<GetCrimeIncidentAggregateType<T>>

    /**
     * Group by CrimeIncident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrimeIncidentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CrimeIncidentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrimeIncidentGroupByArgs['orderBy'] }
        : { orderBy?: CrimeIncidentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CrimeIncidentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrimeIncidentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrimeIncident model
   */
  readonly fields: CrimeIncidentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrimeIncident.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrimeIncidentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CrimeIncident model
   */
  interface CrimeIncidentFieldRefs {
    readonly id: FieldRef<"CrimeIncident", 'String'>
    readonly blotterNo: FieldRef<"CrimeIncident", 'String'>
    readonly dateEncoded: FieldRef<"CrimeIncident", 'DateTime'>
    readonly pro: FieldRef<"CrimeIncident", 'String'>
    readonly ppo: FieldRef<"CrimeIncident", 'String'>
    readonly stn: FieldRef<"CrimeIncident", 'String'>
    readonly pcp: FieldRef<"CrimeIncident", 'String'>
    readonly region: FieldRef<"CrimeIncident", 'String'>
    readonly province: FieldRef<"CrimeIncident", 'String'>
    readonly municipal: FieldRef<"CrimeIncident", 'String'>
    readonly barangay: FieldRef<"CrimeIncident", 'String'>
    readonly street: FieldRef<"CrimeIncident", 'String'>
    readonly typeOfPlace: FieldRef<"CrimeIncident", 'String'>
    readonly dateReported: FieldRef<"CrimeIncident", 'DateTime'>
    readonly timeReported: FieldRef<"CrimeIncident", 'String'>
    readonly dateCommitted: FieldRef<"CrimeIncident", 'DateTime'>
    readonly timeCommitted: FieldRef<"CrimeIncident", 'String'>
    readonly incidentType: FieldRef<"CrimeIncident", 'String'>
    readonly isCrime: FieldRef<"CrimeIncident", 'Boolean'>
    readonly modeReporting: FieldRef<"CrimeIncident", 'String'>
    readonly stageOfFelony: FieldRef<"CrimeIncident", 'String'>
    readonly offense: FieldRef<"CrimeIncident", 'String'>
    readonly offenseType: FieldRef<"CrimeIncident", 'String'>
    readonly section: FieldRef<"CrimeIncident", 'String'>
    readonly modus: FieldRef<"CrimeIncident", 'String'>
    readonly suspectMotive: FieldRef<"CrimeIncident", 'String'>
    readonly suspectSubMotive: FieldRef<"CrimeIncident", 'String'>
    readonly heinous: FieldRef<"CrimeIncident", 'Boolean'>
    readonly sensational: FieldRef<"CrimeIncident", 'Boolean'>
    readonly threatGrp: FieldRef<"CrimeIncident", 'Boolean'>
    readonly grpAffiliation: FieldRef<"CrimeIncident", 'String'>
    readonly incidentTypeThreatGrp: FieldRef<"CrimeIncident", 'String'>
    readonly mrs: FieldRef<"CrimeIncident", 'String'>
    readonly suspectIsEGO: FieldRef<"CrimeIncident", 'Boolean'>
    readonly suspectEGOPosition: FieldRef<"CrimeIncident", 'String'>
    readonly suspectEGOClass: FieldRef<"CrimeIncident", 'String'>
    readonly suspectCount: FieldRef<"CrimeIncident", 'Int'>
    readonly suspectArrested: FieldRef<"CrimeIncident", 'Boolean'>
    readonly victimIsEGO: FieldRef<"CrimeIncident", 'Boolean'>
    readonly victimEGOPosition: FieldRef<"CrimeIncident", 'String'>
    readonly victimEGOClass: FieldRef<"CrimeIncident", 'String'>
    readonly victimCount: FieldRef<"CrimeIncident", 'Int'>
    readonly caseStatus: FieldRef<"CrimeIncident", 'String'>
    readonly investigator: FieldRef<"CrimeIncident", 'String'>
    readonly headInves: FieldRef<"CrimeIncident", 'String'>
    readonly latitude: FieldRef<"CrimeIncident", 'Float'>
    readonly longitude: FieldRef<"CrimeIncident", 'Float'>
    readonly createdAt: FieldRef<"CrimeIncident", 'DateTime'>
    readonly updatedAt: FieldRef<"CrimeIncident", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CrimeIncident findUnique
   */
  export type CrimeIncidentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter, which CrimeIncident to fetch.
     */
    where: CrimeIncidentWhereUniqueInput
  }

  /**
   * CrimeIncident findUniqueOrThrow
   */
  export type CrimeIncidentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter, which CrimeIncident to fetch.
     */
    where: CrimeIncidentWhereUniqueInput
  }

  /**
   * CrimeIncident findFirst
   */
  export type CrimeIncidentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter, which CrimeIncident to fetch.
     */
    where?: CrimeIncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrimeIncidents to fetch.
     */
    orderBy?: CrimeIncidentOrderByWithRelationInput | CrimeIncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrimeIncidents.
     */
    cursor?: CrimeIncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrimeIncidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrimeIncidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrimeIncidents.
     */
    distinct?: CrimeIncidentScalarFieldEnum | CrimeIncidentScalarFieldEnum[]
  }

  /**
   * CrimeIncident findFirstOrThrow
   */
  export type CrimeIncidentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter, which CrimeIncident to fetch.
     */
    where?: CrimeIncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrimeIncidents to fetch.
     */
    orderBy?: CrimeIncidentOrderByWithRelationInput | CrimeIncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrimeIncidents.
     */
    cursor?: CrimeIncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrimeIncidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrimeIncidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrimeIncidents.
     */
    distinct?: CrimeIncidentScalarFieldEnum | CrimeIncidentScalarFieldEnum[]
  }

  /**
   * CrimeIncident findMany
   */
  export type CrimeIncidentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter, which CrimeIncidents to fetch.
     */
    where?: CrimeIncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrimeIncidents to fetch.
     */
    orderBy?: CrimeIncidentOrderByWithRelationInput | CrimeIncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrimeIncidents.
     */
    cursor?: CrimeIncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrimeIncidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrimeIncidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrimeIncidents.
     */
    distinct?: CrimeIncidentScalarFieldEnum | CrimeIncidentScalarFieldEnum[]
  }

  /**
   * CrimeIncident create
   */
  export type CrimeIncidentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * The data needed to create a CrimeIncident.
     */
    data: XOR<CrimeIncidentCreateInput, CrimeIncidentUncheckedCreateInput>
  }

  /**
   * CrimeIncident createMany
   */
  export type CrimeIncidentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrimeIncidents.
     */
    data: CrimeIncidentCreateManyInput | CrimeIncidentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrimeIncident createManyAndReturn
   */
  export type CrimeIncidentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * The data used to create many CrimeIncidents.
     */
    data: CrimeIncidentCreateManyInput | CrimeIncidentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrimeIncident update
   */
  export type CrimeIncidentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * The data needed to update a CrimeIncident.
     */
    data: XOR<CrimeIncidentUpdateInput, CrimeIncidentUncheckedUpdateInput>
    /**
     * Choose, which CrimeIncident to update.
     */
    where: CrimeIncidentWhereUniqueInput
  }

  /**
   * CrimeIncident updateMany
   */
  export type CrimeIncidentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrimeIncidents.
     */
    data: XOR<CrimeIncidentUpdateManyMutationInput, CrimeIncidentUncheckedUpdateManyInput>
    /**
     * Filter which CrimeIncidents to update
     */
    where?: CrimeIncidentWhereInput
    /**
     * Limit how many CrimeIncidents to update.
     */
    limit?: number
  }

  /**
   * CrimeIncident updateManyAndReturn
   */
  export type CrimeIncidentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * The data used to update CrimeIncidents.
     */
    data: XOR<CrimeIncidentUpdateManyMutationInput, CrimeIncidentUncheckedUpdateManyInput>
    /**
     * Filter which CrimeIncidents to update
     */
    where?: CrimeIncidentWhereInput
    /**
     * Limit how many CrimeIncidents to update.
     */
    limit?: number
  }

  /**
   * CrimeIncident upsert
   */
  export type CrimeIncidentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * The filter to search for the CrimeIncident to update in case it exists.
     */
    where: CrimeIncidentWhereUniqueInput
    /**
     * In case the CrimeIncident found by the `where` argument doesn't exist, create a new CrimeIncident with this data.
     */
    create: XOR<CrimeIncidentCreateInput, CrimeIncidentUncheckedCreateInput>
    /**
     * In case the CrimeIncident was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrimeIncidentUpdateInput, CrimeIncidentUncheckedUpdateInput>
  }

  /**
   * CrimeIncident delete
   */
  export type CrimeIncidentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
    /**
     * Filter which CrimeIncident to delete.
     */
    where: CrimeIncidentWhereUniqueInput
  }

  /**
   * CrimeIncident deleteMany
   */
  export type CrimeIncidentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrimeIncidents to delete
     */
    where?: CrimeIncidentWhereInput
    /**
     * Limit how many CrimeIncidents to delete.
     */
    limit?: number
  }

  /**
   * CrimeIncident without action
   */
  export type CrimeIncidentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrimeIncident
     */
    select?: CrimeIncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CrimeIncident
     */
    omit?: CrimeIncidentOmit<ExtArgs> | null
  }


  /**
   * Model Barangay
   */

  export type AggregateBarangay = {
    _count: BarangayCountAggregateOutputType | null
    _avg: BarangayAvgAggregateOutputType | null
    _sum: BarangaySumAggregateOutputType | null
    _min: BarangayMinAggregateOutputType | null
    _max: BarangayMaxAggregateOutputType | null
  }

  export type BarangayAvgAggregateOutputType = {
    population: number | null
    area: number | null
  }

  export type BarangaySumAggregateOutputType = {
    population: number | null
    area: number | null
  }

  export type BarangayMinAggregateOutputType = {
    id: string | null
    name: string | null
    population: number | null
    area: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BarangayMaxAggregateOutputType = {
    id: string | null
    name: string | null
    population: number | null
    area: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BarangayCountAggregateOutputType = {
    id: number
    name: number
    coordinates: number
    population: number
    area: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BarangayAvgAggregateInputType = {
    population?: true
    area?: true
  }

  export type BarangaySumAggregateInputType = {
    population?: true
    area?: true
  }

  export type BarangayMinAggregateInputType = {
    id?: true
    name?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BarangayMaxAggregateInputType = {
    id?: true
    name?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BarangayCountAggregateInputType = {
    id?: true
    name?: true
    coordinates?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BarangayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barangay to aggregate.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Barangays
    **/
    _count?: true | BarangayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BarangayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BarangaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BarangayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BarangayMaxAggregateInputType
  }

  export type GetBarangayAggregateType<T extends BarangayAggregateArgs> = {
        [P in keyof T & keyof AggregateBarangay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBarangay[P]>
      : GetScalarType<T[P], AggregateBarangay[P]>
  }




  export type BarangayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BarangayWhereInput
    orderBy?: BarangayOrderByWithAggregationInput | BarangayOrderByWithAggregationInput[]
    by: BarangayScalarFieldEnum[] | BarangayScalarFieldEnum
    having?: BarangayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BarangayCountAggregateInputType | true
    _avg?: BarangayAvgAggregateInputType
    _sum?: BarangaySumAggregateInputType
    _min?: BarangayMinAggregateInputType
    _max?: BarangayMaxAggregateInputType
  }

  export type BarangayGroupByOutputType = {
    id: string
    name: string
    coordinates: JsonValue | null
    population: number | null
    area: number | null
    createdAt: Date
    updatedAt: Date
    _count: BarangayCountAggregateOutputType | null
    _avg: BarangayAvgAggregateOutputType | null
    _sum: BarangaySumAggregateOutputType | null
    _min: BarangayMinAggregateOutputType | null
    _max: BarangayMaxAggregateOutputType | null
  }

  type GetBarangayGroupByPayload<T extends BarangayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BarangayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BarangayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BarangayGroupByOutputType[P]>
            : GetScalarType<T[P], BarangayGroupByOutputType[P]>
        }
      >
    >


  export type BarangaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectScalar = {
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BarangayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "coordinates" | "population" | "area" | "createdAt" | "updatedAt", ExtArgs["result"]["barangay"]>

  export type $BarangayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Barangay"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      coordinates: Prisma.JsonValue | null
      population: number | null
      area: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["barangay"]>
    composites: {}
  }

  type BarangayGetPayload<S extends boolean | null | undefined | BarangayDefaultArgs> = $Result.GetResult<Prisma.$BarangayPayload, S>

  type BarangayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BarangayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BarangayCountAggregateInputType | true
    }

  export interface BarangayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Barangay'], meta: { name: 'Barangay' } }
    /**
     * Find zero or one Barangay that matches the filter.
     * @param {BarangayFindUniqueArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BarangayFindUniqueArgs>(args: SelectSubset<T, BarangayFindUniqueArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Barangay that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BarangayFindUniqueOrThrowArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BarangayFindUniqueOrThrowArgs>(args: SelectSubset<T, BarangayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Barangay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindFirstArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BarangayFindFirstArgs>(args?: SelectSubset<T, BarangayFindFirstArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Barangay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindFirstOrThrowArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BarangayFindFirstOrThrowArgs>(args?: SelectSubset<T, BarangayFindFirstOrThrowArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Barangays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Barangays
     * const barangays = await prisma.barangay.findMany()
     * 
     * // Get first 10 Barangays
     * const barangays = await prisma.barangay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const barangayWithIdOnly = await prisma.barangay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BarangayFindManyArgs>(args?: SelectSubset<T, BarangayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Barangay.
     * @param {BarangayCreateArgs} args - Arguments to create a Barangay.
     * @example
     * // Create one Barangay
     * const Barangay = await prisma.barangay.create({
     *   data: {
     *     // ... data to create a Barangay
     *   }
     * })
     * 
     */
    create<T extends BarangayCreateArgs>(args: SelectSubset<T, BarangayCreateArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Barangays.
     * @param {BarangayCreateManyArgs} args - Arguments to create many Barangays.
     * @example
     * // Create many Barangays
     * const barangay = await prisma.barangay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BarangayCreateManyArgs>(args?: SelectSubset<T, BarangayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Barangays and returns the data saved in the database.
     * @param {BarangayCreateManyAndReturnArgs} args - Arguments to create many Barangays.
     * @example
     * // Create many Barangays
     * const barangay = await prisma.barangay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Barangays and only return the `id`
     * const barangayWithIdOnly = await prisma.barangay.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BarangayCreateManyAndReturnArgs>(args?: SelectSubset<T, BarangayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Barangay.
     * @param {BarangayDeleteArgs} args - Arguments to delete one Barangay.
     * @example
     * // Delete one Barangay
     * const Barangay = await prisma.barangay.delete({
     *   where: {
     *     // ... filter to delete one Barangay
     *   }
     * })
     * 
     */
    delete<T extends BarangayDeleteArgs>(args: SelectSubset<T, BarangayDeleteArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Barangay.
     * @param {BarangayUpdateArgs} args - Arguments to update one Barangay.
     * @example
     * // Update one Barangay
     * const barangay = await prisma.barangay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BarangayUpdateArgs>(args: SelectSubset<T, BarangayUpdateArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Barangays.
     * @param {BarangayDeleteManyArgs} args - Arguments to filter Barangays to delete.
     * @example
     * // Delete a few Barangays
     * const { count } = await prisma.barangay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BarangayDeleteManyArgs>(args?: SelectSubset<T, BarangayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Barangays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Barangays
     * const barangay = await prisma.barangay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BarangayUpdateManyArgs>(args: SelectSubset<T, BarangayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Barangays and returns the data updated in the database.
     * @param {BarangayUpdateManyAndReturnArgs} args - Arguments to update many Barangays.
     * @example
     * // Update many Barangays
     * const barangay = await prisma.barangay.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Barangays and only return the `id`
     * const barangayWithIdOnly = await prisma.barangay.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BarangayUpdateManyAndReturnArgs>(args: SelectSubset<T, BarangayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Barangay.
     * @param {BarangayUpsertArgs} args - Arguments to update or create a Barangay.
     * @example
     * // Update or create a Barangay
     * const barangay = await prisma.barangay.upsert({
     *   create: {
     *     // ... data to create a Barangay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Barangay we want to update
     *   }
     * })
     */
    upsert<T extends BarangayUpsertArgs>(args: SelectSubset<T, BarangayUpsertArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Barangays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayCountArgs} args - Arguments to filter Barangays to count.
     * @example
     * // Count the number of Barangays
     * const count = await prisma.barangay.count({
     *   where: {
     *     // ... the filter for the Barangays we want to count
     *   }
     * })
    **/
    count<T extends BarangayCountArgs>(
      args?: Subset<T, BarangayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BarangayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Barangay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BarangayAggregateArgs>(args: Subset<T, BarangayAggregateArgs>): Prisma.PrismaPromise<GetBarangayAggregateType<T>>

    /**
     * Group by Barangay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BarangayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BarangayGroupByArgs['orderBy'] }
        : { orderBy?: BarangayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BarangayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBarangayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Barangay model
   */
  readonly fields: BarangayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Barangay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BarangayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Barangay model
   */
  interface BarangayFieldRefs {
    readonly id: FieldRef<"Barangay", 'String'>
    readonly name: FieldRef<"Barangay", 'String'>
    readonly coordinates: FieldRef<"Barangay", 'Json'>
    readonly population: FieldRef<"Barangay", 'Int'>
    readonly area: FieldRef<"Barangay", 'Float'>
    readonly createdAt: FieldRef<"Barangay", 'DateTime'>
    readonly updatedAt: FieldRef<"Barangay", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Barangay findUnique
   */
  export type BarangayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where: BarangayWhereUniqueInput
  }

  /**
   * Barangay findUniqueOrThrow
   */
  export type BarangayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where: BarangayWhereUniqueInput
  }

  /**
   * Barangay findFirst
   */
  export type BarangayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
  }

  /**
   * Barangay findFirstOrThrow
   */
  export type BarangayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
  }

  /**
   * Barangay findMany
   */
  export type BarangayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangays to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
  }

  /**
   * Barangay create
   */
  export type BarangayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data needed to create a Barangay.
     */
    data: XOR<BarangayCreateInput, BarangayUncheckedCreateInput>
  }

  /**
   * Barangay createMany
   */
  export type BarangayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Barangays.
     */
    data: BarangayCreateManyInput | BarangayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Barangay createManyAndReturn
   */
  export type BarangayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data used to create many Barangays.
     */
    data: BarangayCreateManyInput | BarangayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Barangay update
   */
  export type BarangayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data needed to update a Barangay.
     */
    data: XOR<BarangayUpdateInput, BarangayUncheckedUpdateInput>
    /**
     * Choose, which Barangay to update.
     */
    where: BarangayWhereUniqueInput
  }

  /**
   * Barangay updateMany
   */
  export type BarangayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Barangays.
     */
    data: XOR<BarangayUpdateManyMutationInput, BarangayUncheckedUpdateManyInput>
    /**
     * Filter which Barangays to update
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to update.
     */
    limit?: number
  }

  /**
   * Barangay updateManyAndReturn
   */
  export type BarangayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data used to update Barangays.
     */
    data: XOR<BarangayUpdateManyMutationInput, BarangayUncheckedUpdateManyInput>
    /**
     * Filter which Barangays to update
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to update.
     */
    limit?: number
  }

  /**
   * Barangay upsert
   */
  export type BarangayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The filter to search for the Barangay to update in case it exists.
     */
    where: BarangayWhereUniqueInput
    /**
     * In case the Barangay found by the `where` argument doesn't exist, create a new Barangay with this data.
     */
    create: XOR<BarangayCreateInput, BarangayUncheckedCreateInput>
    /**
     * In case the Barangay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BarangayUpdateInput, BarangayUncheckedUpdateInput>
  }

  /**
   * Barangay delete
   */
  export type BarangayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter which Barangay to delete.
     */
    where: BarangayWhereUniqueInput
  }

  /**
   * Barangay deleteMany
   */
  export type BarangayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barangays to delete
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to delete.
     */
    limit?: number
  }

  /**
   * Barangay without action
   */
  export type BarangayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date | null
    ip: string | null
    session: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date | null
    ip: string | null
    session: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    action: number
    details: number
    user: number
    createdAt: number
    ip: number
    session: number
    resource: number
    severity: number
    outcome: number
    fileName: number
    fileSize: number
    recordsImported: number
    errorMessage: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type AuditLogSumAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date
    ip: string | null
    session: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
    notifications?: boolean | AuditLog$notificationsArgs<ExtArgs>
    _count?: boolean | AuditLogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "details" | "user" | "createdAt" | "ip" | "session" | "resource" | "severity" | "outcome" | "fileName" | "fileSize" | "recordsImported" | "errorMessage", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | AuditLog$notificationsArgs<ExtArgs>
    _count?: boolean | AuditLogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string | null
      details: string | null
      user: string | null
      createdAt: Date
      ip: string | null
      session: string | null
      resource: string | null
      severity: string | null
      outcome: string | null
      fileName: string | null
      fileSize: number | null
      recordsImported: number | null
      errorMessage: string | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notifications<T extends AuditLog$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly user: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
    readonly ip: FieldRef<"AuditLog", 'String'>
    readonly session: FieldRef<"AuditLog", 'String'>
    readonly resource: FieldRef<"AuditLog", 'String'>
    readonly severity: FieldRef<"AuditLog", 'String'>
    readonly outcome: FieldRef<"AuditLog", 'String'>
    readonly fileName: FieldRef<"AuditLog", 'String'>
    readonly fileSize: FieldRef<"AuditLog", 'Int'>
    readonly recordsImported: FieldRef<"AuditLog", 'Int'>
    readonly errorMessage: FieldRef<"AuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data?: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.notifications
   */
  export type AuditLog$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    title: string | null
    message: string | null
    category: $Enums.NotificationCategory | null
    severity: $Enums.NotificationSeverity | null
    uploadLogId: string | null
    isRead: boolean | null
    readAt: Date | null
    isArchived: boolean | null
    archivedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    title: string | null
    message: string | null
    category: $Enums.NotificationCategory | null
    severity: $Enums.NotificationSeverity | null
    uploadLogId: string | null
    isRead: boolean | null
    readAt: Date | null
    isArchived: boolean | null
    archivedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    title: number
    message: number
    category: number
    severity: number
    uploadLogId: number
    metadata: number
    isRead: number
    readAt: number
    isArchived: number
    archivedAt: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    title?: true
    message?: true
    category?: true
    severity?: true
    uploadLogId?: true
    isRead?: true
    readAt?: true
    isArchived?: true
    archivedAt?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    title?: true
    message?: true
    category?: true
    severity?: true
    uploadLogId?: true
    isRead?: true
    readAt?: true
    isArchived?: true
    archivedAt?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    title?: true
    message?: true
    category?: true
    severity?: true
    uploadLogId?: true
    metadata?: true
    isRead?: true
    readAt?: true
    isArchived?: true
    archivedAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity: $Enums.NotificationSeverity
    uploadLogId: string | null
    metadata: JsonValue | null
    isRead: boolean
    readAt: Date | null
    isArchived: boolean
    archivedAt: Date | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    category?: boolean
    severity?: boolean
    uploadLogId?: boolean
    metadata?: boolean
    isRead?: boolean
    readAt?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    createdAt?: boolean
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    category?: boolean
    severity?: boolean
    uploadLogId?: boolean
    metadata?: boolean
    isRead?: boolean
    readAt?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    createdAt?: boolean
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    category?: boolean
    severity?: boolean
    uploadLogId?: boolean
    metadata?: boolean
    isRead?: boolean
    readAt?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    createdAt?: boolean
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    title?: boolean
    message?: boolean
    category?: boolean
    severity?: boolean
    uploadLogId?: boolean
    metadata?: boolean
    isRead?: boolean
    readAt?: boolean
    isArchived?: boolean
    archivedAt?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "message" | "category" | "severity" | "uploadLogId" | "metadata" | "isRead" | "readAt" | "isArchived" | "archivedAt" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    uploadLog?: boolean | Notification$uploadLogArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      uploadLog: Prisma.$AuditLogPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      message: string
      category: $Enums.NotificationCategory
      severity: $Enums.NotificationSeverity
      uploadLogId: string | null
      metadata: Prisma.JsonValue | null
      isRead: boolean
      readAt: Date | null
      isArchived: boolean
      archivedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    uploadLog<T extends Notification$uploadLogArgs<ExtArgs> = {}>(args?: Subset<T, Notification$uploadLogArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly category: FieldRef<"Notification", 'NotificationCategory'>
    readonly severity: FieldRef<"Notification", 'NotificationSeverity'>
    readonly uploadLogId: FieldRef<"Notification", 'String'>
    readonly metadata: FieldRef<"Notification", 'Json'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly readAt: FieldRef<"Notification", 'DateTime'>
    readonly isArchived: FieldRef<"Notification", 'Boolean'>
    readonly archivedAt: FieldRef<"Notification", 'DateTime'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.uploadLog
   */
  export type Notification$uploadLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model NotificationRule
   */

  export type AggregateNotificationRule = {
    _count: NotificationRuleCountAggregateOutputType | null
    _avg: NotificationRuleAvgAggregateOutputType | null
    _sum: NotificationRuleSumAggregateOutputType | null
    _min: NotificationRuleMinAggregateOutputType | null
    _max: NotificationRuleMaxAggregateOutputType | null
  }

  export type NotificationRuleAvgAggregateOutputType = {
    updatedBy: number | null
  }

  export type NotificationRuleSumAggregateOutputType = {
    updatedBy: number | null
  }

  export type NotificationRuleMinAggregateOutputType = {
    id: string | null
    ruleKey: string | null
    name: string | null
    description: string | null
    category: $Enums.NotificationCategory | null
    conditionType: $Enums.RuleConditionType | null
    severity: $Enums.NotificationSeverity | null
    isEnabled: boolean | null
    updatedBy: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationRuleMaxAggregateOutputType = {
    id: string | null
    ruleKey: string | null
    name: string | null
    description: string | null
    category: $Enums.NotificationCategory | null
    conditionType: $Enums.RuleConditionType | null
    severity: $Enums.NotificationSeverity | null
    isEnabled: boolean | null
    updatedBy: number | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type NotificationRuleCountAggregateOutputType = {
    id: number
    ruleKey: number
    name: number
    description: number
    category: number
    conditionType: number
    parameters: number
    severity: number
    isEnabled: number
    updatedBy: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type NotificationRuleAvgAggregateInputType = {
    updatedBy?: true
  }

  export type NotificationRuleSumAggregateInputType = {
    updatedBy?: true
  }

  export type NotificationRuleMinAggregateInputType = {
    id?: true
    ruleKey?: true
    name?: true
    description?: true
    category?: true
    conditionType?: true
    severity?: true
    isEnabled?: true
    updatedBy?: true
    updatedAt?: true
    createdAt?: true
  }

  export type NotificationRuleMaxAggregateInputType = {
    id?: true
    ruleKey?: true
    name?: true
    description?: true
    category?: true
    conditionType?: true
    severity?: true
    isEnabled?: true
    updatedBy?: true
    updatedAt?: true
    createdAt?: true
  }

  export type NotificationRuleCountAggregateInputType = {
    id?: true
    ruleKey?: true
    name?: true
    description?: true
    category?: true
    conditionType?: true
    parameters?: true
    severity?: true
    isEnabled?: true
    updatedBy?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationRule to aggregate.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationRules
    **/
    _count?: true | NotificationRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationRuleMaxAggregateInputType
  }

  export type GetNotificationRuleAggregateType<T extends NotificationRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationRule[P]>
      : GetScalarType<T[P], AggregateNotificationRule[P]>
  }




  export type NotificationRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationRuleWhereInput
    orderBy?: NotificationRuleOrderByWithAggregationInput | NotificationRuleOrderByWithAggregationInput[]
    by: NotificationRuleScalarFieldEnum[] | NotificationRuleScalarFieldEnum
    having?: NotificationRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationRuleCountAggregateInputType | true
    _avg?: NotificationRuleAvgAggregateInputType
    _sum?: NotificationRuleSumAggregateInputType
    _min?: NotificationRuleMinAggregateInputType
    _max?: NotificationRuleMaxAggregateInputType
  }

  export type NotificationRuleGroupByOutputType = {
    id: string
    ruleKey: string
    name: string
    description: string | null
    category: $Enums.NotificationCategory
    conditionType: $Enums.RuleConditionType
    parameters: JsonValue
    severity: $Enums.NotificationSeverity
    isEnabled: boolean
    updatedBy: number | null
    updatedAt: Date
    createdAt: Date
    _count: NotificationRuleCountAggregateOutputType | null
    _avg: NotificationRuleAvgAggregateOutputType | null
    _sum: NotificationRuleSumAggregateOutputType | null
    _min: NotificationRuleMinAggregateOutputType | null
    _max: NotificationRuleMaxAggregateOutputType | null
  }

  type GetNotificationRuleGroupByPayload<T extends NotificationRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationRuleGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationRuleGroupByOutputType[P]>
        }
      >
    >


  export type NotificationRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ruleKey?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    conditionType?: boolean
    parameters?: boolean
    severity?: boolean
    isEnabled?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ruleKey?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    conditionType?: boolean
    parameters?: boolean
    severity?: boolean
    isEnabled?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ruleKey?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    conditionType?: boolean
    parameters?: boolean
    severity?: boolean
    isEnabled?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notificationRule"]>

  export type NotificationRuleSelectScalar = {
    id?: boolean
    ruleKey?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    conditionType?: boolean
    parameters?: boolean
    severity?: boolean
    isEnabled?: boolean
    updatedBy?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type NotificationRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ruleKey" | "name" | "description" | "category" | "conditionType" | "parameters" | "severity" | "isEnabled" | "updatedBy" | "updatedAt" | "createdAt", ExtArgs["result"]["notificationRule"]>

  export type $NotificationRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ruleKey: string
      name: string
      description: string | null
      category: $Enums.NotificationCategory
      conditionType: $Enums.RuleConditionType
      parameters: Prisma.JsonValue
      severity: $Enums.NotificationSeverity
      isEnabled: boolean
      updatedBy: number | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["notificationRule"]>
    composites: {}
  }

  type NotificationRuleGetPayload<S extends boolean | null | undefined | NotificationRuleDefaultArgs> = $Result.GetResult<Prisma.$NotificationRulePayload, S>

  type NotificationRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationRuleCountAggregateInputType | true
    }

  export interface NotificationRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationRule'], meta: { name: 'NotificationRule' } }
    /**
     * Find zero or one NotificationRule that matches the filter.
     * @param {NotificationRuleFindUniqueArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationRuleFindUniqueArgs>(args: SelectSubset<T, NotificationRuleFindUniqueArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NotificationRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationRuleFindUniqueOrThrowArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindFirstArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationRuleFindFirstArgs>(args?: SelectSubset<T, NotificationRuleFindFirstArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindFirstOrThrowArgs} args - Arguments to find a NotificationRule
     * @example
     * // Get one NotificationRule
     * const notificationRule = await prisma.notificationRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NotificationRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationRules
     * const notificationRules = await prisma.notificationRule.findMany()
     * 
     * // Get first 10 NotificationRules
     * const notificationRules = await prisma.notificationRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationRuleFindManyArgs>(args?: SelectSubset<T, NotificationRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NotificationRule.
     * @param {NotificationRuleCreateArgs} args - Arguments to create a NotificationRule.
     * @example
     * // Create one NotificationRule
     * const NotificationRule = await prisma.notificationRule.create({
     *   data: {
     *     // ... data to create a NotificationRule
     *   }
     * })
     * 
     */
    create<T extends NotificationRuleCreateArgs>(args: SelectSubset<T, NotificationRuleCreateArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NotificationRules.
     * @param {NotificationRuleCreateManyArgs} args - Arguments to create many NotificationRules.
     * @example
     * // Create many NotificationRules
     * const notificationRule = await prisma.notificationRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationRuleCreateManyArgs>(args?: SelectSubset<T, NotificationRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationRules and returns the data saved in the database.
     * @param {NotificationRuleCreateManyAndReturnArgs} args - Arguments to create many NotificationRules.
     * @example
     * // Create many NotificationRules
     * const notificationRule = await prisma.notificationRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationRules and only return the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NotificationRule.
     * @param {NotificationRuleDeleteArgs} args - Arguments to delete one NotificationRule.
     * @example
     * // Delete one NotificationRule
     * const NotificationRule = await prisma.notificationRule.delete({
     *   where: {
     *     // ... filter to delete one NotificationRule
     *   }
     * })
     * 
     */
    delete<T extends NotificationRuleDeleteArgs>(args: SelectSubset<T, NotificationRuleDeleteArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NotificationRule.
     * @param {NotificationRuleUpdateArgs} args - Arguments to update one NotificationRule.
     * @example
     * // Update one NotificationRule
     * const notificationRule = await prisma.notificationRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationRuleUpdateArgs>(args: SelectSubset<T, NotificationRuleUpdateArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NotificationRules.
     * @param {NotificationRuleDeleteManyArgs} args - Arguments to filter NotificationRules to delete.
     * @example
     * // Delete a few NotificationRules
     * const { count } = await prisma.notificationRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationRuleDeleteManyArgs>(args?: SelectSubset<T, NotificationRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationRules
     * const notificationRule = await prisma.notificationRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationRuleUpdateManyArgs>(args: SelectSubset<T, NotificationRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationRules and returns the data updated in the database.
     * @param {NotificationRuleUpdateManyAndReturnArgs} args - Arguments to update many NotificationRules.
     * @example
     * // Update many NotificationRules
     * const notificationRule = await prisma.notificationRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NotificationRules and only return the `id`
     * const notificationRuleWithIdOnly = await prisma.notificationRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NotificationRule.
     * @param {NotificationRuleUpsertArgs} args - Arguments to update or create a NotificationRule.
     * @example
     * // Update or create a NotificationRule
     * const notificationRule = await prisma.notificationRule.upsert({
     *   create: {
     *     // ... data to create a NotificationRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationRule we want to update
     *   }
     * })
     */
    upsert<T extends NotificationRuleUpsertArgs>(args: SelectSubset<T, NotificationRuleUpsertArgs<ExtArgs>>): Prisma__NotificationRuleClient<$Result.GetResult<Prisma.$NotificationRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NotificationRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleCountArgs} args - Arguments to filter NotificationRules to count.
     * @example
     * // Count the number of NotificationRules
     * const count = await prisma.notificationRule.count({
     *   where: {
     *     // ... the filter for the NotificationRules we want to count
     *   }
     * })
    **/
    count<T extends NotificationRuleCountArgs>(
      args?: Subset<T, NotificationRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationRuleAggregateArgs>(args: Subset<T, NotificationRuleAggregateArgs>): Prisma.PrismaPromise<GetNotificationRuleAggregateType<T>>

    /**
     * Group by NotificationRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationRuleGroupByArgs['orderBy'] }
        : { orderBy?: NotificationRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationRule model
   */
  readonly fields: NotificationRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationRule model
   */
  interface NotificationRuleFieldRefs {
    readonly id: FieldRef<"NotificationRule", 'String'>
    readonly ruleKey: FieldRef<"NotificationRule", 'String'>
    readonly name: FieldRef<"NotificationRule", 'String'>
    readonly description: FieldRef<"NotificationRule", 'String'>
    readonly category: FieldRef<"NotificationRule", 'NotificationCategory'>
    readonly conditionType: FieldRef<"NotificationRule", 'RuleConditionType'>
    readonly parameters: FieldRef<"NotificationRule", 'Json'>
    readonly severity: FieldRef<"NotificationRule", 'NotificationSeverity'>
    readonly isEnabled: FieldRef<"NotificationRule", 'Boolean'>
    readonly updatedBy: FieldRef<"NotificationRule", 'Int'>
    readonly updatedAt: FieldRef<"NotificationRule", 'DateTime'>
    readonly createdAt: FieldRef<"NotificationRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationRule findUnique
   */
  export type NotificationRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule findUniqueOrThrow
   */
  export type NotificationRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule findFirst
   */
  export type NotificationRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationRules.
     */
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule findFirstOrThrow
   */
  export type NotificationRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRule to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationRules.
     */
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule findMany
   */
  export type NotificationRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter, which NotificationRules to fetch.
     */
    where?: NotificationRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationRules to fetch.
     */
    orderBy?: NotificationRuleOrderByWithRelationInput | NotificationRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationRules.
     */
    cursor?: NotificationRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationRules.
     */
    distinct?: NotificationRuleScalarFieldEnum | NotificationRuleScalarFieldEnum[]
  }

  /**
   * NotificationRule create
   */
  export type NotificationRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data needed to create a NotificationRule.
     */
    data: XOR<NotificationRuleCreateInput, NotificationRuleUncheckedCreateInput>
  }

  /**
   * NotificationRule createMany
   */
  export type NotificationRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationRules.
     */
    data: NotificationRuleCreateManyInput | NotificationRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationRule createManyAndReturn
   */
  export type NotificationRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data used to create many NotificationRules.
     */
    data: NotificationRuleCreateManyInput | NotificationRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationRule update
   */
  export type NotificationRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data needed to update a NotificationRule.
     */
    data: XOR<NotificationRuleUpdateInput, NotificationRuleUncheckedUpdateInput>
    /**
     * Choose, which NotificationRule to update.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule updateMany
   */
  export type NotificationRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationRules.
     */
    data: XOR<NotificationRuleUpdateManyMutationInput, NotificationRuleUncheckedUpdateManyInput>
    /**
     * Filter which NotificationRules to update
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to update.
     */
    limit?: number
  }

  /**
   * NotificationRule updateManyAndReturn
   */
  export type NotificationRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The data used to update NotificationRules.
     */
    data: XOR<NotificationRuleUpdateManyMutationInput, NotificationRuleUncheckedUpdateManyInput>
    /**
     * Filter which NotificationRules to update
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to update.
     */
    limit?: number
  }

  /**
   * NotificationRule upsert
   */
  export type NotificationRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * The filter to search for the NotificationRule to update in case it exists.
     */
    where: NotificationRuleWhereUniqueInput
    /**
     * In case the NotificationRule found by the `where` argument doesn't exist, create a new NotificationRule with this data.
     */
    create: XOR<NotificationRuleCreateInput, NotificationRuleUncheckedCreateInput>
    /**
     * In case the NotificationRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationRuleUpdateInput, NotificationRuleUncheckedUpdateInput>
  }

  /**
   * NotificationRule delete
   */
  export type NotificationRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
    /**
     * Filter which NotificationRule to delete.
     */
    where: NotificationRuleWhereUniqueInput
  }

  /**
   * NotificationRule deleteMany
   */
  export type NotificationRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationRules to delete
     */
    where?: NotificationRuleWhereInput
    /**
     * Limit how many NotificationRules to delete.
     */
    limit?: number
  }

  /**
   * NotificationRule without action
   */
  export type NotificationRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRule
     */
    select?: NotificationRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRule
     */
    omit?: NotificationRuleOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    accountNumber: string | null
    fullName: string | null
    passwordHash: string | null
    mustChangePassword: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    accountNumber: string | null
    fullName: string | null
    passwordHash: string | null
    mustChangePassword: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    accountNumber: number
    fullName: number
    passwordHash: number
    mustChangePassword: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    accountNumber?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    accountNumber?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    accountNumber?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    exportSchedules?: boolean | User$exportSchedulesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    accountNumber?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountNumber" | "fullName" | "passwordHash" | "mustChangePassword" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    exportSchedules?: boolean | User$exportSchedulesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      permissions: Prisma.$UserPermissionPayload<ExtArgs>[]
      exportSchedules: Prisma.$ExportSchedulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      accountNumber: string
      fullName: string
      passwordHash: string
      mustChangePassword: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    permissions<T extends User$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exportSchedules<T extends User$exportSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, User$exportSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly accountNumber: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly mustChangePassword: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.permissions
   */
  export type User$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    cursor?: UserPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * User.exportSchedules
   */
  export type User$exportSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    where?: ExportScheduleWhereInput
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    cursor?: ExportScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ExportSchedule
   */

  export type AggregateExportSchedule = {
    _count: ExportScheduleCountAggregateOutputType | null
    _avg: ExportScheduleAvgAggregateOutputType | null
    _sum: ExportScheduleSumAggregateOutputType | null
    _min: ExportScheduleMinAggregateOutputType | null
    _max: ExportScheduleMaxAggregateOutputType | null
  }

  export type ExportScheduleAvgAggregateOutputType = {
    userId: number | null
  }

  export type ExportScheduleSumAggregateOutputType = {
    userId: number | null
  }

  export type ExportScheduleMinAggregateOutputType = {
    id: string | null
    userId: number | null
    enabled: boolean | null
    frequency: string | null
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    deliveryMode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExportScheduleMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    enabled: boolean | null
    frequency: string | null
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    deliveryMode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExportScheduleCountAggregateOutputType = {
    id: number
    userId: number
    enabled: number
    frequency: number
    dayOfWeek: number
    dayOfMonth: number
    monthlyOn: number
    timeOfDay: number
    deliveryMode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExportScheduleAvgAggregateInputType = {
    userId?: true
  }

  export type ExportScheduleSumAggregateInputType = {
    userId?: true
  }

  export type ExportScheduleMinAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    deliveryMode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExportScheduleMaxAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    deliveryMode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExportScheduleCountAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    deliveryMode?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExportScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExportSchedule to aggregate.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExportSchedules
    **/
    _count?: true | ExportScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExportScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExportScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExportScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExportScheduleMaxAggregateInputType
  }

  export type GetExportScheduleAggregateType<T extends ExportScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateExportSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExportSchedule[P]>
      : GetScalarType<T[P], AggregateExportSchedule[P]>
  }




  export type ExportScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportScheduleWhereInput
    orderBy?: ExportScheduleOrderByWithAggregationInput | ExportScheduleOrderByWithAggregationInput[]
    by: ExportScheduleScalarFieldEnum[] | ExportScheduleScalarFieldEnum
    having?: ExportScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExportScheduleCountAggregateInputType | true
    _avg?: ExportScheduleAvgAggregateInputType
    _sum?: ExportScheduleSumAggregateInputType
    _min?: ExportScheduleMinAggregateInputType
    _max?: ExportScheduleMaxAggregateInputType
  }

  export type ExportScheduleGroupByOutputType = {
    id: string
    userId: number
    enabled: boolean
    frequency: string
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    deliveryMode: string
    createdAt: Date
    updatedAt: Date
    _count: ExportScheduleCountAggregateOutputType | null
    _avg: ExportScheduleAvgAggregateOutputType | null
    _sum: ExportScheduleSumAggregateOutputType | null
    _min: ExportScheduleMinAggregateOutputType | null
    _max: ExportScheduleMaxAggregateOutputType | null
  }

  type GetExportScheduleGroupByPayload<T extends ExportScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExportScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExportScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExportScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ExportScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ExportScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    deliveryMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    deliveryMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    deliveryMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectScalar = {
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    deliveryMode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExportScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "enabled" | "frequency" | "dayOfWeek" | "dayOfMonth" | "monthlyOn" | "timeOfDay" | "deliveryMode" | "createdAt" | "updatedAt", ExtArgs["result"]["exportSchedule"]>
  export type ExportScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExportScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExportScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExportSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExportSchedule"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      enabled: boolean
      frequency: string
      dayOfWeek: string | null
      dayOfMonth: string | null
      monthlyOn: string | null
      timeOfDay: string | null
      deliveryMode: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["exportSchedule"]>
    composites: {}
  }

  type ExportScheduleGetPayload<S extends boolean | null | undefined | ExportScheduleDefaultArgs> = $Result.GetResult<Prisma.$ExportSchedulePayload, S>

  type ExportScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExportScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExportScheduleCountAggregateInputType | true
    }

  export interface ExportScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExportSchedule'], meta: { name: 'ExportSchedule' } }
    /**
     * Find zero or one ExportSchedule that matches the filter.
     * @param {ExportScheduleFindUniqueArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExportScheduleFindUniqueArgs>(args: SelectSubset<T, ExportScheduleFindUniqueArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExportSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExportScheduleFindUniqueOrThrowArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExportScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ExportScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExportSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindFirstArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExportScheduleFindFirstArgs>(args?: SelectSubset<T, ExportScheduleFindFirstArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExportSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindFirstOrThrowArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExportScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ExportScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExportSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExportSchedules
     * const exportSchedules = await prisma.exportSchedule.findMany()
     * 
     * // Get first 10 ExportSchedules
     * const exportSchedules = await prisma.exportSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExportScheduleFindManyArgs>(args?: SelectSubset<T, ExportScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExportSchedule.
     * @param {ExportScheduleCreateArgs} args - Arguments to create a ExportSchedule.
     * @example
     * // Create one ExportSchedule
     * const ExportSchedule = await prisma.exportSchedule.create({
     *   data: {
     *     // ... data to create a ExportSchedule
     *   }
     * })
     * 
     */
    create<T extends ExportScheduleCreateArgs>(args: SelectSubset<T, ExportScheduleCreateArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExportSchedules.
     * @param {ExportScheduleCreateManyArgs} args - Arguments to create many ExportSchedules.
     * @example
     * // Create many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExportScheduleCreateManyArgs>(args?: SelectSubset<T, ExportScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExportSchedules and returns the data saved in the database.
     * @param {ExportScheduleCreateManyAndReturnArgs} args - Arguments to create many ExportSchedules.
     * @example
     * // Create many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExportSchedules and only return the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExportScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, ExportScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExportSchedule.
     * @param {ExportScheduleDeleteArgs} args - Arguments to delete one ExportSchedule.
     * @example
     * // Delete one ExportSchedule
     * const ExportSchedule = await prisma.exportSchedule.delete({
     *   where: {
     *     // ... filter to delete one ExportSchedule
     *   }
     * })
     * 
     */
    delete<T extends ExportScheduleDeleteArgs>(args: SelectSubset<T, ExportScheduleDeleteArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExportSchedule.
     * @param {ExportScheduleUpdateArgs} args - Arguments to update one ExportSchedule.
     * @example
     * // Update one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExportScheduleUpdateArgs>(args: SelectSubset<T, ExportScheduleUpdateArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExportSchedules.
     * @param {ExportScheduleDeleteManyArgs} args - Arguments to filter ExportSchedules to delete.
     * @example
     * // Delete a few ExportSchedules
     * const { count } = await prisma.exportSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExportScheduleDeleteManyArgs>(args?: SelectSubset<T, ExportScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExportSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExportScheduleUpdateManyArgs>(args: SelectSubset<T, ExportScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExportSchedules and returns the data updated in the database.
     * @param {ExportScheduleUpdateManyAndReturnArgs} args - Arguments to update many ExportSchedules.
     * @example
     * // Update many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExportSchedules and only return the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExportScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, ExportScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExportSchedule.
     * @param {ExportScheduleUpsertArgs} args - Arguments to update or create a ExportSchedule.
     * @example
     * // Update or create a ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.upsert({
     *   create: {
     *     // ... data to create a ExportSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExportSchedule we want to update
     *   }
     * })
     */
    upsert<T extends ExportScheduleUpsertArgs>(args: SelectSubset<T, ExportScheduleUpsertArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExportSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleCountArgs} args - Arguments to filter ExportSchedules to count.
     * @example
     * // Count the number of ExportSchedules
     * const count = await prisma.exportSchedule.count({
     *   where: {
     *     // ... the filter for the ExportSchedules we want to count
     *   }
     * })
    **/
    count<T extends ExportScheduleCountArgs>(
      args?: Subset<T, ExportScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExportScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExportSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExportScheduleAggregateArgs>(args: Subset<T, ExportScheduleAggregateArgs>): Prisma.PrismaPromise<GetExportScheduleAggregateType<T>>

    /**
     * Group by ExportSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExportScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExportScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ExportScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExportScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExportScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExportSchedule model
   */
  readonly fields: ExportScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExportSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExportScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExportSchedule model
   */
  interface ExportScheduleFieldRefs {
    readonly id: FieldRef<"ExportSchedule", 'String'>
    readonly userId: FieldRef<"ExportSchedule", 'Int'>
    readonly enabled: FieldRef<"ExportSchedule", 'Boolean'>
    readonly frequency: FieldRef<"ExportSchedule", 'String'>
    readonly dayOfWeek: FieldRef<"ExportSchedule", 'String'>
    readonly dayOfMonth: FieldRef<"ExportSchedule", 'String'>
    readonly monthlyOn: FieldRef<"ExportSchedule", 'String'>
    readonly timeOfDay: FieldRef<"ExportSchedule", 'String'>
    readonly deliveryMode: FieldRef<"ExportSchedule", 'String'>
    readonly createdAt: FieldRef<"ExportSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"ExportSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExportSchedule findUnique
   */
  export type ExportScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where: ExportScheduleWhereUniqueInput
  }

  /**
   * ExportSchedule findUniqueOrThrow
   */
  export type ExportScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where: ExportScheduleWhereUniqueInput
  }

  /**
   * ExportSchedule findFirst
   */
  export type ExportScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
  }

  /**
   * ExportSchedule findFirstOrThrow
   */
  export type ExportScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
  }

  /**
   * ExportSchedule findMany
   */
  export type ExportScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedules to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
  }

  /**
   * ExportSchedule create
   */
  export type ExportScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a ExportSchedule.
     */
    data: XOR<ExportScheduleCreateInput, ExportScheduleUncheckedCreateInput>
  }

  /**
   * ExportSchedule createMany
   */
  export type ExportScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExportSchedules.
     */
    data: ExportScheduleCreateManyInput | ExportScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExportSchedule createManyAndReturn
   */
  export type ExportScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many ExportSchedules.
     */
    data: ExportScheduleCreateManyInput | ExportScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExportSchedule update
   */
  export type ExportScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a ExportSchedule.
     */
    data: XOR<ExportScheduleUpdateInput, ExportScheduleUncheckedUpdateInput>
    /**
     * Choose, which ExportSchedule to update.
     */
    where: ExportScheduleWhereUniqueInput
  }

  /**
   * ExportSchedule updateMany
   */
  export type ExportScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExportSchedules.
     */
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyInput>
    /**
     * Filter which ExportSchedules to update
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to update.
     */
    limit?: number
  }

  /**
   * ExportSchedule updateManyAndReturn
   */
  export type ExportScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * The data used to update ExportSchedules.
     */
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyInput>
    /**
     * Filter which ExportSchedules to update
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExportSchedule upsert
   */
  export type ExportScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the ExportSchedule to update in case it exists.
     */
    where: ExportScheduleWhereUniqueInput
    /**
     * In case the ExportSchedule found by the `where` argument doesn't exist, create a new ExportSchedule with this data.
     */
    create: XOR<ExportScheduleCreateInput, ExportScheduleUncheckedCreateInput>
    /**
     * In case the ExportSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExportScheduleUpdateInput, ExportScheduleUncheckedUpdateInput>
  }

  /**
   * ExportSchedule delete
   */
  export type ExportScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter which ExportSchedule to delete.
     */
    where: ExportScheduleWhereUniqueInput
  }

  /**
   * ExportSchedule deleteMany
   */
  export type ExportScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExportSchedules to delete
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to delete.
     */
    limit?: number
  }

  /**
   * ExportSchedule without action
   */
  export type ExportScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionAvgAggregateOutputType = {
    id: number | null
  }

  export type PermissionSumAggregateOutputType = {
    id: number | null
  }

  export type PermissionMinAggregateOutputType = {
    id: number | null
    permissionName: string | null
    description: string | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: number | null
    permissionName: string | null
    description: string | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    permissionName: number
    description: number
    _all: number
  }


  export type PermissionAvgAggregateInputType = {
    id?: true
  }

  export type PermissionSumAggregateInputType = {
    id?: true
  }

  export type PermissionMinAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _avg?: PermissionAvgAggregateInputType
    _sum?: PermissionSumAggregateInputType
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: number
    permissionName: string
    description: string | null
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
    users?: boolean | Permission$usersArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "permissionName" | "description", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Permission$usersArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      users: Prisma.$UserPermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      permissionName: string
      description: string | null
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Permission$usersArgs<ExtArgs> = {}>(args?: Subset<T, Permission$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'Int'>
    readonly permissionName: FieldRef<"Permission", 'String'>
    readonly description: FieldRef<"Permission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.users
   */
  export type Permission$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    cursor?: UserPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model UserPermission
   */

  export type AggregateUserPermission = {
    _count: UserPermissionCountAggregateOutputType | null
    _avg: UserPermissionAvgAggregateOutputType | null
    _sum: UserPermissionSumAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  export type UserPermissionAvgAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
  }

  export type UserPermissionSumAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
  }

  export type UserPermissionMinAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
    assignedAt: Date | null
  }

  export type UserPermissionMaxAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
    assignedAt: Date | null
  }

  export type UserPermissionCountAggregateOutputType = {
    userId: number
    permissionId: number
    assignedBy: number
    assignedAt: number
    _all: number
  }


  export type UserPermissionAvgAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
  }

  export type UserPermissionSumAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
  }

  export type UserPermissionMinAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
  }

  export type UserPermissionMaxAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
  }

  export type UserPermissionCountAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
    _all?: true
  }

  export type UserPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermission to aggregate.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPermissions
    **/
    _count?: true | UserPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserPermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserPermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPermissionMaxAggregateInputType
  }

  export type GetUserPermissionAggregateType<T extends UserPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPermission[P]>
      : GetScalarType<T[P], AggregateUserPermission[P]>
  }




  export type UserPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithAggregationInput | UserPermissionOrderByWithAggregationInput[]
    by: UserPermissionScalarFieldEnum[] | UserPermissionScalarFieldEnum
    having?: UserPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPermissionCountAggregateInputType | true
    _avg?: UserPermissionAvgAggregateInputType
    _sum?: UserPermissionSumAggregateInputType
    _min?: UserPermissionMinAggregateInputType
    _max?: UserPermissionMaxAggregateInputType
  }

  export type UserPermissionGroupByOutputType = {
    userId: number
    permissionId: number
    assignedBy: number | null
    assignedAt: Date
    _count: UserPermissionCountAggregateOutputType | null
    _avg: UserPermissionAvgAggregateOutputType | null
    _sum: UserPermissionSumAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  type GetUserPermissionGroupByPayload<T extends UserPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
        }
      >
    >


  export type UserPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectScalar = {
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
  }

  export type UserPermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "permissionId" | "assignedBy" | "assignedAt", ExtArgs["result"]["userPermission"]>
  export type UserPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }

  export type $UserPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPermission"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      permission: Prisma.$PermissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      permissionId: number
      assignedBy: number | null
      assignedAt: Date
    }, ExtArgs["result"]["userPermission"]>
    composites: {}
  }

  type UserPermissionGetPayload<S extends boolean | null | undefined | UserPermissionDefaultArgs> = $Result.GetResult<Prisma.$UserPermissionPayload, S>

  type UserPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserPermissionCountAggregateInputType | true
    }

  export interface UserPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPermission'], meta: { name: 'UserPermission' } }
    /**
     * Find zero or one UserPermission that matches the filter.
     * @param {UserPermissionFindUniqueArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPermissionFindUniqueArgs>(args: SelectSubset<T, UserPermissionFindUniqueArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPermissionFindUniqueOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPermissionFindFirstArgs>(args?: SelectSubset<T, UserPermissionFindFirstArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPermissions
     * const userPermissions = await prisma.userPermission.findMany()
     * 
     * // Get first 10 UserPermissions
     * const userPermissions = await prisma.userPermission.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserPermissionFindManyArgs>(args?: SelectSubset<T, UserPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPermission.
     * @param {UserPermissionCreateArgs} args - Arguments to create a UserPermission.
     * @example
     * // Create one UserPermission
     * const UserPermission = await prisma.userPermission.create({
     *   data: {
     *     // ... data to create a UserPermission
     *   }
     * })
     * 
     */
    create<T extends UserPermissionCreateArgs>(args: SelectSubset<T, UserPermissionCreateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPermissions.
     * @param {UserPermissionCreateManyArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPermissionCreateManyArgs>(args?: SelectSubset<T, UserPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPermissions and returns the data saved in the database.
     * @param {UserPermissionCreateManyAndReturnArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPermissions and only return the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserPermission.
     * @param {UserPermissionDeleteArgs} args - Arguments to delete one UserPermission.
     * @example
     * // Delete one UserPermission
     * const UserPermission = await prisma.userPermission.delete({
     *   where: {
     *     // ... filter to delete one UserPermission
     *   }
     * })
     * 
     */
    delete<T extends UserPermissionDeleteArgs>(args: SelectSubset<T, UserPermissionDeleteArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPermission.
     * @param {UserPermissionUpdateArgs} args - Arguments to update one UserPermission.
     * @example
     * // Update one UserPermission
     * const userPermission = await prisma.userPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPermissionUpdateArgs>(args: SelectSubset<T, UserPermissionUpdateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPermissions.
     * @param {UserPermissionDeleteManyArgs} args - Arguments to filter UserPermissions to delete.
     * @example
     * // Delete a few UserPermissions
     * const { count } = await prisma.userPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPermissionDeleteManyArgs>(args?: SelectSubset<T, UserPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPermissionUpdateManyArgs>(args: SelectSubset<T, UserPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions and returns the data updated in the database.
     * @param {UserPermissionUpdateManyAndReturnArgs} args - Arguments to update many UserPermissions.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPermissions and only return the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserPermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserPermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserPermission.
     * @param {UserPermissionUpsertArgs} args - Arguments to update or create a UserPermission.
     * @example
     * // Update or create a UserPermission
     * const userPermission = await prisma.userPermission.upsert({
     *   create: {
     *     // ... data to create a UserPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPermission we want to update
     *   }
     * })
     */
    upsert<T extends UserPermissionUpsertArgs>(args: SelectSubset<T, UserPermissionUpsertArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionCountArgs} args - Arguments to filter UserPermissions to count.
     * @example
     * // Count the number of UserPermissions
     * const count = await prisma.userPermission.count({
     *   where: {
     *     // ... the filter for the UserPermissions we want to count
     *   }
     * })
    **/
    count<T extends UserPermissionCountArgs>(
      args?: Subset<T, UserPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPermissionAggregateArgs>(args: Subset<T, UserPermissionAggregateArgs>): Prisma.PrismaPromise<GetUserPermissionAggregateType<T>>

    /**
     * Group by UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPermissionGroupByArgs['orderBy'] }
        : { orderBy?: UserPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPermission model
   */
  readonly fields: UserPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPermission model
   */
  interface UserPermissionFieldRefs {
    readonly userId: FieldRef<"UserPermission", 'Int'>
    readonly permissionId: FieldRef<"UserPermission", 'Int'>
    readonly assignedBy: FieldRef<"UserPermission", 'Int'>
    readonly assignedAt: FieldRef<"UserPermission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPermission findUnique
   */
  export type UserPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findUniqueOrThrow
   */
  export type UserPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findFirst
   */
  export type UserPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findFirstOrThrow
   */
  export type UserPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findMany
   */
  export type UserPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermissions to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission create
   */
  export type UserPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPermission.
     */
    data: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
  }

  /**
   * UserPermission createMany
   */
  export type UserPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPermission createManyAndReturn
   */
  export type UserPermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission update
   */
  export type UserPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPermission.
     */
    data: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
    /**
     * Choose, which UserPermission to update.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission updateMany
   */
  export type UserPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
  }

  /**
   * UserPermission updateManyAndReturn
   */
  export type UserPermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission upsert
   */
  export type UserPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPermission to update in case it exists.
     */
    where: UserPermissionWhereUniqueInput
    /**
     * In case the UserPermission found by the `where` argument doesn't exist, create a new UserPermission with this data.
     */
    create: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
    /**
     * In case the UserPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
  }

  /**
   * UserPermission delete
   */
  export type UserPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter which UserPermission to delete.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission deleteMany
   */
  export type UserPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermissions to delete
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to delete.
     */
    limit?: number
  }

  /**
   * UserPermission without action
   */
  export type UserPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CrimeIncidentScalarFieldEnum: {
    id: 'id',
    blotterNo: 'blotterNo',
    dateEncoded: 'dateEncoded',
    pro: 'pro',
    ppo: 'ppo',
    stn: 'stn',
    pcp: 'pcp',
    region: 'region',
    province: 'province',
    municipal: 'municipal',
    barangay: 'barangay',
    street: 'street',
    typeOfPlace: 'typeOfPlace',
    dateReported: 'dateReported',
    timeReported: 'timeReported',
    dateCommitted: 'dateCommitted',
    timeCommitted: 'timeCommitted',
    incidentType: 'incidentType',
    isCrime: 'isCrime',
    modeReporting: 'modeReporting',
    stageOfFelony: 'stageOfFelony',
    offense: 'offense',
    offenseType: 'offenseType',
    section: 'section',
    modus: 'modus',
    suspectMotive: 'suspectMotive',
    suspectSubMotive: 'suspectSubMotive',
    heinous: 'heinous',
    sensational: 'sensational',
    threatGrp: 'threatGrp',
    grpAffiliation: 'grpAffiliation',
    incidentTypeThreatGrp: 'incidentTypeThreatGrp',
    mrs: 'mrs',
    suspectIsEGO: 'suspectIsEGO',
    suspectEGOPosition: 'suspectEGOPosition',
    suspectEGOClass: 'suspectEGOClass',
    suspectCount: 'suspectCount',
    suspectArrested: 'suspectArrested',
    victimIsEGO: 'victimIsEGO',
    victimEGOPosition: 'victimEGOPosition',
    victimEGOClass: 'victimEGOClass',
    victimCount: 'victimCount',
    caseStatus: 'caseStatus',
    investigator: 'investigator',
    headInves: 'headInves',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CrimeIncidentScalarFieldEnum = (typeof CrimeIncidentScalarFieldEnum)[keyof typeof CrimeIncidentScalarFieldEnum]


  export const BarangayScalarFieldEnum: {
    id: 'id',
    name: 'name',
    coordinates: 'coordinates',
    population: 'population',
    area: 'area',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BarangayScalarFieldEnum = (typeof BarangayScalarFieldEnum)[keyof typeof BarangayScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    details: 'details',
    user: 'user',
    createdAt: 'createdAt',
    ip: 'ip',
    session: 'session',
    resource: 'resource',
    severity: 'severity',
    outcome: 'outcome',
    fileName: 'fileName',
    fileSize: 'fileSize',
    recordsImported: 'recordsImported',
    errorMessage: 'errorMessage'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    message: 'message',
    category: 'category',
    severity: 'severity',
    uploadLogId: 'uploadLogId',
    metadata: 'metadata',
    isRead: 'isRead',
    readAt: 'readAt',
    isArchived: 'isArchived',
    archivedAt: 'archivedAt',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const NotificationRuleScalarFieldEnum: {
    id: 'id',
    ruleKey: 'ruleKey',
    name: 'name',
    description: 'description',
    category: 'category',
    conditionType: 'conditionType',
    parameters: 'parameters',
    severity: 'severity',
    isEnabled: 'isEnabled',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type NotificationRuleScalarFieldEnum = (typeof NotificationRuleScalarFieldEnum)[keyof typeof NotificationRuleScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    accountNumber: 'accountNumber',
    fullName: 'fullName',
    passwordHash: 'passwordHash',
    mustChangePassword: 'mustChangePassword',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ExportScheduleScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    enabled: 'enabled',
    frequency: 'frequency',
    dayOfWeek: 'dayOfWeek',
    dayOfMonth: 'dayOfMonth',
    monthlyOn: 'monthlyOn',
    timeOfDay: 'timeOfDay',
    deliveryMode: 'deliveryMode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExportScheduleScalarFieldEnum = (typeof ExportScheduleScalarFieldEnum)[keyof typeof ExportScheduleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    permissionName: 'permissionName',
    description: 'description'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const UserPermissionScalarFieldEnum: {
    userId: 'userId',
    permissionId: 'permissionId',
    assignedBy: 'assignedBy',
    assignedAt: 'assignedAt'
  };

  export type UserPermissionScalarFieldEnum = (typeof UserPermissionScalarFieldEnum)[keyof typeof UserPermissionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'NotificationCategory'
   */
  export type EnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory'>
    


  /**
   * Reference to a field of type 'NotificationCategory[]'
   */
  export type ListEnumNotificationCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationCategory[]'>
    


  /**
   * Reference to a field of type 'NotificationSeverity'
   */
  export type EnumNotificationSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationSeverity'>
    


  /**
   * Reference to a field of type 'NotificationSeverity[]'
   */
  export type ListEnumNotificationSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationSeverity[]'>
    


  /**
   * Reference to a field of type 'RuleConditionType'
   */
  export type EnumRuleConditionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RuleConditionType'>
    


  /**
   * Reference to a field of type 'RuleConditionType[]'
   */
  export type ListEnumRuleConditionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RuleConditionType[]'>
    
  /**
   * Deep Input Types
   */


  export type CrimeIncidentWhereInput = {
    AND?: CrimeIncidentWhereInput | CrimeIncidentWhereInput[]
    OR?: CrimeIncidentWhereInput[]
    NOT?: CrimeIncidentWhereInput | CrimeIncidentWhereInput[]
    id?: StringFilter<"CrimeIncident"> | string
    blotterNo?: StringNullableFilter<"CrimeIncident"> | string | null
    dateEncoded?: DateTimeNullableFilter<"CrimeIncident"> | Date | string | null
    pro?: StringNullableFilter<"CrimeIncident"> | string | null
    ppo?: StringNullableFilter<"CrimeIncident"> | string | null
    stn?: StringNullableFilter<"CrimeIncident"> | string | null
    pcp?: StringNullableFilter<"CrimeIncident"> | string | null
    region?: StringNullableFilter<"CrimeIncident"> | string | null
    province?: StringNullableFilter<"CrimeIncident"> | string | null
    municipal?: StringNullableFilter<"CrimeIncident"> | string | null
    barangay?: StringFilter<"CrimeIncident"> | string
    street?: StringNullableFilter<"CrimeIncident"> | string | null
    typeOfPlace?: StringNullableFilter<"CrimeIncident"> | string | null
    dateReported?: DateTimeFilter<"CrimeIncident"> | Date | string
    timeReported?: StringFilter<"CrimeIncident"> | string
    dateCommitted?: DateTimeFilter<"CrimeIncident"> | Date | string
    timeCommitted?: StringFilter<"CrimeIncident"> | string
    incidentType?: StringFilter<"CrimeIncident"> | string
    isCrime?: BoolFilter<"CrimeIncident"> | boolean
    modeReporting?: StringNullableFilter<"CrimeIncident"> | string | null
    stageOfFelony?: StringNullableFilter<"CrimeIncident"> | string | null
    offense?: StringNullableFilter<"CrimeIncident"> | string | null
    offenseType?: StringNullableFilter<"CrimeIncident"> | string | null
    section?: StringNullableFilter<"CrimeIncident"> | string | null
    modus?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectMotive?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectSubMotive?: StringNullableFilter<"CrimeIncident"> | string | null
    heinous?: BoolFilter<"CrimeIncident"> | boolean
    sensational?: BoolFilter<"CrimeIncident"> | boolean
    threatGrp?: BoolFilter<"CrimeIncident"> | boolean
    grpAffiliation?: StringNullableFilter<"CrimeIncident"> | string | null
    incidentTypeThreatGrp?: StringNullableFilter<"CrimeIncident"> | string | null
    mrs?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectIsEGO?: BoolFilter<"CrimeIncident"> | boolean
    suspectEGOPosition?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectEGOClass?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectCount?: IntNullableFilter<"CrimeIncident"> | number | null
    suspectArrested?: BoolNullableFilter<"CrimeIncident"> | boolean | null
    victimIsEGO?: BoolFilter<"CrimeIncident"> | boolean
    victimEGOPosition?: StringNullableFilter<"CrimeIncident"> | string | null
    victimEGOClass?: StringNullableFilter<"CrimeIncident"> | string | null
    victimCount?: IntNullableFilter<"CrimeIncident"> | number | null
    caseStatus?: StringNullableFilter<"CrimeIncident"> | string | null
    investigator?: StringNullableFilter<"CrimeIncident"> | string | null
    headInves?: StringNullableFilter<"CrimeIncident"> | string | null
    latitude?: FloatNullableFilter<"CrimeIncident"> | number | null
    longitude?: FloatNullableFilter<"CrimeIncident"> | number | null
    createdAt?: DateTimeFilter<"CrimeIncident"> | Date | string
    updatedAt?: DateTimeFilter<"CrimeIncident"> | Date | string
  }

  export type CrimeIncidentOrderByWithRelationInput = {
    id?: SortOrder
    blotterNo?: SortOrderInput | SortOrder
    dateEncoded?: SortOrderInput | SortOrder
    pro?: SortOrderInput | SortOrder
    ppo?: SortOrderInput | SortOrder
    stn?: SortOrderInput | SortOrder
    pcp?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    municipal?: SortOrderInput | SortOrder
    barangay?: SortOrder
    street?: SortOrderInput | SortOrder
    typeOfPlace?: SortOrderInput | SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    incidentType?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrderInput | SortOrder
    stageOfFelony?: SortOrderInput | SortOrder
    offense?: SortOrderInput | SortOrder
    offenseType?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    modus?: SortOrderInput | SortOrder
    suspectMotive?: SortOrderInput | SortOrder
    suspectSubMotive?: SortOrderInput | SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrderInput | SortOrder
    incidentTypeThreatGrp?: SortOrderInput | SortOrder
    mrs?: SortOrderInput | SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrderInput | SortOrder
    suspectEGOClass?: SortOrderInput | SortOrder
    suspectCount?: SortOrderInput | SortOrder
    suspectArrested?: SortOrderInput | SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrderInput | SortOrder
    victimEGOClass?: SortOrderInput | SortOrder
    victimCount?: SortOrderInput | SortOrder
    caseStatus?: SortOrderInput | SortOrder
    investigator?: SortOrderInput | SortOrder
    headInves?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrimeIncidentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrimeIncidentWhereInput | CrimeIncidentWhereInput[]
    OR?: CrimeIncidentWhereInput[]
    NOT?: CrimeIncidentWhereInput | CrimeIncidentWhereInput[]
    blotterNo?: StringNullableFilter<"CrimeIncident"> | string | null
    dateEncoded?: DateTimeNullableFilter<"CrimeIncident"> | Date | string | null
    pro?: StringNullableFilter<"CrimeIncident"> | string | null
    ppo?: StringNullableFilter<"CrimeIncident"> | string | null
    stn?: StringNullableFilter<"CrimeIncident"> | string | null
    pcp?: StringNullableFilter<"CrimeIncident"> | string | null
    region?: StringNullableFilter<"CrimeIncident"> | string | null
    province?: StringNullableFilter<"CrimeIncident"> | string | null
    municipal?: StringNullableFilter<"CrimeIncident"> | string | null
    barangay?: StringFilter<"CrimeIncident"> | string
    street?: StringNullableFilter<"CrimeIncident"> | string | null
    typeOfPlace?: StringNullableFilter<"CrimeIncident"> | string | null
    dateReported?: DateTimeFilter<"CrimeIncident"> | Date | string
    timeReported?: StringFilter<"CrimeIncident"> | string
    dateCommitted?: DateTimeFilter<"CrimeIncident"> | Date | string
    timeCommitted?: StringFilter<"CrimeIncident"> | string
    incidentType?: StringFilter<"CrimeIncident"> | string
    isCrime?: BoolFilter<"CrimeIncident"> | boolean
    modeReporting?: StringNullableFilter<"CrimeIncident"> | string | null
    stageOfFelony?: StringNullableFilter<"CrimeIncident"> | string | null
    offense?: StringNullableFilter<"CrimeIncident"> | string | null
    offenseType?: StringNullableFilter<"CrimeIncident"> | string | null
    section?: StringNullableFilter<"CrimeIncident"> | string | null
    modus?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectMotive?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectSubMotive?: StringNullableFilter<"CrimeIncident"> | string | null
    heinous?: BoolFilter<"CrimeIncident"> | boolean
    sensational?: BoolFilter<"CrimeIncident"> | boolean
    threatGrp?: BoolFilter<"CrimeIncident"> | boolean
    grpAffiliation?: StringNullableFilter<"CrimeIncident"> | string | null
    incidentTypeThreatGrp?: StringNullableFilter<"CrimeIncident"> | string | null
    mrs?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectIsEGO?: BoolFilter<"CrimeIncident"> | boolean
    suspectEGOPosition?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectEGOClass?: StringNullableFilter<"CrimeIncident"> | string | null
    suspectCount?: IntNullableFilter<"CrimeIncident"> | number | null
    suspectArrested?: BoolNullableFilter<"CrimeIncident"> | boolean | null
    victimIsEGO?: BoolFilter<"CrimeIncident"> | boolean
    victimEGOPosition?: StringNullableFilter<"CrimeIncident"> | string | null
    victimEGOClass?: StringNullableFilter<"CrimeIncident"> | string | null
    victimCount?: IntNullableFilter<"CrimeIncident"> | number | null
    caseStatus?: StringNullableFilter<"CrimeIncident"> | string | null
    investigator?: StringNullableFilter<"CrimeIncident"> | string | null
    headInves?: StringNullableFilter<"CrimeIncident"> | string | null
    latitude?: FloatNullableFilter<"CrimeIncident"> | number | null
    longitude?: FloatNullableFilter<"CrimeIncident"> | number | null
    createdAt?: DateTimeFilter<"CrimeIncident"> | Date | string
    updatedAt?: DateTimeFilter<"CrimeIncident"> | Date | string
  }, "id">

  export type CrimeIncidentOrderByWithAggregationInput = {
    id?: SortOrder
    blotterNo?: SortOrderInput | SortOrder
    dateEncoded?: SortOrderInput | SortOrder
    pro?: SortOrderInput | SortOrder
    ppo?: SortOrderInput | SortOrder
    stn?: SortOrderInput | SortOrder
    pcp?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    municipal?: SortOrderInput | SortOrder
    barangay?: SortOrder
    street?: SortOrderInput | SortOrder
    typeOfPlace?: SortOrderInput | SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    incidentType?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrderInput | SortOrder
    stageOfFelony?: SortOrderInput | SortOrder
    offense?: SortOrderInput | SortOrder
    offenseType?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    modus?: SortOrderInput | SortOrder
    suspectMotive?: SortOrderInput | SortOrder
    suspectSubMotive?: SortOrderInput | SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrderInput | SortOrder
    incidentTypeThreatGrp?: SortOrderInput | SortOrder
    mrs?: SortOrderInput | SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrderInput | SortOrder
    suspectEGOClass?: SortOrderInput | SortOrder
    suspectCount?: SortOrderInput | SortOrder
    suspectArrested?: SortOrderInput | SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrderInput | SortOrder
    victimEGOClass?: SortOrderInput | SortOrder
    victimCount?: SortOrderInput | SortOrder
    caseStatus?: SortOrderInput | SortOrder
    investigator?: SortOrderInput | SortOrder
    headInves?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CrimeIncidentCountOrderByAggregateInput
    _avg?: CrimeIncidentAvgOrderByAggregateInput
    _max?: CrimeIncidentMaxOrderByAggregateInput
    _min?: CrimeIncidentMinOrderByAggregateInput
    _sum?: CrimeIncidentSumOrderByAggregateInput
  }

  export type CrimeIncidentScalarWhereWithAggregatesInput = {
    AND?: CrimeIncidentScalarWhereWithAggregatesInput | CrimeIncidentScalarWhereWithAggregatesInput[]
    OR?: CrimeIncidentScalarWhereWithAggregatesInput[]
    NOT?: CrimeIncidentScalarWhereWithAggregatesInput | CrimeIncidentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrimeIncident"> | string
    blotterNo?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    dateEncoded?: DateTimeNullableWithAggregatesFilter<"CrimeIncident"> | Date | string | null
    pro?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    ppo?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    stn?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    pcp?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    region?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    province?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    municipal?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    barangay?: StringWithAggregatesFilter<"CrimeIncident"> | string
    street?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    typeOfPlace?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    dateReported?: DateTimeWithAggregatesFilter<"CrimeIncident"> | Date | string
    timeReported?: StringWithAggregatesFilter<"CrimeIncident"> | string
    dateCommitted?: DateTimeWithAggregatesFilter<"CrimeIncident"> | Date | string
    timeCommitted?: StringWithAggregatesFilter<"CrimeIncident"> | string
    incidentType?: StringWithAggregatesFilter<"CrimeIncident"> | string
    isCrime?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    modeReporting?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    stageOfFelony?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    offense?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    offenseType?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    section?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    modus?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    suspectMotive?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    suspectSubMotive?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    heinous?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    sensational?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    threatGrp?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    grpAffiliation?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    incidentTypeThreatGrp?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    mrs?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    suspectIsEGO?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    suspectEGOPosition?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    suspectEGOClass?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    suspectCount?: IntNullableWithAggregatesFilter<"CrimeIncident"> | number | null
    suspectArrested?: BoolNullableWithAggregatesFilter<"CrimeIncident"> | boolean | null
    victimIsEGO?: BoolWithAggregatesFilter<"CrimeIncident"> | boolean
    victimEGOPosition?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    victimEGOClass?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    victimCount?: IntNullableWithAggregatesFilter<"CrimeIncident"> | number | null
    caseStatus?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    investigator?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    headInves?: StringNullableWithAggregatesFilter<"CrimeIncident"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"CrimeIncident"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"CrimeIncident"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"CrimeIncident"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CrimeIncident"> | Date | string
  }

  export type BarangayWhereInput = {
    AND?: BarangayWhereInput | BarangayWhereInput[]
    OR?: BarangayWhereInput[]
    NOT?: BarangayWhereInput | BarangayWhereInput[]
    id?: StringFilter<"Barangay"> | string
    name?: StringFilter<"Barangay"> | string
    coordinates?: JsonNullableFilter<"Barangay">
    population?: IntNullableFilter<"Barangay"> | number | null
    area?: FloatNullableFilter<"Barangay"> | number | null
    createdAt?: DateTimeFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeFilter<"Barangay"> | Date | string
  }

  export type BarangayOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrderInput | SortOrder
    population?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: BarangayWhereInput | BarangayWhereInput[]
    OR?: BarangayWhereInput[]
    NOT?: BarangayWhereInput | BarangayWhereInput[]
    coordinates?: JsonNullableFilter<"Barangay">
    population?: IntNullableFilter<"Barangay"> | number | null
    area?: FloatNullableFilter<"Barangay"> | number | null
    createdAt?: DateTimeFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeFilter<"Barangay"> | Date | string
  }, "id" | "name">

  export type BarangayOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrderInput | SortOrder
    population?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BarangayCountOrderByAggregateInput
    _avg?: BarangayAvgOrderByAggregateInput
    _max?: BarangayMaxOrderByAggregateInput
    _min?: BarangayMinOrderByAggregateInput
    _sum?: BarangaySumOrderByAggregateInput
  }

  export type BarangayScalarWhereWithAggregatesInput = {
    AND?: BarangayScalarWhereWithAggregatesInput | BarangayScalarWhereWithAggregatesInput[]
    OR?: BarangayScalarWhereWithAggregatesInput[]
    NOT?: BarangayScalarWhereWithAggregatesInput | BarangayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Barangay"> | string
    name?: StringWithAggregatesFilter<"Barangay"> | string
    coordinates?: JsonNullableWithAggregatesFilter<"Barangay">
    population?: IntNullableWithAggregatesFilter<"Barangay"> | number | null
    area?: FloatNullableWithAggregatesFilter<"Barangay"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Barangay"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    user?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    ip?: StringNullableFilter<"AuditLog"> | string | null
    session?: StringNullableFilter<"AuditLog"> | string | null
    resource?: StringNullableFilter<"AuditLog"> | string | null
    severity?: StringNullableFilter<"AuditLog"> | string | null
    outcome?: StringNullableFilter<"AuditLog"> | string | null
    fileName?: StringNullableFilter<"AuditLog"> | string | null
    fileSize?: IntNullableFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableFilter<"AuditLog"> | string | null
    notifications?: NotificationListRelationFilter
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ip?: SortOrderInput | SortOrder
    session?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    recordsImported?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    action?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    user?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    ip?: StringNullableFilter<"AuditLog"> | string | null
    session?: StringNullableFilter<"AuditLog"> | string | null
    resource?: StringNullableFilter<"AuditLog"> | string | null
    severity?: StringNullableFilter<"AuditLog"> | string | null
    outcome?: StringNullableFilter<"AuditLog"> | string | null
    fileName?: StringNullableFilter<"AuditLog"> | string | null
    fileSize?: IntNullableFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableFilter<"AuditLog"> | string | null
    notifications?: NotificationListRelationFilter
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ip?: SortOrderInput | SortOrder
    session?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    recordsImported?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    user?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    ip?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    session?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    resource?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    severity?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    outcome?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    category?: EnumNotificationCategoryFilter<"Notification"> | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFilter<"Notification"> | $Enums.NotificationSeverity
    uploadLogId?: StringNullableFilter<"Notification"> | string | null
    metadata?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    isArchived?: BoolFilter<"Notification"> | boolean
    archivedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    uploadLog?: XOR<AuditLogNullableScalarRelationFilter, AuditLogWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    uploadLogId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    uploadLog?: AuditLogOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    category?: EnumNotificationCategoryFilter<"Notification"> | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFilter<"Notification"> | $Enums.NotificationSeverity
    uploadLogId?: StringNullableFilter<"Notification"> | string | null
    metadata?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    isArchived?: BoolFilter<"Notification"> | boolean
    archivedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    uploadLog?: XOR<AuditLogNullableScalarRelationFilter, AuditLogWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    uploadLogId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isRead?: SortOrder
    readAt?: SortOrderInput | SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    category?: EnumNotificationCategoryWithAggregatesFilter<"Notification"> | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityWithAggregatesFilter<"Notification"> | $Enums.NotificationSeverity
    uploadLogId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Notification">
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    readAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    isArchived?: BoolWithAggregatesFilter<"Notification"> | boolean
    archivedAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type NotificationRuleWhereInput = {
    AND?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    OR?: NotificationRuleWhereInput[]
    NOT?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    id?: StringFilter<"NotificationRule"> | string
    ruleKey?: StringFilter<"NotificationRule"> | string
    name?: StringFilter<"NotificationRule"> | string
    description?: StringNullableFilter<"NotificationRule"> | string | null
    category?: EnumNotificationCategoryFilter<"NotificationRule"> | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFilter<"NotificationRule"> | $Enums.RuleConditionType
    parameters?: JsonFilter<"NotificationRule">
    severity?: EnumNotificationSeverityFilter<"NotificationRule"> | $Enums.NotificationSeverity
    isEnabled?: BoolFilter<"NotificationRule"> | boolean
    updatedBy?: IntNullableFilter<"NotificationRule"> | number | null
    updatedAt?: DateTimeFilter<"NotificationRule"> | Date | string
    createdAt?: DateTimeFilter<"NotificationRule"> | Date | string
  }

  export type NotificationRuleOrderByWithRelationInput = {
    id?: SortOrder
    ruleKey?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    conditionType?: SortOrder
    parameters?: SortOrder
    severity?: SortOrder
    isEnabled?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ruleKey?: string
    AND?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    OR?: NotificationRuleWhereInput[]
    NOT?: NotificationRuleWhereInput | NotificationRuleWhereInput[]
    name?: StringFilter<"NotificationRule"> | string
    description?: StringNullableFilter<"NotificationRule"> | string | null
    category?: EnumNotificationCategoryFilter<"NotificationRule"> | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFilter<"NotificationRule"> | $Enums.RuleConditionType
    parameters?: JsonFilter<"NotificationRule">
    severity?: EnumNotificationSeverityFilter<"NotificationRule"> | $Enums.NotificationSeverity
    isEnabled?: BoolFilter<"NotificationRule"> | boolean
    updatedBy?: IntNullableFilter<"NotificationRule"> | number | null
    updatedAt?: DateTimeFilter<"NotificationRule"> | Date | string
    createdAt?: DateTimeFilter<"NotificationRule"> | Date | string
  }, "id" | "ruleKey">

  export type NotificationRuleOrderByWithAggregationInput = {
    id?: SortOrder
    ruleKey?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    conditionType?: SortOrder
    parameters?: SortOrder
    severity?: SortOrder
    isEnabled?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationRuleCountOrderByAggregateInput
    _avg?: NotificationRuleAvgOrderByAggregateInput
    _max?: NotificationRuleMaxOrderByAggregateInput
    _min?: NotificationRuleMinOrderByAggregateInput
    _sum?: NotificationRuleSumOrderByAggregateInput
  }

  export type NotificationRuleScalarWhereWithAggregatesInput = {
    AND?: NotificationRuleScalarWhereWithAggregatesInput | NotificationRuleScalarWhereWithAggregatesInput[]
    OR?: NotificationRuleScalarWhereWithAggregatesInput[]
    NOT?: NotificationRuleScalarWhereWithAggregatesInput | NotificationRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationRule"> | string
    ruleKey?: StringWithAggregatesFilter<"NotificationRule"> | string
    name?: StringWithAggregatesFilter<"NotificationRule"> | string
    description?: StringNullableWithAggregatesFilter<"NotificationRule"> | string | null
    category?: EnumNotificationCategoryWithAggregatesFilter<"NotificationRule"> | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeWithAggregatesFilter<"NotificationRule"> | $Enums.RuleConditionType
    parameters?: JsonWithAggregatesFilter<"NotificationRule">
    severity?: EnumNotificationSeverityWithAggregatesFilter<"NotificationRule"> | $Enums.NotificationSeverity
    isEnabled?: BoolWithAggregatesFilter<"NotificationRule"> | boolean
    updatedBy?: IntNullableWithAggregatesFilter<"NotificationRule"> | number | null
    updatedAt?: DateTimeWithAggregatesFilter<"NotificationRule"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"NotificationRule"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    accountNumber?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    mustChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    permissions?: UserPermissionListRelationFilter
    exportSchedules?: ExportScheduleListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    permissions?: UserPermissionOrderByRelationAggregateInput
    exportSchedules?: ExportScheduleOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    accountNumber?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    mustChangePassword?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    permissions?: UserPermissionListRelationFilter
    exportSchedules?: ExportScheduleListRelationFilter
  }, "id" | "accountNumber">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    accountNumber?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    mustChangePassword?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ExportScheduleWhereInput = {
    AND?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    OR?: ExportScheduleWhereInput[]
    NOT?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    id?: StringFilter<"ExportSchedule"> | string
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    deliveryMode?: StringFilter<"ExportSchedule"> | string
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ExportScheduleOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrderInput | SortOrder
    dayOfMonth?: SortOrderInput | SortOrder
    monthlyOn?: SortOrderInput | SortOrder
    timeOfDay?: SortOrderInput | SortOrder
    deliveryMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ExportScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    OR?: ExportScheduleWhereInput[]
    NOT?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    deliveryMode?: StringFilter<"ExportSchedule"> | string
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ExportScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrderInput | SortOrder
    dayOfMonth?: SortOrderInput | SortOrder
    monthlyOn?: SortOrderInput | SortOrder
    timeOfDay?: SortOrderInput | SortOrder
    deliveryMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExportScheduleCountOrderByAggregateInput
    _avg?: ExportScheduleAvgOrderByAggregateInput
    _max?: ExportScheduleMaxOrderByAggregateInput
    _min?: ExportScheduleMinOrderByAggregateInput
    _sum?: ExportScheduleSumOrderByAggregateInput
  }

  export type ExportScheduleScalarWhereWithAggregatesInput = {
    AND?: ExportScheduleScalarWhereWithAggregatesInput | ExportScheduleScalarWhereWithAggregatesInput[]
    OR?: ExportScheduleScalarWhereWithAggregatesInput[]
    NOT?: ExportScheduleScalarWhereWithAggregatesInput | ExportScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExportSchedule"> | string
    userId?: IntWithAggregatesFilter<"ExportSchedule"> | number
    enabled?: BoolWithAggregatesFilter<"ExportSchedule"> | boolean
    frequency?: StringWithAggregatesFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    deliveryMode?: StringWithAggregatesFilter<"ExportSchedule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExportSchedule"> | Date | string
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: IntFilter<"Permission"> | number
    permissionName?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    users?: UserPermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrderInput | SortOrder
    users?: UserPermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    permissionName?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    description?: StringNullableFilter<"Permission"> | string | null
    users?: UserPermissionListRelationFilter
  }, "id" | "permissionName">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _avg?: PermissionAvgOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
    _sum?: PermissionSumOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Permission"> | number
    permissionName?: StringWithAggregatesFilter<"Permission"> | string
    description?: StringNullableWithAggregatesFilter<"Permission"> | string | null
  }

  export type UserPermissionWhereInput = {
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }

  export type UserPermissionOrderByWithRelationInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    permission?: PermissionOrderByWithRelationInput
  }

  export type UserPermissionWhereUniqueInput = Prisma.AtLeast<{
    userId_permissionId?: UserPermissionUserIdPermissionIdCompoundUniqueInput
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }, "userId_permissionId">

  export type UserPermissionOrderByWithAggregationInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    _count?: UserPermissionCountOrderByAggregateInput
    _avg?: UserPermissionAvgOrderByAggregateInput
    _max?: UserPermissionMaxOrderByAggregateInput
    _min?: UserPermissionMinOrderByAggregateInput
    _sum?: UserPermissionSumOrderByAggregateInput
  }

  export type UserPermissionScalarWhereWithAggregatesInput = {
    AND?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    OR?: UserPermissionScalarWhereWithAggregatesInput[]
    NOT?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"UserPermission"> | number
    permissionId?: IntWithAggregatesFilter<"UserPermission"> | number
    assignedBy?: IntNullableWithAggregatesFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeWithAggregatesFilter<"UserPermission"> | Date | string
  }

  export type CrimeIncidentCreateInput = {
    id?: string
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    incidentType: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    incidentTypeThreatGrp?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrimeIncidentUncheckedCreateInput = {
    id?: string
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    incidentType: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    incidentTypeThreatGrp?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrimeIncidentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    incidentType?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    incidentTypeThreatGrp?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrimeIncidentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    incidentType?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    incidentTypeThreatGrp?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrimeIncidentCreateManyInput = {
    id?: string
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    incidentType: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    incidentTypeThreatGrp?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CrimeIncidentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    incidentType?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    incidentTypeThreatGrp?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrimeIncidentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    incidentType?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    incidentTypeThreatGrp?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayCreateInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUncheckedCreateInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayCreateManyInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
    notifications?: NotificationCreateNestedManyWithoutUploadLogInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
    notifications?: NotificationUncheckedCreateNestedManyWithoutUploadLogInput
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    notifications?: NotificationUpdateManyWithoutUploadLogNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    notifications?: NotificationUncheckedUpdateManyWithoutUploadLogNestedInput
  }

  export type AuditLogCreateManyInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
    uploadLog?: AuditLogCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    uploadLogId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uploadLog?: AuditLogUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    uploadLogId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    uploadLogId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    uploadLogId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleCreateInput = {
    id?: string
    ruleKey: string
    name: string
    description?: string | null
    category: $Enums.NotificationCategory
    conditionType: $Enums.RuleConditionType
    parameters: JsonNullValueInput | InputJsonValue
    severity?: $Enums.NotificationSeverity
    isEnabled?: boolean
    updatedBy?: number | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationRuleUncheckedCreateInput = {
    id?: string
    ruleKey: string
    name: string
    description?: string | null
    category: $Enums.NotificationCategory
    conditionType: $Enums.RuleConditionType
    parameters: JsonNullValueInput | InputJsonValue
    severity?: $Enums.NotificationSeverity
    isEnabled?: boolean
    updatedBy?: number | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ruleKey?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFieldUpdateOperationsInput | $Enums.RuleConditionType
    parameters?: JsonNullValueInput | InputJsonValue
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ruleKey?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFieldUpdateOperationsInput | $Enums.RuleConditionType
    parameters?: JsonNullValueInput | InputJsonValue
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleCreateManyInput = {
    id?: string
    ruleKey: string
    name: string
    description?: string | null
    category: $Enums.NotificationCategory
    conditionType: $Enums.RuleConditionType
    parameters: JsonNullValueInput | InputJsonValue
    severity?: $Enums.NotificationSeverity
    isEnabled?: boolean
    updatedBy?: number | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ruleKey?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFieldUpdateOperationsInput | $Enums.RuleConditionType
    parameters?: JsonNullValueInput | InputJsonValue
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ruleKey?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    conditionType?: EnumRuleConditionTypeFieldUpdateOperationsInput | $Enums.RuleConditionType
    parameters?: JsonNullValueInput | InputJsonValue
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleCreateInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutExportSchedulesInput
  }

  export type ExportScheduleUncheckedCreateInput = {
    id?: string
    userId: number
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExportSchedulesNestedInput
  }

  export type ExportScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleCreateManyInput = {
    id?: string
    userId: number
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionCreateInput = {
    permissionName: string
    description?: string | null
    users?: UserPermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: number
    permissionName: string
    description?: string | null
    users?: UserPermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserPermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserPermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: number
    permissionName: string
    description?: string | null
  }

  export type PermissionUpdateManyMutationInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserPermissionCreateInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutPermissionsInput
    permission: PermissionCreateNestedOneWithoutUsersInput
  }

  export type UserPermissionUncheckedCreateInput = {
    userId: number
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPermissionsNestedInput
    permission?: PermissionUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserPermissionUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyInput = {
    userId: number
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateManyMutationInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CrimeIncidentCountOrderByAggregateInput = {
    id?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    incidentType?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    incidentTypeThreatGrp?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrimeIncidentAvgOrderByAggregateInput = {
    suspectCount?: SortOrder
    victimCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type CrimeIncidentMaxOrderByAggregateInput = {
    id?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    incidentType?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    incidentTypeThreatGrp?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrimeIncidentMinOrderByAggregateInput = {
    id?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    incidentType?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    incidentTypeThreatGrp?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CrimeIncidentSumOrderByAggregateInput = {
    suspectCount?: SortOrder
    victimCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BarangayCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayAvgOrderByAggregateInput = {
    population?: SortOrder
    area?: SortOrder
  }

  export type BarangayMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangaySumOrderByAggregateInput = {
    population?: SortOrder
    area?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
  }

  export type EnumNotificationCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryFilter<$PrismaModel> | $Enums.NotificationCategory
  }

  export type EnumNotificationSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSeverity | EnumNotificationSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationSeverityFilter<$PrismaModel> | $Enums.NotificationSeverity
  }

  export type AuditLogNullableScalarRelationFilter = {
    is?: AuditLogWhereInput | null
    isNot?: AuditLogWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    uploadLogId?: SortOrder
    metadata?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    uploadLogId?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    category?: SortOrder
    severity?: SortOrder
    uploadLogId?: SortOrder
    isRead?: SortOrder
    readAt?: SortOrder
    isArchived?: SortOrder
    archivedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NotificationCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationCategoryFilter<$PrismaModel>
    _max?: NestedEnumNotificationCategoryFilter<$PrismaModel>
  }

  export type EnumNotificationSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSeverity | EnumNotificationSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationSeverityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationSeverityFilter<$PrismaModel>
    _max?: NestedEnumNotificationSeverityFilter<$PrismaModel>
  }

  export type EnumRuleConditionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RuleConditionType | EnumRuleConditionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRuleConditionTypeFilter<$PrismaModel> | $Enums.RuleConditionType
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NotificationRuleCountOrderByAggregateInput = {
    id?: SortOrder
    ruleKey?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    conditionType?: SortOrder
    parameters?: SortOrder
    severity?: SortOrder
    isEnabled?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationRuleAvgOrderByAggregateInput = {
    updatedBy?: SortOrder
  }

  export type NotificationRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    ruleKey?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    conditionType?: SortOrder
    severity?: SortOrder
    isEnabled?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationRuleMinOrderByAggregateInput = {
    id?: SortOrder
    ruleKey?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    conditionType?: SortOrder
    severity?: SortOrder
    isEnabled?: SortOrder
    updatedBy?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationRuleSumOrderByAggregateInput = {
    updatedBy?: SortOrder
  }

  export type EnumRuleConditionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RuleConditionType | EnumRuleConditionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRuleConditionTypeWithAggregatesFilter<$PrismaModel> | $Enums.RuleConditionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRuleConditionTypeFilter<$PrismaModel>
    _max?: NestedEnumRuleConditionTypeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserPermissionListRelationFilter = {
    every?: UserPermissionWhereInput
    some?: UserPermissionWhereInput
    none?: UserPermissionWhereInput
  }

  export type ExportScheduleListRelationFilter = {
    every?: ExportScheduleWhereInput
    some?: ExportScheduleWhereInput
    none?: ExportScheduleWhereInput
  }

  export type UserPermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExportScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ExportScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    deliveryMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ExportScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    deliveryMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    deliveryMode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type UserPermissionUserIdPermissionIdCompoundUniqueInput = {
    userId: number
    permissionId: number
  }

  export type UserPermissionCountOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionAvgOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
  }

  export type UserPermissionMaxOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionMinOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionSumOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NotificationCreateNestedManyWithoutUploadLogInput = {
    create?: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput> | NotificationCreateWithoutUploadLogInput[] | NotificationUncheckedCreateWithoutUploadLogInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUploadLogInput | NotificationCreateOrConnectWithoutUploadLogInput[]
    createMany?: NotificationCreateManyUploadLogInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUploadLogInput = {
    create?: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput> | NotificationCreateWithoutUploadLogInput[] | NotificationUncheckedCreateWithoutUploadLogInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUploadLogInput | NotificationCreateOrConnectWithoutUploadLogInput[]
    createMany?: NotificationCreateManyUploadLogInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUpdateManyWithoutUploadLogNestedInput = {
    create?: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput> | NotificationCreateWithoutUploadLogInput[] | NotificationUncheckedCreateWithoutUploadLogInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUploadLogInput | NotificationCreateOrConnectWithoutUploadLogInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUploadLogInput | NotificationUpsertWithWhereUniqueWithoutUploadLogInput[]
    createMany?: NotificationCreateManyUploadLogInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUploadLogInput | NotificationUpdateWithWhereUniqueWithoutUploadLogInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUploadLogInput | NotificationUpdateManyWithWhereWithoutUploadLogInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUploadLogNestedInput = {
    create?: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput> | NotificationCreateWithoutUploadLogInput[] | NotificationUncheckedCreateWithoutUploadLogInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUploadLogInput | NotificationCreateOrConnectWithoutUploadLogInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUploadLogInput | NotificationUpsertWithWhereUniqueWithoutUploadLogInput[]
    createMany?: NotificationCreateManyUploadLogInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUploadLogInput | NotificationUpdateWithWhereUniqueWithoutUploadLogInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUploadLogInput | NotificationUpdateManyWithWhereWithoutUploadLogInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type AuditLogCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<AuditLogCreateWithoutNotificationsInput, AuditLogUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: AuditLogCreateOrConnectWithoutNotificationsInput
    connect?: AuditLogWhereUniqueInput
  }

  export type EnumNotificationCategoryFieldUpdateOperationsInput = {
    set?: $Enums.NotificationCategory
  }

  export type EnumNotificationSeverityFieldUpdateOperationsInput = {
    set?: $Enums.NotificationSeverity
  }

  export type AuditLogUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<AuditLogCreateWithoutNotificationsInput, AuditLogUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: AuditLogCreateOrConnectWithoutNotificationsInput
    upsert?: AuditLogUpsertWithoutNotificationsInput
    disconnect?: AuditLogWhereInput | boolean
    delete?: AuditLogWhereInput | boolean
    connect?: AuditLogWhereUniqueInput
    update?: XOR<XOR<AuditLogUpdateToOneWithWhereWithoutNotificationsInput, AuditLogUpdateWithoutNotificationsInput>, AuditLogUncheckedUpdateWithoutNotificationsInput>
  }

  export type EnumRuleConditionTypeFieldUpdateOperationsInput = {
    set?: $Enums.RuleConditionType
  }

  export type UserPermissionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type ExportScheduleCreateNestedManyWithoutUserInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
  }

  export type UserPermissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type ExportScheduleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
  }

  export type UserPermissionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutUserInput | UserPermissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutUserInput | UserPermissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutUserInput | UserPermissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type ExportScheduleUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ExportScheduleUpsertWithWhereUniqueWithoutUserInput | ExportScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    set?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    disconnect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    delete?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    update?: ExportScheduleUpdateWithWhereUniqueWithoutUserInput | ExportScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExportScheduleUpdateManyWithWhereWithoutUserInput | ExportScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserPermissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutUserInput | UserPermissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutUserInput | UserPermissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutUserInput | UserPermissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type ExportScheduleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ExportScheduleUpsertWithWhereUniqueWithoutUserInput | ExportScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    set?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    disconnect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    delete?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    update?: ExportScheduleUpdateWithWhereUniqueWithoutUserInput | ExportScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExportScheduleUpdateManyWithWhereWithoutUserInput | ExportScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutExportSchedulesInput = {
    create?: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExportSchedulesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutExportSchedulesNestedInput = {
    create?: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExportSchedulesInput
    upsert?: UserUpsertWithoutExportSchedulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExportSchedulesInput, UserUpdateWithoutExportSchedulesInput>, UserUncheckedUpdateWithoutExportSchedulesInput>
  }

  export type UserPermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type UserPermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type UserPermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutPermissionInput | UserPermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutPermissionInput | UserPermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutPermissionInput | UserPermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type UserPermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutPermissionInput | UserPermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutPermissionInput | UserPermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutPermissionInput | UserPermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    connect?: UserWhereUniqueInput
  }

  export type PermissionCreateNestedOneWithoutUsersInput = {
    create?: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutUsersInput
    connect?: PermissionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    upsert?: UserUpsertWithoutPermissionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPermissionsInput, UserUpdateWithoutPermissionsInput>, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type PermissionUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutUsersInput
    upsert?: PermissionUpsertWithoutUsersInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutUsersInput, PermissionUpdateWithoutUsersInput>, PermissionUncheckedUpdateWithoutUsersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumNotificationCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryFilter<$PrismaModel> | $Enums.NotificationCategory
  }

  export type NestedEnumNotificationSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSeverity | EnumNotificationSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationSeverityFilter<$PrismaModel> | $Enums.NotificationSeverity
  }

  export type NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationCategory | EnumNotificationCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationCategory[] | ListEnumNotificationCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationCategoryWithAggregatesFilter<$PrismaModel> | $Enums.NotificationCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationCategoryFilter<$PrismaModel>
    _max?: NestedEnumNotificationCategoryFilter<$PrismaModel>
  }

  export type NestedEnumNotificationSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationSeverity | EnumNotificationSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationSeverity[] | ListEnumNotificationSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationSeverityWithAggregatesFilter<$PrismaModel> | $Enums.NotificationSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationSeverityFilter<$PrismaModel>
    _max?: NestedEnumNotificationSeverityFilter<$PrismaModel>
  }

  export type NestedEnumRuleConditionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RuleConditionType | EnumRuleConditionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRuleConditionTypeFilter<$PrismaModel> | $Enums.RuleConditionType
  }

  export type NestedEnumRuleConditionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RuleConditionType | EnumRuleConditionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RuleConditionType[] | ListEnumRuleConditionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRuleConditionTypeWithAggregatesFilter<$PrismaModel> | $Enums.RuleConditionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRuleConditionTypeFilter<$PrismaModel>
    _max?: NestedEnumRuleConditionTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NotificationCreateWithoutUploadLogInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUploadLogInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUploadLogInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput>
  }

  export type NotificationCreateManyUploadLogInputEnvelope = {
    data: NotificationCreateManyUploadLogInput | NotificationCreateManyUploadLogInput[]
    skipDuplicates?: boolean
  }

  export type NotificationUpsertWithWhereUniqueWithoutUploadLogInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUploadLogInput, NotificationUncheckedUpdateWithoutUploadLogInput>
    create: XOR<NotificationCreateWithoutUploadLogInput, NotificationUncheckedCreateWithoutUploadLogInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUploadLogInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUploadLogInput, NotificationUncheckedUpdateWithoutUploadLogInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUploadLogInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUploadLogInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    category?: EnumNotificationCategoryFilter<"Notification"> | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFilter<"Notification"> | $Enums.NotificationSeverity
    uploadLogId?: StringNullableFilter<"Notification"> | string | null
    metadata?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    isArchived?: BoolFilter<"Notification"> | boolean
    archivedAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type AuditLogCreateWithoutNotificationsInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogUncheckedCreateWithoutNotificationsInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogCreateOrConnectWithoutNotificationsInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutNotificationsInput, AuditLogUncheckedCreateWithoutNotificationsInput>
  }

  export type AuditLogUpsertWithoutNotificationsInput = {
    update: XOR<AuditLogUpdateWithoutNotificationsInput, AuditLogUncheckedUpdateWithoutNotificationsInput>
    create: XOR<AuditLogCreateWithoutNotificationsInput, AuditLogUncheckedCreateWithoutNotificationsInput>
    where?: AuditLogWhereInput
  }

  export type AuditLogUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: AuditLogWhereInput
    data: XOR<AuditLogUpdateWithoutNotificationsInput, AuditLogUncheckedUpdateWithoutNotificationsInput>
  }

  export type AuditLogUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserPermissionCreateWithoutUserInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    permission: PermissionCreateNestedOneWithoutUsersInput
  }

  export type UserPermissionUncheckedCreateWithoutUserInput = {
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionCreateOrConnectWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
  }

  export type UserPermissionCreateManyUserInputEnvelope = {
    data: UserPermissionCreateManyUserInput | UserPermissionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExportScheduleCreateWithoutUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUncheckedCreateWithoutUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleCreateOrConnectWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    create: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput>
  }

  export type ExportScheduleCreateManyUserInputEnvelope = {
    data: ExportScheduleCreateManyUserInput | ExportScheduleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPermissionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    update: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
  }

  export type UserPermissionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    data: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
  }

  export type UserPermissionUpdateManyWithWhereWithoutUserInput = {
    where: UserPermissionScalarWhereInput
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserPermissionScalarWhereInput = {
    AND?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
    OR?: UserPermissionScalarWhereInput[]
    NOT?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
  }

  export type ExportScheduleUpsertWithWhereUniqueWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    update: XOR<ExportScheduleUpdateWithoutUserInput, ExportScheduleUncheckedUpdateWithoutUserInput>
    create: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput>
  }

  export type ExportScheduleUpdateWithWhereUniqueWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    data: XOR<ExportScheduleUpdateWithoutUserInput, ExportScheduleUncheckedUpdateWithoutUserInput>
  }

  export type ExportScheduleUpdateManyWithWhereWithoutUserInput = {
    where: ExportScheduleScalarWhereInput
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyWithoutUserInput>
  }

  export type ExportScheduleScalarWhereInput = {
    AND?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
    OR?: ExportScheduleScalarWhereInput[]
    NOT?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
    id?: StringFilter<"ExportSchedule"> | string
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    deliveryMode?: StringFilter<"ExportSchedule"> | string
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
  }

  export type UserCreateWithoutExportSchedulesInput = {
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExportSchedulesInput = {
    id?: number
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExportSchedulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
  }

  export type UserUpsertWithoutExportSchedulesInput = {
    update: XOR<UserUpdateWithoutExportSchedulesInput, UserUncheckedUpdateWithoutExportSchedulesInput>
    create: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExportSchedulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExportSchedulesInput, UserUncheckedUpdateWithoutExportSchedulesInput>
  }

  export type UserUpdateWithoutExportSchedulesInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExportSchedulesInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserPermissionCreateWithoutPermissionInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutPermissionsInput
  }

  export type UserPermissionUncheckedCreateWithoutPermissionInput = {
    userId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionCreateOrConnectWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    create: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput>
  }

  export type UserPermissionCreateManyPermissionInputEnvelope = {
    data: UserPermissionCreateManyPermissionInput | UserPermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type UserPermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    update: XOR<UserPermissionUpdateWithoutPermissionInput, UserPermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput>
  }

  export type UserPermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    data: XOR<UserPermissionUpdateWithoutPermissionInput, UserPermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type UserPermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: UserPermissionScalarWhereInput
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type UserCreateWithoutPermissionsInput = {
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPermissionsInput = {
    id?: number
    accountNumber: string
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPermissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
  }

  export type PermissionCreateWithoutUsersInput = {
    permissionName: string
    description?: string | null
  }

  export type PermissionUncheckedCreateWithoutUsersInput = {
    id?: number
    permissionName: string
    description?: string | null
  }

  export type PermissionCreateOrConnectWithoutUsersInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
  }

  export type UserUpsertWithoutPermissionsInput = {
    update: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type UserUpdateWithoutPermissionsInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPermissionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PermissionUpsertWithoutUsersInput = {
    update: XOR<PermissionUpdateWithoutUsersInput, PermissionUncheckedUpdateWithoutUsersInput>
    create: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutUsersInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutUsersInput, PermissionUncheckedUpdateWithoutUsersInput>
  }

  export type PermissionUpdateWithoutUsersInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateManyUploadLogInput = {
    id?: string
    title: string
    message: string
    category: $Enums.NotificationCategory
    severity?: $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    readAt?: Date | string | null
    isArchived?: boolean
    archivedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateWithoutUploadLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUploadLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUploadLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    category?: EnumNotificationCategoryFieldUpdateOperationsInput | $Enums.NotificationCategory
    severity?: EnumNotificationSeverityFieldUpdateOperationsInput | $Enums.NotificationSeverity
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyUserInput = {
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type ExportScheduleCreateManyUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    deliveryMode?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPermissionUpdateWithoutUserInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permission?: PermissionUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserPermissionUncheckedUpdateWithoutUserInput = {
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyWithoutUserInput = {
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryMode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyPermissionInput = {
    userId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateWithoutPermissionInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type UserPermissionUncheckedUpdateWithoutPermissionInput = {
    userId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyWithoutPermissionInput = {
    userId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}