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

export type AddTechniqueInput = {
  flavor: Scalars['ID']['input'];
  technique: Scalars['ID']['input'];
};

export type AddVolumeInput = {
  flavor: Scalars['ID']['input'];
  volume: Scalars['ID']['input'];
};

export type AddWeightInput = {
  flavor: Scalars['ID']['input'];
  weight: Scalars['ID']['input'];
};

export type CreateFlavorInput = {
  name: Scalars['ID']['input'];
};

export type CreatePairingInput = {
  affinity: PairingAffinity;
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
};

export type DeletePairingInput = {
  affinity: PairingAffinity;
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
};

export type Flavor = {
  __typename?: 'Flavor';
  name: Scalars['ID']['output'];
  pairings?: Maybe<PairingSubList>;
  taste?: Maybe<Array<Taste>>;
  technique?: Maybe<Array<Technique>>;
  volume?: Maybe<Array<Volume>>;
  weight?: Maybe<Array<Weight>>;
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
  addTechnique?: Maybe<Technique>;
  addVolume?: Maybe<Volume>;
  addWeight?: Maybe<Weight>;
  createFlavor?: Maybe<Flavor>;
  createPairing: PairingResult;
  createTaste?: Maybe<Taste>;
  createTechnique?: Maybe<Technique>;
  createVolume?: Maybe<Volume>;
  createWeight?: Maybe<Weight>;
  deleteFlavor?: Maybe<Flavor>;
  deletePairing: PairingResult;
  deleteTaste?: Maybe<Taste>;
  deleteTechnique?: Maybe<Technique>;
  deleteVolume?: Maybe<Volume>;
  deleteWeight?: Maybe<Weight>;
  updateFlavor?: Maybe<Flavor>;
  updateTaste?: Maybe<Taste>;
  updateTechnique?: Maybe<Technique>;
  updateVolume?: Maybe<Volume>;
  updateWeight?: Maybe<Weight>;
};


export type MutationAddTasteArgs = {
  input: AddTasteInput;
};


export type MutationAddTechniqueArgs = {
  input: AddTechniqueInput;
};


export type MutationAddVolumeArgs = {
  input: AddVolumeInput;
};


export type MutationAddWeightArgs = {
  input: AddWeightInput;
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


export type MutationCreateTechniqueArgs = {
  name: Scalars['ID']['input'];
};


export type MutationCreateVolumeArgs = {
  name: Scalars['ID']['input'];
};


export type MutationCreateWeightArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteFlavorArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeletePairingArgs = {
  input: DeletePairingInput;
};


export type MutationDeleteTasteArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteTechniqueArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteVolumeArgs = {
  name: Scalars['ID']['input'];
};


export type MutationDeleteWeightArgs = {
  name: Scalars['ID']['input'];
};


export type MutationUpdateFlavorArgs = {
  input: UpdateFlavorInput;
};


export type MutationUpdateTasteArgs = {
  input: UpdateTasteInput;
};


export type MutationUpdateTechniqueArgs = {
  input: UpdateTechniqueInput;
};


export type MutationUpdateVolumeArgs = {
  input: UpdateVolumeInput;
};


export type MutationUpdateWeightArgs = {
  input: UpdateWeightInput;
};

export type Paired = {
  __typename?: 'Paired';
  affinity: PairingAffinity;
  flavor: Flavor;
};

export type Pairing = {
  __typename?: 'Pairing';
  flavor: Flavor;
  paired: Paired;
};

export enum PairingAffinity {
  Asterisk = 'ASTERISK',
  Avoid = 'AVOID',
  Bold = 'BOLD',
  Caps = 'CAPS',
  Regular = 'REGULAR'
}

export type PairingResult = {
  __typename?: 'PairingResult';
  pairing: Pairing;
  success: Scalars['Boolean']['output'];
};

export type PairingSubList = {
  __typename?: 'PairingSubList';
  items: Array<Paired>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  flavor?: Maybe<Flavor>;
  flavors?: Maybe<FlavorSubList>;
  taste?: Maybe<Taste>;
  tastes: Array<Taste>;
  technique?: Maybe<Technique>;
  techniques: Array<Technique>;
  volume?: Maybe<Volume>;
  volumes: Array<Volume>;
  weight?: Maybe<Weight>;
  weights: Array<Weight>;
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


export type QueryTechniqueArgs = {
  name: Scalars['ID']['input'];
};


export type QueryVolumeArgs = {
  name: Scalars['ID']['input'];
};


export type QueryWeightArgs = {
  name: Scalars['ID']['input'];
};

export type Taste = {
  __typename?: 'Taste';
  name: Scalars['ID']['output'];
};

export type Technique = {
  __typename?: 'Technique';
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

export type UpdateTechniqueInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateVolumeInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateWeightInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type Volume = {
  __typename?: 'Volume';
  name: Scalars['ID']['output'];
};

export type Weight = {
  __typename?: 'Weight';
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
  AddTechniqueInput: AddTechniqueInput;
  AddVolumeInput: AddVolumeInput;
  AddWeightInput: AddWeightInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  DeletePairingInput: DeletePairingInput;
  Flavor: ResolverTypeWrapper<Flavor>;
  FlavorSubList: ResolverTypeWrapper<FlavorSubList>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Paired: ResolverTypeWrapper<Paired>;
  Pairing: ResolverTypeWrapper<Pairing>;
  PairingAffinity: PairingAffinity;
  PairingResult: ResolverTypeWrapper<PairingResult>;
  PairingSubList: ResolverTypeWrapper<PairingSubList>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Taste: ResolverTypeWrapper<Taste>;
  Technique: ResolverTypeWrapper<Technique>;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateTasteInput: UpdateTasteInput;
  UpdateTechniqueInput: UpdateTechniqueInput;
  UpdateVolumeInput: UpdateVolumeInput;
  UpdateWeightInput: UpdateWeightInput;
  Volume: ResolverTypeWrapper<Volume>;
  Weight: ResolverTypeWrapper<Weight>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddTasteInput: AddTasteInput;
  AddTechniqueInput: AddTechniqueInput;
  AddVolumeInput: AddVolumeInput;
  AddWeightInput: AddWeightInput;
  Boolean: Scalars['Boolean']['output'];
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  DeletePairingInput: DeletePairingInput;
  Flavor: Flavor;
  FlavorSubList: FlavorSubList;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Paired: Paired;
  Pairing: Pairing;
  PairingResult: PairingResult;
  PairingSubList: PairingSubList;
  Query: {};
  String: Scalars['String']['output'];
  Taste: Taste;
  Technique: Technique;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateTasteInput: UpdateTasteInput;
  UpdateTechniqueInput: UpdateTechniqueInput;
  UpdateVolumeInput: UpdateVolumeInput;
  UpdateWeightInput: UpdateWeightInput;
  Volume: Volume;
  Weight: Weight;
};

export type FlavorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Flavor'] = ResolversParentTypes['Flavor']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairings?: Resolver<Maybe<ResolversTypes['PairingSubList']>, ParentType, ContextType, Partial<FlavorPairingsArgs>>;
  taste?: Resolver<Maybe<Array<ResolversTypes['Taste']>>, ParentType, ContextType>;
  technique?: Resolver<Maybe<Array<ResolversTypes['Technique']>>, ParentType, ContextType>;
  volume?: Resolver<Maybe<Array<ResolversTypes['Volume']>>, ParentType, ContextType>;
  weight?: Resolver<Maybe<Array<ResolversTypes['Weight']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorSubList'] = ResolversParentTypes['FlavorSubList']> = {
  items?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationAddTasteArgs, 'input'>>;
  addTechnique?: Resolver<Maybe<ResolversTypes['Technique']>, ParentType, ContextType, RequireFields<MutationAddTechniqueArgs, 'input'>>;
  addVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationAddVolumeArgs, 'input'>>;
  addWeight?: Resolver<Maybe<ResolversTypes['Weight']>, ParentType, ContextType, RequireFields<MutationAddWeightArgs, 'input'>>;
  createFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationCreateFlavorArgs, 'input'>>;
  createPairing?: Resolver<ResolversTypes['PairingResult'], ParentType, ContextType, RequireFields<MutationCreatePairingArgs, 'input'>>;
  createTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationCreateTasteArgs, 'name'>>;
  createTechnique?: Resolver<Maybe<ResolversTypes['Technique']>, ParentType, ContextType, RequireFields<MutationCreateTechniqueArgs, 'name'>>;
  createVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationCreateVolumeArgs, 'name'>>;
  createWeight?: Resolver<Maybe<ResolversTypes['Weight']>, ParentType, ContextType, RequireFields<MutationCreateWeightArgs, 'name'>>;
  deleteFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationDeleteFlavorArgs, 'name'>>;
  deletePairing?: Resolver<ResolversTypes['PairingResult'], ParentType, ContextType, RequireFields<MutationDeletePairingArgs, 'input'>>;
  deleteTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationDeleteTasteArgs, 'name'>>;
  deleteTechnique?: Resolver<Maybe<ResolversTypes['Technique']>, ParentType, ContextType, RequireFields<MutationDeleteTechniqueArgs, 'name'>>;
  deleteVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationDeleteVolumeArgs, 'name'>>;
  deleteWeight?: Resolver<Maybe<ResolversTypes['Weight']>, ParentType, ContextType, RequireFields<MutationDeleteWeightArgs, 'name'>>;
  updateFlavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<MutationUpdateFlavorArgs, 'input'>>;
  updateTaste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<MutationUpdateTasteArgs, 'input'>>;
  updateTechnique?: Resolver<Maybe<ResolversTypes['Technique']>, ParentType, ContextType, RequireFields<MutationUpdateTechniqueArgs, 'input'>>;
  updateVolume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<MutationUpdateVolumeArgs, 'input'>>;
  updateWeight?: Resolver<Maybe<ResolversTypes['Weight']>, ParentType, ContextType, RequireFields<MutationUpdateWeightArgs, 'input'>>;
};

export type PairedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Paired'] = ResolversParentTypes['Paired']> = {
  affinity?: Resolver<ResolversTypes['PairingAffinity'], ParentType, ContextType>;
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PairingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pairing'] = ResolversParentTypes['Pairing']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  paired?: Resolver<ResolversTypes['Paired'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PairingResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PairingResult'] = ResolversParentTypes['PairingResult']> = {
  pairing?: Resolver<ResolversTypes['Pairing'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PairingSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PairingSubList'] = ResolversParentTypes['PairingSubList']> = {
  items?: Resolver<Array<ResolversTypes['Paired']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  flavor?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType, RequireFields<QueryFlavorArgs, 'name'>>;
  flavors?: Resolver<Maybe<ResolversTypes['FlavorSubList']>, ParentType, ContextType, Partial<QueryFlavorsArgs>>;
  taste?: Resolver<Maybe<ResolversTypes['Taste']>, ParentType, ContextType, RequireFields<QueryTasteArgs, 'name'>>;
  tastes?: Resolver<Array<ResolversTypes['Taste']>, ParentType, ContextType>;
  technique?: Resolver<Maybe<ResolversTypes['Technique']>, ParentType, ContextType, RequireFields<QueryTechniqueArgs, 'name'>>;
  techniques?: Resolver<Array<ResolversTypes['Technique']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<ResolversTypes['Volume']>, ParentType, ContextType, RequireFields<QueryVolumeArgs, 'name'>>;
  volumes?: Resolver<Array<ResolversTypes['Volume']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Weight']>, ParentType, ContextType, RequireFields<QueryWeightArgs, 'name'>>;
  weights?: Resolver<Array<ResolversTypes['Weight']>, ParentType, ContextType>;
};

export type TasteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Taste'] = ResolversParentTypes['Taste']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TechniqueResolvers<ContextType = any, ParentType extends ResolversParentTypes['Technique'] = ResolversParentTypes['Technique']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VolumeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Volume'] = ResolversParentTypes['Volume']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeightResolvers<ContextType = any, ParentType extends ResolversParentTypes['Weight'] = ResolversParentTypes['Weight']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Flavor?: FlavorResolvers<ContextType>;
  FlavorSubList?: FlavorSubListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Paired?: PairedResolvers<ContextType>;
  Pairing?: PairingResolvers<ContextType>;
  PairingResult?: PairingResultResolvers<ContextType>;
  PairingSubList?: PairingSubListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Taste?: TasteResolvers<ContextType>;
  Technique?: TechniqueResolvers<ContextType>;
  Volume?: VolumeResolvers<ContextType>;
  Weight?: WeightResolvers<ContextType>;
};

