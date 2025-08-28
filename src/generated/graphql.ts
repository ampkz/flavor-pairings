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

export type AddTasteInput = {
  flavor: Scalars['ID']['input'];
  taste: Scalars['ID']['input'];
};

export type AddVolumeInput = {
  flavor: Scalars['ID']['input'];
  volume: Scalars['ID']['input'];
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
  pairings?: Maybe<PairingSubList>;
  taste?: Maybe<Array<Taste>>;
};


export type FlavorPairingsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type FlavorSubList = {
  __typename?: 'FlavorSubList';
  items: Array<Flavor>;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addTaste?: Maybe<Taste>;
  addVolume?: Maybe<Volume>;
  createFlavor?: Maybe<Flavor>;
  createPairing?: Maybe<Array<Maybe<Flavor>>>;
  createTaste?: Maybe<Taste>;
  createVolume?: Maybe<Volume>;
  deleteFlavor?: Maybe<Flavor>;
  deleteTaste?: Maybe<Taste>;
  deleteVolume?: Maybe<Volume>;
  updateFlavor?: Maybe<Flavor>;
  updateTaste?: Maybe<Taste>;
  updateVolume?: Maybe<Volume>;
};


export type MutationAddTasteArgs = {
  input: AddTasteInput;
};


export type MutationAddVolumeArgs = {
  input: AddVolumeInput;
};


export type MutationCreateFlavorArgs = {
  input: CreateFlavorInput;
};


export type MutationCreatePairingArgs = {
  input: CreatePairingInput;
};


export type MutationCreateTasteArgs = {
  name: Scalars['ID']['input'];
};


export type MutationCreateVolumeArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteFlavorArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteTasteArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteVolumeArgs = {
  name: Scalars['ID']['input'];
};


export type MutationUpdateFlavorArgs = {
  input: UpdateFlavorInput;
};


export type MutationUpdateTasteArgs = {
  input: UpdateTasteInput;
};


export type MutationUpdateVolumeArgs = {
  input: UpdateVolumeInput;
};

export type PairingSubList = {
  __typename?: 'PairingSubList';
  items: Array<Flavor>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  flavor?: Maybe<Flavor>;
  flavors?: Maybe<FlavorSubList>;
  taste?: Maybe<Taste>;
  tastes: Array<Taste>;
  volume?: Maybe<Volume>;
  volumes: Array<Volume>;
};


export type QueryFlavorArgs = {
  name: Scalars['ID']['input'];
};


export type QueryFlavorsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTasteArgs = {
  name: Scalars['ID']['input'];
};


export type QueryVolumeArgs = {
  name: Scalars['ID']['input'];
};

export type Taste = {
  __typename?: 'Taste';
  name: Scalars['ID']['output'];
};

export type UpdateFlavorInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateTasteInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateVolumeInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type Volume = {
  __typename?: 'Volume';
  name: Scalars['ID']['output'];
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
  AddTasteInput: AddTasteInput;
  AddVolumeInput: AddVolumeInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  Flavor: ResolverTypeWrapper<Flavor>;
  FlavorSubList: ResolverTypeWrapper<FlavorSubList>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PairingSubList: ResolverTypeWrapper<PairingSubList>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Taste: ResolverTypeWrapper<Taste>;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateTasteInput: UpdateTasteInput;
  UpdateVolumeInput: UpdateVolumeInput;
  Volume: ResolverTypeWrapper<Volume>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddTasteInput: AddTasteInput;
  AddVolumeInput: AddVolumeInput;
  Boolean: Scalars['Boolean']['output'];
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  Flavor: Flavor;
  FlavorSubList: FlavorSubList;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  PairingSubList: PairingSubList;
  Query: {};
  String: Scalars['String']['output'];
  Taste: Taste;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateTasteInput: UpdateTasteInput;
  UpdateVolumeInput: UpdateVolumeInput;
  Volume: Volume;
};

export type FlavorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Flavor'] = ResolversParentTypes['Flavor']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairings?: Resolver<Maybe<ResolversTypes['PairingSubList']>, ParentType, ContextType, Partial<FlavorPairingsArgs>>;
  taste?: Resolver<Maybe<Array<ResolversTypes['Taste']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorSubList'] = ResolversParentTypes['FlavorSubList']> = {
  items?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationAddTasteArgs, 'input'>>;
  addVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationAddVolumeArgs, 'input'>>;
  createFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationCreateFlavorArgs, 'input'>>;
  createPairing?: Resolver<Maybe<Array<Maybe<ResolversTypes['Flavor']>>>, ParentType, ContextType, RequireFields<MutationCreatePairingArgs, 'input'>>;
  createTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationCreateTasteArgs, 'name'>>;
  createVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationCreateVolumeArgs, 'name'>>;
  deleteFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationDeleteFlavorArgs, 'name'>>;
  deleteTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationDeleteTasteArgs, 'name'>>;
  deleteVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationDeleteVolumeArgs, 'name'>>;
  updateFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationUpdateFlavorArgs, 'input'>>;
  updateTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationUpdateTasteArgs, 'input'>>;
  updateVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationUpdateVolumeArgs, 'input'>>;
};

export type PairingSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PairingSubList'] = ResolversParentTypes['PairingSubList']> = {
  items?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  flavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<QueryFlavorArgs, 'name'>>;
  flavors?: Resolver<Maybe<ResolversTypes['FlavorSubList']>, ParentType, ContextType, Partial<QueryFlavorsArgs>>;
  taste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<QueryTasteArgs, 'name'>>;
  tastes?: Resolver<Array<ResolversTypes['Taste']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<QueryVolumeArgs, 'name'>>;
  volumes?: Resolver<Array<ResolversTypes['Volume']>, ParentType, ContextType>;
};

export type TasteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Taste'] = ResolversParentTypes['Taste']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VolumeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Volume'] = ResolversParentTypes['Volume']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Flavor?: FlavorResolvers<ContextType>;
  FlavorSubList?: FlavorSubListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PairingSubList?: PairingSubListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Taste?: TasteResolvers<ContextType>;
  Volume?: VolumeResolvers<ContextType>;
};

