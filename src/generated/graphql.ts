import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateFlavorInput = {
  name: Scalars['ID']['input'];
};

export type CreatePairingInput = {
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
};

export type Flavor = {
  __typename?: 'Flavor';
  name: Scalars['ID']['output'];
  pairings?: Maybe<Array<Flavor>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFlavor?: Maybe<Flavor>;
  createPairing?: Maybe<Array<Maybe<Flavor>>>;
  deleteFlavor?: Maybe<Flavor>;
  updateFlavor?: Maybe<Flavor>;
};


export type MutationCreateFlavorArgs = {
  input: CreateFlavorInput;
};


export type MutationCreatePairingArgs = {
  input: CreatePairingInput;
};


export type MutationDeleteFlavorArgs = {
  name: Scalars['ID']['input'];
};


export type MutationUpdateFlavorArgs = {
  input: UpdateFlavorInput;
};

export type Query = {
  __typename?: 'Query';
  flavor?: Maybe<Flavor>;
  flavors: Array<Flavor>;
};


export type QueryFlavorArgs = {
  name: Scalars['ID']['input'];
};

export type UpdateFlavorInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  Flavor: ResolverTypeWrapper<Flavor>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateFlavorInput: UpdateFlavorInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  Flavor: Flavor;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  UpdateFlavorInput: UpdateFlavorInput;
};

export type FlavorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Flavor'] = ResolversParentTypes['Flavor']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairings?: Resolver<Maybe<Array<ResolversTypes['Flavor']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationCreateFlavorArgs, 'input'>>;
  createPairing?: Resolver<Maybe<Array<Maybe<ResolversTypes['Flavor']>>>, ParentType, ContextType, RequireFields<MutationCreatePairingArgs, 'input'>>;
  deleteFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationDeleteFlavorArgs, 'name'>>;
  updateFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationUpdateFlavorArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  flavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<QueryFlavorArgs, 'name'>>;
  flavors?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Flavor?: FlavorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

