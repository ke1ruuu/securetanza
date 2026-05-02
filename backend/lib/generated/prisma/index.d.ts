
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
 * Model UploadLog
 * 
 */
export type UploadLog = $Result.DefaultSelection<Prisma.$UploadLogPayload>

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
   * `prisma.uploadLog`: Exposes CRUD operations for the **UploadLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UploadLogs
    * const uploadLogs = await prisma.uploadLog.findMany()
    * ```
    */
  get uploadLog(): Prisma.UploadLogDelegate<ExtArgs, ClientOptions>;
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
    UploadLog: 'UploadLog'
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
      modelProps: "crimeIncident" | "barangay" | "uploadLog"
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
      UploadLog: {
        payload: Prisma.$UploadLogPayload<ExtArgs>
        fields: Prisma.UploadLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UploadLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UploadLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          findFirst: {
            args: Prisma.UploadLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UploadLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          findMany: {
            args: Prisma.UploadLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>[]
          }
          create: {
            args: Prisma.UploadLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          createMany: {
            args: Prisma.UploadLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UploadLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>[]
          }
          delete: {
            args: Prisma.UploadLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          update: {
            args: Prisma.UploadLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          deleteMany: {
            args: Prisma.UploadLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UploadLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UploadLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>[]
          }
          upsert: {
            args: Prisma.UploadLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadLogPayload>
          }
          aggregate: {
            args: Prisma.UploadLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUploadLog>
          }
          groupBy: {
            args: Prisma.UploadLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<UploadLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.UploadLogCountArgs<ExtArgs>
            result: $Utils.Optional<UploadLogCountAggregateOutputType> | number
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
    uploadLog?: UploadLogOmit
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
   * Model UploadLog
   */

  export type AggregateUploadLog = {
    _count: UploadLogCountAggregateOutputType | null
    _avg: UploadLogAvgAggregateOutputType | null
    _sum: UploadLogSumAggregateOutputType | null
    _min: UploadLogMinAggregateOutputType | null
    _max: UploadLogMaxAggregateOutputType | null
  }

  export type UploadLogAvgAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type UploadLogSumAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type UploadLogMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    status: string | null
    errorMessage: string | null
    uploadedBy: string | null
    uploadedAt: Date | null
  }

  export type UploadLogMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    status: string | null
    errorMessage: string | null
    uploadedBy: string | null
    uploadedAt: Date | null
  }

  export type UploadLogCountAggregateOutputType = {
    id: number
    fileName: number
    fileSize: number
    recordsImported: number
    status: number
    errorMessage: number
    uploadedBy: number
    uploadedAt: number
    _all: number
  }


  export type UploadLogAvgAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type UploadLogSumAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type UploadLogMinAggregateInputType = {
    id?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    status?: true
    errorMessage?: true
    uploadedBy?: true
    uploadedAt?: true
  }

  export type UploadLogMaxAggregateInputType = {
    id?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    status?: true
    errorMessage?: true
    uploadedBy?: true
    uploadedAt?: true
  }

  export type UploadLogCountAggregateInputType = {
    id?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    status?: true
    errorMessage?: true
    uploadedBy?: true
    uploadedAt?: true
    _all?: true
  }

  export type UploadLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadLog to aggregate.
     */
    where?: UploadLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadLogs to fetch.
     */
    orderBy?: UploadLogOrderByWithRelationInput | UploadLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UploadLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UploadLogs
    **/
    _count?: true | UploadLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UploadLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UploadLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UploadLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UploadLogMaxAggregateInputType
  }

  export type GetUploadLogAggregateType<T extends UploadLogAggregateArgs> = {
        [P in keyof T & keyof AggregateUploadLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUploadLog[P]>
      : GetScalarType<T[P], AggregateUploadLog[P]>
  }




  export type UploadLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadLogWhereInput
    orderBy?: UploadLogOrderByWithAggregationInput | UploadLogOrderByWithAggregationInput[]
    by: UploadLogScalarFieldEnum[] | UploadLogScalarFieldEnum
    having?: UploadLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UploadLogCountAggregateInputType | true
    _avg?: UploadLogAvgAggregateInputType
    _sum?: UploadLogSumAggregateInputType
    _min?: UploadLogMinAggregateInputType
    _max?: UploadLogMaxAggregateInputType
  }

  export type UploadLogGroupByOutputType = {
    id: string
    fileName: string
    fileSize: number
    recordsImported: number
    status: string
    errorMessage: string | null
    uploadedBy: string | null
    uploadedAt: Date
    _count: UploadLogCountAggregateOutputType | null
    _avg: UploadLogAvgAggregateOutputType | null
    _sum: UploadLogSumAggregateOutputType | null
    _min: UploadLogMinAggregateOutputType | null
    _max: UploadLogMaxAggregateOutputType | null
  }

  type GetUploadLogGroupByPayload<T extends UploadLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UploadLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UploadLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UploadLogGroupByOutputType[P]>
            : GetScalarType<T[P], UploadLogGroupByOutputType[P]>
        }
      >
    >


  export type UploadLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    status?: boolean
    errorMessage?: boolean
    uploadedBy?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["uploadLog"]>

  export type UploadLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    status?: boolean
    errorMessage?: boolean
    uploadedBy?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["uploadLog"]>

  export type UploadLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    status?: boolean
    errorMessage?: boolean
    uploadedBy?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["uploadLog"]>

  export type UploadLogSelectScalar = {
    id?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    status?: boolean
    errorMessage?: boolean
    uploadedBy?: boolean
    uploadedAt?: boolean
  }

  export type UploadLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileName" | "fileSize" | "recordsImported" | "status" | "errorMessage" | "uploadedBy" | "uploadedAt", ExtArgs["result"]["uploadLog"]>

  export type $UploadLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UploadLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      fileSize: number
      recordsImported: number
      status: string
      errorMessage: string | null
      uploadedBy: string | null
      uploadedAt: Date
    }, ExtArgs["result"]["uploadLog"]>
    composites: {}
  }

  type UploadLogGetPayload<S extends boolean | null | undefined | UploadLogDefaultArgs> = $Result.GetResult<Prisma.$UploadLogPayload, S>

  type UploadLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UploadLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UploadLogCountAggregateInputType | true
    }

  export interface UploadLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UploadLog'], meta: { name: 'UploadLog' } }
    /**
     * Find zero or one UploadLog that matches the filter.
     * @param {UploadLogFindUniqueArgs} args - Arguments to find a UploadLog
     * @example
     * // Get one UploadLog
     * const uploadLog = await prisma.uploadLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UploadLogFindUniqueArgs>(args: SelectSubset<T, UploadLogFindUniqueArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UploadLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UploadLogFindUniqueOrThrowArgs} args - Arguments to find a UploadLog
     * @example
     * // Get one UploadLog
     * const uploadLog = await prisma.uploadLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UploadLogFindUniqueOrThrowArgs>(args: SelectSubset<T, UploadLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UploadLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogFindFirstArgs} args - Arguments to find a UploadLog
     * @example
     * // Get one UploadLog
     * const uploadLog = await prisma.uploadLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UploadLogFindFirstArgs>(args?: SelectSubset<T, UploadLogFindFirstArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UploadLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogFindFirstOrThrowArgs} args - Arguments to find a UploadLog
     * @example
     * // Get one UploadLog
     * const uploadLog = await prisma.uploadLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UploadLogFindFirstOrThrowArgs>(args?: SelectSubset<T, UploadLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UploadLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UploadLogs
     * const uploadLogs = await prisma.uploadLog.findMany()
     * 
     * // Get first 10 UploadLogs
     * const uploadLogs = await prisma.uploadLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const uploadLogWithIdOnly = await prisma.uploadLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UploadLogFindManyArgs>(args?: SelectSubset<T, UploadLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UploadLog.
     * @param {UploadLogCreateArgs} args - Arguments to create a UploadLog.
     * @example
     * // Create one UploadLog
     * const UploadLog = await prisma.uploadLog.create({
     *   data: {
     *     // ... data to create a UploadLog
     *   }
     * })
     * 
     */
    create<T extends UploadLogCreateArgs>(args: SelectSubset<T, UploadLogCreateArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UploadLogs.
     * @param {UploadLogCreateManyArgs} args - Arguments to create many UploadLogs.
     * @example
     * // Create many UploadLogs
     * const uploadLog = await prisma.uploadLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UploadLogCreateManyArgs>(args?: SelectSubset<T, UploadLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UploadLogs and returns the data saved in the database.
     * @param {UploadLogCreateManyAndReturnArgs} args - Arguments to create many UploadLogs.
     * @example
     * // Create many UploadLogs
     * const uploadLog = await prisma.uploadLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UploadLogs and only return the `id`
     * const uploadLogWithIdOnly = await prisma.uploadLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UploadLogCreateManyAndReturnArgs>(args?: SelectSubset<T, UploadLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UploadLog.
     * @param {UploadLogDeleteArgs} args - Arguments to delete one UploadLog.
     * @example
     * // Delete one UploadLog
     * const UploadLog = await prisma.uploadLog.delete({
     *   where: {
     *     // ... filter to delete one UploadLog
     *   }
     * })
     * 
     */
    delete<T extends UploadLogDeleteArgs>(args: SelectSubset<T, UploadLogDeleteArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UploadLog.
     * @param {UploadLogUpdateArgs} args - Arguments to update one UploadLog.
     * @example
     * // Update one UploadLog
     * const uploadLog = await prisma.uploadLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UploadLogUpdateArgs>(args: SelectSubset<T, UploadLogUpdateArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UploadLogs.
     * @param {UploadLogDeleteManyArgs} args - Arguments to filter UploadLogs to delete.
     * @example
     * // Delete a few UploadLogs
     * const { count } = await prisma.uploadLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UploadLogDeleteManyArgs>(args?: SelectSubset<T, UploadLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UploadLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UploadLogs
     * const uploadLog = await prisma.uploadLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UploadLogUpdateManyArgs>(args: SelectSubset<T, UploadLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UploadLogs and returns the data updated in the database.
     * @param {UploadLogUpdateManyAndReturnArgs} args - Arguments to update many UploadLogs.
     * @example
     * // Update many UploadLogs
     * const uploadLog = await prisma.uploadLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UploadLogs and only return the `id`
     * const uploadLogWithIdOnly = await prisma.uploadLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends UploadLogUpdateManyAndReturnArgs>(args: SelectSubset<T, UploadLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UploadLog.
     * @param {UploadLogUpsertArgs} args - Arguments to update or create a UploadLog.
     * @example
     * // Update or create a UploadLog
     * const uploadLog = await prisma.uploadLog.upsert({
     *   create: {
     *     // ... data to create a UploadLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UploadLog we want to update
     *   }
     * })
     */
    upsert<T extends UploadLogUpsertArgs>(args: SelectSubset<T, UploadLogUpsertArgs<ExtArgs>>): Prisma__UploadLogClient<$Result.GetResult<Prisma.$UploadLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UploadLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogCountArgs} args - Arguments to filter UploadLogs to count.
     * @example
     * // Count the number of UploadLogs
     * const count = await prisma.uploadLog.count({
     *   where: {
     *     // ... the filter for the UploadLogs we want to count
     *   }
     * })
    **/
    count<T extends UploadLogCountArgs>(
      args?: Subset<T, UploadLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UploadLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UploadLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UploadLogAggregateArgs>(args: Subset<T, UploadLogAggregateArgs>): Prisma.PrismaPromise<GetUploadLogAggregateType<T>>

    /**
     * Group by UploadLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadLogGroupByArgs} args - Group by arguments.
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
      T extends UploadLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UploadLogGroupByArgs['orderBy'] }
        : { orderBy?: UploadLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UploadLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUploadLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UploadLog model
   */
  readonly fields: UploadLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UploadLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UploadLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UploadLog model
   */
  interface UploadLogFieldRefs {
    readonly id: FieldRef<"UploadLog", 'String'>
    readonly fileName: FieldRef<"UploadLog", 'String'>
    readonly fileSize: FieldRef<"UploadLog", 'Int'>
    readonly recordsImported: FieldRef<"UploadLog", 'Int'>
    readonly status: FieldRef<"UploadLog", 'String'>
    readonly errorMessage: FieldRef<"UploadLog", 'String'>
    readonly uploadedBy: FieldRef<"UploadLog", 'String'>
    readonly uploadedAt: FieldRef<"UploadLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UploadLog findUnique
   */
  export type UploadLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter, which UploadLog to fetch.
     */
    where: UploadLogWhereUniqueInput
  }

  /**
   * UploadLog findUniqueOrThrow
   */
  export type UploadLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter, which UploadLog to fetch.
     */
    where: UploadLogWhereUniqueInput
  }

  /**
   * UploadLog findFirst
   */
  export type UploadLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter, which UploadLog to fetch.
     */
    where?: UploadLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadLogs to fetch.
     */
    orderBy?: UploadLogOrderByWithRelationInput | UploadLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadLogs.
     */
    cursor?: UploadLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadLogs.
     */
    distinct?: UploadLogScalarFieldEnum | UploadLogScalarFieldEnum[]
  }

  /**
   * UploadLog findFirstOrThrow
   */
  export type UploadLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter, which UploadLog to fetch.
     */
    where?: UploadLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadLogs to fetch.
     */
    orderBy?: UploadLogOrderByWithRelationInput | UploadLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadLogs.
     */
    cursor?: UploadLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadLogs.
     */
    distinct?: UploadLogScalarFieldEnum | UploadLogScalarFieldEnum[]
  }

  /**
   * UploadLog findMany
   */
  export type UploadLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter, which UploadLogs to fetch.
     */
    where?: UploadLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadLogs to fetch.
     */
    orderBy?: UploadLogOrderByWithRelationInput | UploadLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UploadLogs.
     */
    cursor?: UploadLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadLogs.
     */
    distinct?: UploadLogScalarFieldEnum | UploadLogScalarFieldEnum[]
  }

  /**
   * UploadLog create
   */
  export type UploadLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * The data needed to create a UploadLog.
     */
    data: XOR<UploadLogCreateInput, UploadLogUncheckedCreateInput>
  }

  /**
   * UploadLog createMany
   */
  export type UploadLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UploadLogs.
     */
    data: UploadLogCreateManyInput | UploadLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UploadLog createManyAndReturn
   */
  export type UploadLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * The data used to create many UploadLogs.
     */
    data: UploadLogCreateManyInput | UploadLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UploadLog update
   */
  export type UploadLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * The data needed to update a UploadLog.
     */
    data: XOR<UploadLogUpdateInput, UploadLogUncheckedUpdateInput>
    /**
     * Choose, which UploadLog to update.
     */
    where: UploadLogWhereUniqueInput
  }

  /**
   * UploadLog updateMany
   */
  export type UploadLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UploadLogs.
     */
    data: XOR<UploadLogUpdateManyMutationInput, UploadLogUncheckedUpdateManyInput>
    /**
     * Filter which UploadLogs to update
     */
    where?: UploadLogWhereInput
    /**
     * Limit how many UploadLogs to update.
     */
    limit?: number
  }

  /**
   * UploadLog updateManyAndReturn
   */
  export type UploadLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * The data used to update UploadLogs.
     */
    data: XOR<UploadLogUpdateManyMutationInput, UploadLogUncheckedUpdateManyInput>
    /**
     * Filter which UploadLogs to update
     */
    where?: UploadLogWhereInput
    /**
     * Limit how many UploadLogs to update.
     */
    limit?: number
  }

  /**
   * UploadLog upsert
   */
  export type UploadLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * The filter to search for the UploadLog to update in case it exists.
     */
    where: UploadLogWhereUniqueInput
    /**
     * In case the UploadLog found by the `where` argument doesn't exist, create a new UploadLog with this data.
     */
    create: XOR<UploadLogCreateInput, UploadLogUncheckedCreateInput>
    /**
     * In case the UploadLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UploadLogUpdateInput, UploadLogUncheckedUpdateInput>
  }

  /**
   * UploadLog delete
   */
  export type UploadLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
    /**
     * Filter which UploadLog to delete.
     */
    where: UploadLogWhereUniqueInput
  }

  /**
   * UploadLog deleteMany
   */
  export type UploadLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadLogs to delete
     */
    where?: UploadLogWhereInput
    /**
     * Limit how many UploadLogs to delete.
     */
    limit?: number
  }

  /**
   * UploadLog without action
   */
  export type UploadLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadLog
     */
    select?: UploadLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UploadLog
     */
    omit?: UploadLogOmit<ExtArgs> | null
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


  export const UploadLogScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    fileSize: 'fileSize',
    recordsImported: 'recordsImported',
    status: 'status',
    errorMessage: 'errorMessage',
    uploadedBy: 'uploadedBy',
    uploadedAt: 'uploadedAt'
  };

  export type UploadLogScalarFieldEnum = (typeof UploadLogScalarFieldEnum)[keyof typeof UploadLogScalarFieldEnum]


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

  export type UploadLogWhereInput = {
    AND?: UploadLogWhereInput | UploadLogWhereInput[]
    OR?: UploadLogWhereInput[]
    NOT?: UploadLogWhereInput | UploadLogWhereInput[]
    id?: StringFilter<"UploadLog"> | string
    fileName?: StringFilter<"UploadLog"> | string
    fileSize?: IntFilter<"UploadLog"> | number
    recordsImported?: IntFilter<"UploadLog"> | number
    status?: StringFilter<"UploadLog"> | string
    errorMessage?: StringNullableFilter<"UploadLog"> | string | null
    uploadedBy?: StringNullableFilter<"UploadLog"> | string | null
    uploadedAt?: DateTimeFilter<"UploadLog"> | Date | string
  }

  export type UploadLogOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
  }

  export type UploadLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UploadLogWhereInput | UploadLogWhereInput[]
    OR?: UploadLogWhereInput[]
    NOT?: UploadLogWhereInput | UploadLogWhereInput[]
    fileName?: StringFilter<"UploadLog"> | string
    fileSize?: IntFilter<"UploadLog"> | number
    recordsImported?: IntFilter<"UploadLog"> | number
    status?: StringFilter<"UploadLog"> | string
    errorMessage?: StringNullableFilter<"UploadLog"> | string | null
    uploadedBy?: StringNullableFilter<"UploadLog"> | string | null
    uploadedAt?: DateTimeFilter<"UploadLog"> | Date | string
  }, "id">

  export type UploadLogOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    _count?: UploadLogCountOrderByAggregateInput
    _avg?: UploadLogAvgOrderByAggregateInput
    _max?: UploadLogMaxOrderByAggregateInput
    _min?: UploadLogMinOrderByAggregateInput
    _sum?: UploadLogSumOrderByAggregateInput
  }

  export type UploadLogScalarWhereWithAggregatesInput = {
    AND?: UploadLogScalarWhereWithAggregatesInput | UploadLogScalarWhereWithAggregatesInput[]
    OR?: UploadLogScalarWhereWithAggregatesInput[]
    NOT?: UploadLogScalarWhereWithAggregatesInput | UploadLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UploadLog"> | string
    fileName?: StringWithAggregatesFilter<"UploadLog"> | string
    fileSize?: IntWithAggregatesFilter<"UploadLog"> | number
    recordsImported?: IntWithAggregatesFilter<"UploadLog"> | number
    status?: StringWithAggregatesFilter<"UploadLog"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"UploadLog"> | string | null
    uploadedBy?: StringNullableWithAggregatesFilter<"UploadLog"> | string | null
    uploadedAt?: DateTimeWithAggregatesFilter<"UploadLog"> | Date | string
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

  export type UploadLogCreateInput = {
    id?: string
    fileName: string
    fileSize: number
    recordsImported: number
    status?: string
    errorMessage?: string | null
    uploadedBy?: string | null
    uploadedAt?: Date | string
  }

  export type UploadLogUncheckedCreateInput = {
    id?: string
    fileName: string
    fileSize: number
    recordsImported: number
    status?: string
    errorMessage?: string | null
    uploadedBy?: string | null
    uploadedAt?: Date | string
  }

  export type UploadLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    recordsImported?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    recordsImported?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadLogCreateManyInput = {
    id?: string
    fileName: string
    fileSize: number
    recordsImported: number
    status?: string
    errorMessage?: string | null
    uploadedBy?: string | null
    uploadedAt?: Date | string
  }

  export type UploadLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    recordsImported?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    recordsImported?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type UploadLogCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    uploadedBy?: SortOrder
    uploadedAt?: SortOrder
  }

  export type UploadLogAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
  }

  export type UploadLogMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    uploadedBy?: SortOrder
    uploadedAt?: SortOrder
  }

  export type UploadLogMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    uploadedBy?: SortOrder
    uploadedAt?: SortOrder
  }

  export type UploadLogSumOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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