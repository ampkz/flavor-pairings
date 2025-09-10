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
  affinity: PairingAffinity;
  especially?: InputMaybe<Scalars['String']['input']>;
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
};

export type DeletePairingInput = {
  affinity: PairingAffinity;
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
};

export type ExperimentalPairing = {
  __typename?: 'ExperimentalPairing';
  paths: Array<Path>;
  uniqueFlavors: Array<Flavor>;
};

export type ExperimentalPairingInput = {
  flavor1: Scalars['ID']['input'];
  flavor2: Scalars['ID']['input'];
  maxLength?: Scalars['Int']['input'];
};

export type Flavor = {
  __typename?: 'Flavor';
  name: Scalars['ID']['output'];
  pairings?: Maybe<PairingSubList>;
  see?: Maybe<Flavor>;
  taste?: Maybe<Array<Taste>>;
  technique?: Maybe<Array<Technique>>;
  tips?: Maybe<Scalars['String']['output']>;
  volume?: Maybe<Array<Volume>>;
  weight?: Maybe<Array<Weight>>;
};


export type FlavorPairingsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type FlavorReferenceInput = {
  from: Scalars['ID']['input'];
  to: Scalars['ID']['input'];
};

export type FlavorReferenceResult = {
  __typename?: 'FlavorReferenceResult';
  from: Flavor;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  to: Flavor;
};

export type FlavorResult = {
  __typename?: 'FlavorResult';
  flavor: Flavor;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type FlavorSubList = {
  __typename?: 'FlavorSubList';
  items: Array<Flavor>;
  totalCount: Scalars['Int']['output'];
};

export type FlavorTasteInput = {
  flavor: Scalars['ID']['input'];
  taste: Scalars['ID']['input'];
};

export type FlavorTasteResult = {
  __typename?: 'FlavorTasteResult';
  flavor: Flavor;
  success: Scalars['Boolean']['output'];
  taste: Taste;
};

export type FlavorTechniqueInput = {
  flavor: Scalars['ID']['input'];
  technique: Scalars['ID']['input'];
};

export type FlavorTechniqueResult = {
  __typename?: 'FlavorTechniqueResult';
  flavor: Flavor;
  success: Scalars['Boolean']['output'];
  technique: Technique;
};

export type FlavorTipsResult = {
  __typename?: 'FlavorTipsResult';
  flavor: Flavor;
  success: Scalars['Boolean']['output'];
  tips?: Maybe<Scalars['String']['output']>;
};

export type FlavorVolumeInput = {
  flavor: Scalars['ID']['input'];
  volume: Scalars['ID']['input'];
};

export type FlavorVolumeResult = {
  __typename?: 'FlavorVolumeResult';
  flavor: Flavor;
  success: Scalars['Boolean']['output'];
  volume: Volume;
};

export type FlavorWeightInput = {
  flavor: Scalars['ID']['input'];
  weight: Scalars['ID']['input'];
};

export type FlavorWeightResult = {
  __typename?: 'FlavorWeightResult';
  flavor: Flavor;
  success: Scalars['Boolean']['output'];
  weight: Weight;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFlavorTaste: FlavorTasteResult;
  addFlavorTechnique: FlavorTechniqueResult;
  addFlavorVolume: FlavorVolumeResult;
  addFlavorWeight: FlavorWeightResult;
  createFlavor: FlavorResult;
  createFlavorReference: FlavorReferenceResult;
  createPairing: PairingResult;
  createTaste: TasteResult;
  createTechnique: TechniqueResult;
  createVolume: VolumeResult;
  createWeight: WeightResult;
  deleteFlavor: FlavorResult;
  deleteFlavorReference: FlavorReferenceResult;
  deletePairing: PairingResult;
  deleteTaste: TasteResult;
  deleteTechnique?: Maybe<TechniqueResult>;
  deleteVolume?: Maybe<VolumeResult>;
  deleteWeight?: Maybe<WeightResult>;
  flavorTips: FlavorTipsResult;
  removeFlavorTaste: FlavorTasteResult;
  removeFlavorTechnique: FlavorTechniqueResult;
  removeFlavorVolume: FlavorVolumeResult;
  removeFlavorWeight: FlavorWeightResult;
  updateFlavor: UpdateFlavorResult;
  updateTaste: UpdateTasteResult;
  updateTechnique: UpdateTechniqueResult;
  updateVolume: UpdateVolumeResult;
  updateWeight: UpdateWeightResult;
};


export type MutationAddFlavorTasteArgs = {
  input: FlavorTasteInput;
};


export type MutationAddFlavorTechniqueArgs = {
  input: FlavorTechniqueInput;
};


export type MutationAddFlavorVolumeArgs = {
  input: FlavorVolumeInput;
};


export type MutationAddFlavorWeightArgs = {
  input: FlavorWeightInput;
};


export type MutationCreateFlavorArgs = {
  input: CreateFlavorInput;
};


export type MutationCreateFlavorReferenceArgs = {
  input: FlavorReferenceInput;
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


export type MutationDeleteFlavorReferenceArgs = {
  input: FlavorReferenceInput;
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


export type MutationFlavorTipsArgs = {
  name: Scalars['ID']['input'];
  tips?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveFlavorTasteArgs = {
  input: FlavorTasteInput;
};


export type MutationRemoveFlavorTechniqueArgs = {
  input: FlavorTechniqueInput;
};


export type MutationRemoveFlavorVolumeArgs = {
  input: FlavorVolumeInput;
};


export type MutationRemoveFlavorWeightArgs = {
  input: FlavorWeightInput;
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
  especially?: Maybe<Scalars['String']['output']>;
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

export type Path = {
  __typename?: 'Path';
  pairings: Array<Pairing>;
};

export type Query = {
  __typename?: 'Query';
  experimentalPairing?: Maybe<ExperimentalPairing>;
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


export type QueryExperimentalPairingArgs = {
  input: ExperimentalPairingInput;
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

export type TasteResult = {
  __typename?: 'TasteResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  taste: Taste;
};

export type Technique = {
  __typename?: 'Technique';
  name: Scalars['ID']['output'];
};

export type TechniqueResult = {
  __typename?: 'TechniqueResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  technique: Technique;
};

export type UpdateFlavorInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateFlavorResult = {
  __typename?: 'UpdateFlavorResult';
  flavor: Flavor;
  previousFlavor: Flavor;
  success: Scalars['Boolean']['output'];
};

export type UpdateTasteInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateTasteResult = {
  __typename?: 'UpdateTasteResult';
  previousTaste: Taste;
  success: Scalars['Boolean']['output'];
  taste: Taste;
};

export type UpdateTechniqueInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateTechniqueResult = {
  __typename?: 'UpdateTechniqueResult';
  previousTechnique: Technique;
  success: Scalars['Boolean']['output'];
  technique: Technique;
};

export type UpdateVolumeInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateVolumeResult = {
  __typename?: 'UpdateVolumeResult';
  previousVolume: Volume;
  success: Scalars['Boolean']['output'];
  volume: Volume;
};

export type UpdateWeightInput = {
  name: Scalars['ID']['input'];
  updatedName: Scalars['ID']['input'];
};

export type UpdateWeightResult = {
  __typename?: 'UpdateWeightResult';
  previousWeight: Weight;
  success: Scalars['Boolean']['output'];
  weight: Weight;
};

export type Volume = {
  __typename?: 'Volume';
  name: Scalars['ID']['output'];
};

export type VolumeResult = {
  __typename?: 'VolumeResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  volume: Volume;
};

export type Weight = {
  __typename?: 'Weight';
  name: Scalars['ID']['output'];
};

export type WeightResult = {
  __typename?: 'WeightResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  weight: Weight;
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
  DeletePairingInput: DeletePairingInput;
  ExperimentalPairing: ResolverTypeWrapper<ExperimentalPairing>;
  ExperimentalPairingInput: ExperimentalPairingInput;
  Flavor: ResolverTypeWrapper<Flavor>;
  FlavorReferenceInput: FlavorReferenceInput;
  FlavorReferenceResult: ResolverTypeWrapper<FlavorReferenceResult>;
  FlavorResult: ResolverTypeWrapper<FlavorResult>;
  FlavorSubList: ResolverTypeWrapper<FlavorSubList>;
  FlavorTasteInput: FlavorTasteInput;
  FlavorTasteResult: ResolverTypeWrapper<FlavorTasteResult>;
  FlavorTechniqueInput: FlavorTechniqueInput;
  FlavorTechniqueResult: ResolverTypeWrapper<FlavorTechniqueResult>;
  FlavorTipsResult: ResolverTypeWrapper<FlavorTipsResult>;
  FlavorVolumeInput: FlavorVolumeInput;
  FlavorVolumeResult: ResolverTypeWrapper<FlavorVolumeResult>;
  FlavorWeightInput: FlavorWeightInput;
  FlavorWeightResult: ResolverTypeWrapper<FlavorWeightResult>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Paired: ResolverTypeWrapper<Paired>;
  Pairing: ResolverTypeWrapper<Pairing>;
  PairingAffinity: PairingAffinity;
  PairingResult: ResolverTypeWrapper<PairingResult>;
  PairingSubList: ResolverTypeWrapper<PairingSubList>;
  Path: ResolverTypeWrapper<Path>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Taste: ResolverTypeWrapper<Taste>;
  TasteResult: ResolverTypeWrapper<TasteResult>;
  Technique: ResolverTypeWrapper<Technique>;
  TechniqueResult: ResolverTypeWrapper<TechniqueResult>;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateFlavorResult: ResolverTypeWrapper<UpdateFlavorResult>;
  UpdateTasteInput: UpdateTasteInput;
  UpdateTasteResult: ResolverTypeWrapper<UpdateTasteResult>;
  UpdateTechniqueInput: UpdateTechniqueInput;
  UpdateTechniqueResult: ResolverTypeWrapper<UpdateTechniqueResult>;
  UpdateVolumeInput: UpdateVolumeInput;
  UpdateVolumeResult: ResolverTypeWrapper<UpdateVolumeResult>;
  UpdateWeightInput: UpdateWeightInput;
  UpdateWeightResult: ResolverTypeWrapper<UpdateWeightResult>;
  Volume: ResolverTypeWrapper<Volume>;
  VolumeResult: ResolverTypeWrapper<VolumeResult>;
  Weight: ResolverTypeWrapper<Weight>;
  WeightResult: ResolverTypeWrapper<WeightResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateFlavorInput: CreateFlavorInput;
  CreatePairingInput: CreatePairingInput;
  DeletePairingInput: DeletePairingInput;
  ExperimentalPairing: ExperimentalPairing;
  ExperimentalPairingInput: ExperimentalPairingInput;
  Flavor: Flavor;
  FlavorReferenceInput: FlavorReferenceInput;
  FlavorReferenceResult: FlavorReferenceResult;
  FlavorResult: FlavorResult;
  FlavorSubList: FlavorSubList;
  FlavorTasteInput: FlavorTasteInput;
  FlavorTasteResult: FlavorTasteResult;
  FlavorTechniqueInput: FlavorTechniqueInput;
  FlavorTechniqueResult: FlavorTechniqueResult;
  FlavorTipsResult: FlavorTipsResult;
  FlavorVolumeInput: FlavorVolumeInput;
  FlavorVolumeResult: FlavorVolumeResult;
  FlavorWeightInput: FlavorWeightInput;
  FlavorWeightResult: FlavorWeightResult;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Paired: Paired;
  Pairing: Pairing;
  PairingResult: PairingResult;
  PairingSubList: PairingSubList;
  Path: Path;
  Query: {};
  String: Scalars['String']['output'];
  Taste: Taste;
  TasteResult: TasteResult;
  Technique: Technique;
  TechniqueResult: TechniqueResult;
  UpdateFlavorInput: UpdateFlavorInput;
  UpdateFlavorResult: UpdateFlavorResult;
  UpdateTasteInput: UpdateTasteInput;
  UpdateTasteResult: UpdateTasteResult;
  UpdateTechniqueInput: UpdateTechniqueInput;
  UpdateTechniqueResult: UpdateTechniqueResult;
  UpdateVolumeInput: UpdateVolumeInput;
  UpdateVolumeResult: UpdateVolumeResult;
  UpdateWeightInput: UpdateWeightInput;
  UpdateWeightResult: UpdateWeightResult;
  Volume: Volume;
  VolumeResult: VolumeResult;
  Weight: Weight;
  WeightResult: WeightResult;
};

export type ExperimentalPairingResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExperimentalPairing'] = ResolversParentTypes['ExperimentalPairing']> = {
  paths?: Resolver<Array<ResolversTypes['Path']>, ParentType, ContextType>;
  uniqueFlavors?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Flavor'] = ResolversParentTypes['Flavor']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pairings?: Resolver<Maybe<ResolversTypes['PairingSubList']>, ParentType, ContextType, Partial<FlavorPairingsArgs>>;
  see?: Resolver<Maybe<ResolversTypes['Flavor']>, ParentType, ContextType>;
  taste?: Resolver<Maybe<Array<ResolversTypes['Taste']>>, ParentType, ContextType>;
  technique?: Resolver<Maybe<Array<ResolversTypes['Technique']>>, ParentType, ContextType>;
  tips?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  volume?: Resolver<Maybe<Array<ResolversTypes['Volume']>>, ParentType, ContextType>;
  weight?: Resolver<Maybe<Array<ResolversTypes['Weight']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorReferenceResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorReferenceResult'] = ResolversParentTypes['FlavorReferenceResult']> = {
  from?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorResult'] = ResolversParentTypes['FlavorResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorSubList'] = ResolversParentTypes['FlavorSubList']> = {
  items?: Resolver<Array<ResolversTypes['Flavor']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorTasteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorTasteResult'] = ResolversParentTypes['FlavorTasteResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  taste?: Resolver<ResolversTypes['Taste'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorTechniqueResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorTechniqueResult'] = ResolversParentTypes['FlavorTechniqueResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  technique?: Resolver<ResolversTypes['Technique'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorTipsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorTipsResult'] = ResolversParentTypes['FlavorTipsResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tips?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorVolumeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorVolumeResult'] = ResolversParentTypes['FlavorVolumeResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Volume'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FlavorWeightResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FlavorWeightResult'] = ResolversParentTypes['FlavorWeightResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Weight'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addFlavorTaste?: Resolver<ResolversTypes['FlavorTasteResult'], ParentType, ContextType, RequireFields<MutationAddFlavorTasteArgs, 'input'>>;
  addFlavorTechnique?: Resolver<ResolversTypes['FlavorTechniqueResult'], ParentType, ContextType, RequireFields<MutationAddFlavorTechniqueArgs, 'input'>>;
  addFlavorVolume?: Resolver<ResolversTypes['FlavorVolumeResult'], ParentType, ContextType, RequireFields<MutationAddFlavorVolumeArgs, 'input'>>;
  addFlavorWeight?: Resolver<ResolversTypes['FlavorWeightResult'], ParentType, ContextType, RequireFields<MutationAddFlavorWeightArgs, 'input'>>;
  createFlavor?: Resolver<ResolversTypes['FlavorResult'], ParentType, ContextType, RequireFields<MutationCreateFlavorArgs, 'input'>>;
  createFlavorReference?: Resolver<ResolversTypes['FlavorReferenceResult'], ParentType, ContextType, RequireFields<MutationCreateFlavorReferenceArgs, 'input'>>;
  createPairing?: Resolver<ResolversTypes['PairingResult'], ParentType, ContextType, RequireFields<MutationCreatePairingArgs, 'input'>>;
  createTaste?: Resolver<ResolversTypes['TasteResult'], ParentType, ContextType, RequireFields<MutationCreateTasteArgs, 'name'>>;
  createTechnique?: Resolver<ResolversTypes['TechniqueResult'], ParentType, ContextType, RequireFields<MutationCreateTechniqueArgs, 'name'>>;
  createVolume?: Resolver<ResolversTypes['VolumeResult'], ParentType, ContextType, RequireFields<MutationCreateVolumeArgs, 'name'>>;
  createWeight?: Resolver<ResolversTypes['WeightResult'], ParentType, ContextType, RequireFields<MutationCreateWeightArgs, 'name'>>;
  deleteFlavor?: Resolver<ResolversTypes['FlavorResult'], ParentType, ContextType, RequireFields<MutationDeleteFlavorArgs, 'name'>>;
  deleteFlavorReference?: Resolver<ResolversTypes['FlavorReferenceResult'], ParentType, ContextType, RequireFields<MutationDeleteFlavorReferenceArgs, 'input'>>;
  deletePairing?: Resolver<ResolversTypes['PairingResult'], ParentType, ContextType, RequireFields<MutationDeletePairingArgs, 'input'>>;
  deleteTaste?: Resolver<ResolversTypes['TasteResult'], ParentType, ContextType, RequireFields<MutationDeleteTasteArgs, 'name'>>;
  deleteTechnique?: Resolver<Maybe<ResolversTypes['TechniqueResult']>, ParentType, ContextType, RequireFields<MutationDeleteTechniqueArgs, 'name'>>;
  deleteVolume?: Resolver<Maybe<ResolversTypes['VolumeResult']>, ParentType, ContextType, RequireFields<MutationDeleteVolumeArgs, 'name'>>;
  deleteWeight?: Resolver<Maybe<ResolversTypes['WeightResult']>, ParentType, ContextType, RequireFields<MutationDeleteWeightArgs, 'name'>>;
  flavorTips?: Resolver<ResolversTypes['FlavorTipsResult'], ParentType, ContextType, RequireFields<MutationFlavorTipsArgs, 'name'>>;
  removeFlavorTaste?: Resolver<ResolversTypes['FlavorTasteResult'], ParentType, ContextType, RequireFields<MutationRemoveFlavorTasteArgs, 'input'>>;
  removeFlavorTechnique?: Resolver<ResolversTypes['FlavorTechniqueResult'], ParentType, ContextType, RequireFields<MutationRemoveFlavorTechniqueArgs, 'input'>>;
  removeFlavorVolume?: Resolver<ResolversTypes['FlavorVolumeResult'], ParentType, ContextType, RequireFields<MutationRemoveFlavorVolumeArgs, 'input'>>;
  removeFlavorWeight?: Resolver<ResolversTypes['FlavorWeightResult'], ParentType, ContextType, RequireFields<MutationRemoveFlavorWeightArgs, 'input'>>;
  updateFlavor?: Resolver<ResolversTypes['UpdateFlavorResult'], ParentType, ContextType, RequireFields<MutationUpdateFlavorArgs, 'input'>>;
  updateTaste?: Resolver<ResolversTypes['UpdateTasteResult'], ParentType, ContextType, RequireFields<MutationUpdateTasteArgs, 'input'>>;
  updateTechnique?: Resolver<ResolversTypes['UpdateTechniqueResult'], ParentType, ContextType, RequireFields<MutationUpdateTechniqueArgs, 'input'>>;
  updateVolume?: Resolver<ResolversTypes['UpdateVolumeResult'], ParentType, ContextType, RequireFields<MutationUpdateVolumeArgs, 'input'>>;
  updateWeight?: Resolver<ResolversTypes['UpdateWeightResult'], ParentType, ContextType, RequireFields<MutationUpdateWeightArgs, 'input'>>;
};

export type PairedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Paired'] = ResolversParentTypes['Paired']> = {
  affinity?: Resolver<ResolversTypes['PairingAffinity'], ParentType, ContextType>;
  especially?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type PathResolvers<ContextType = any, ParentType extends ResolversParentTypes['Path'] = ResolversParentTypes['Path']> = {
  pairings?: Resolver<Array<ResolversTypes['Pairing']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  experimentalPairing?: Resolver<Maybe<ResolversTypes['ExperimentalPairing']>, ParentType, ContextType, RequireFields<QueryExperimentalPairingArgs, 'input'>>;
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

export type TasteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TasteResult'] = ResolversParentTypes['TasteResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  taste?: Resolver<ResolversTypes['Taste'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TechniqueResolvers<ContextType = any, ParentType extends ResolversParentTypes['Technique'] = ResolversParentTypes['Technique']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TechniqueResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TechniqueResult'] = ResolversParentTypes['TechniqueResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  technique?: Resolver<ResolversTypes['Technique'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateFlavorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateFlavorResult'] = ResolversParentTypes['UpdateFlavorResult']> = {
  flavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  previousFlavor?: Resolver<ResolversTypes['Flavor'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTasteResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTasteResult'] = ResolversParentTypes['UpdateTasteResult']> = {
  previousTaste?: Resolver<ResolversTypes['Taste'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  taste?: Resolver<ResolversTypes['Taste'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateTechniqueResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTechniqueResult'] = ResolversParentTypes['UpdateTechniqueResult']> = {
  previousTechnique?: Resolver<ResolversTypes['Technique'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  technique?: Resolver<ResolversTypes['Technique'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateVolumeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateVolumeResult'] = ResolversParentTypes['UpdateVolumeResult']> = {
  previousVolume?: Resolver<ResolversTypes['Volume'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Volume'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateWeightResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateWeightResult'] = ResolversParentTypes['UpdateWeightResult']> = {
  previousWeight?: Resolver<ResolversTypes['Weight'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Weight'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VolumeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Volume'] = ResolversParentTypes['Volume']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VolumeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['VolumeResult'] = ResolversParentTypes['VolumeResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Volume'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeightResolvers<ContextType = any, ParentType extends ResolversParentTypes['Weight'] = ResolversParentTypes['Weight']> = {
  name?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeightResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeightResult'] = ResolversParentTypes['WeightResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Weight'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ExperimentalPairing?: ExperimentalPairingResolvers<ContextType>;
  Flavor?: FlavorResolvers<ContextType>;
  FlavorReferenceResult?: FlavorReferenceResultResolvers<ContextType>;
  FlavorResult?: FlavorResultResolvers<ContextType>;
  FlavorSubList?: FlavorSubListResolvers<ContextType>;
  FlavorTasteResult?: FlavorTasteResultResolvers<ContextType>;
  FlavorTechniqueResult?: FlavorTechniqueResultResolvers<ContextType>;
  FlavorTipsResult?: FlavorTipsResultResolvers<ContextType>;
  FlavorVolumeResult?: FlavorVolumeResultResolvers<ContextType>;
  FlavorWeightResult?: FlavorWeightResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Paired?: PairedResolvers<ContextType>;
  Pairing?: PairingResolvers<ContextType>;
  PairingResult?: PairingResultResolvers<ContextType>;
  PairingSubList?: PairingSubListResolvers<ContextType>;
  Path?: PathResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Taste?: TasteResolvers<ContextType>;
  TasteResult?: TasteResultResolvers<ContextType>;
  Technique?: TechniqueResolvers<ContextType>;
  TechniqueResult?: TechniqueResultResolvers<ContextType>;
  UpdateFlavorResult?: UpdateFlavorResultResolvers<ContextType>;
  UpdateTasteResult?: UpdateTasteResultResolvers<ContextType>;
  UpdateTechniqueResult?: UpdateTechniqueResultResolvers<ContextType>;
  UpdateVolumeResult?: UpdateVolumeResultResolvers<ContextType>;
  UpdateWeightResult?: UpdateWeightResultResolvers<ContextType>;
  Volume?: VolumeResolvers<ContextType>;
  VolumeResult?: VolumeResultResolvers<ContextType>;
  Weight?: WeightResolvers<ContextType>;
  WeightResult?: WeightResultResolvers<ContextType>;
};

