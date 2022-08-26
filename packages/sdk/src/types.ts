export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An extended ISO 8601 date string in the format YYYY-MM-DD. */
  AWSDate: any;
  /** An extended ISO 8601 date and time string in the format YYYY-MM-DDThh:mm:ss.sssZ. */
  AWSDateTime: any;
  /** An email address in the format local-part@domain-part as defined by RFC 822. */
  AWSEmail: any;
  /** A phone number. This value is stored as a string. Phone numbers can contain either spaces or hyphens to separate digit groups. Phone numbers without a country code are assumed to be US/North American numbers adhering to the North American Numbering Plan (NANP). */
  AWSPhone: any;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String'];
  country: Scalars['String'];
  name?: Maybe<Name>;
  postalCode: Scalars['String'];
  state: Scalars['String'];
  street1: Scalars['String'];
  street2?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  city: Scalars['String'];
  country: Scalars['String'];
  name?: InputMaybe<NameInput>;
  postalCode: Scalars['String'];
  state: Scalars['String'];
  street1: Scalars['String'];
  street2?: InputMaybe<Scalars['String']>;
};

export type Allergen = {
  __typename?: 'Allergen';
  id: Scalars['ID'];
  name: Scalars['String'];
  rxcui?: Maybe<Scalars['ID']>;
};

export type AllergenFilter = {
  name?: InputMaybe<Scalars['String']>;
};

export type AllergenInput = {
  allergenId: Scalars['ID'];
  comment?: InputMaybe<Scalars['String']>;
  onset?: InputMaybe<Scalars['AWSDate']>;
};

export type Catalog = {
  __typename?: 'Catalog';
  id: Scalars['ID'];
  name: Scalars['String'];
  treatments: Array<Maybe<Treatment>>;
};

export type Client = {
  __typename?: 'Client';
  appType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
};

export enum ConceptType {
  Drug = 'DRUG',
  Package = 'PACKAGE',
  Product = 'PRODUCT'
}

export type Diagnosis = {
  __typename?: 'Diagnosis';
  code: Scalars['String'];
  name: Scalars['String'];
  type: DiagnosisType;
};

export enum DiagnosisType {
  Icd10 = 'ICD10'
}

export enum DispenseUnit {
  /** Each */
  Ea = 'EA',
  /** Grams */
  Gr = 'GR',
  /** Milliliters */
  Ml = 'ML'
}

export type DrugFilter = {
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Fill = {
  __typename?: 'Fill';
  filledAt?: Maybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  order: Order;
  prescription?: Maybe<Prescription>;
  requestedAt: Scalars['AWSDateTime'];
  state: FillState;
  treatment: Treatment;
};

export type FillInput = {
  /** ID of a `Prescription` (optional for OTCs) */
  prescriptionId?: InputMaybe<Scalars['ID']>;
  /** ID of a `Treatment` (optional if `prescriptionId` is set) */
  treatmentId?: InputMaybe<Scalars['ID']>;
};

export enum FillState {
  Error = 'ERROR',
  New = 'NEW',
  Processing = 'PROCESSING',
  Received = 'RECEIVED',
  Sent = 'SENT'
}

export type LatLongSearch = {
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  /** Search radius in miles */
  radius?: InputMaybe<Scalars['Int']>;
};

export type MedHistoryInput = {
  active: Scalars['Boolean'];
  comment?: InputMaybe<Scalars['String']>;
  medicationId: Scalars['ID'];
};

export type Medication = Treatment & {
  __typename?: 'Medication';
  brandName?: Maybe<Scalars['String']>;
  codes: TreatmentCodes;
  concept: ConceptType;
  description?: Maybe<Scalars['String']>;
  form?: Maybe<Scalars['String']>;
  genericName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  manufacturer?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  strength?: Maybe<Scalars['String']>;
  /** Null implies a medication cant be prescribed */
  type?: Maybe<MedicationType>;
};

export type MedicationFilter = {
  drug?: InputMaybe<DrugFilter>;
  package?: InputMaybe<PackageFilter>;
  product?: InputMaybe<ProductFilter>;
};

export enum MedicationType {
  /** Over-the-Counter */
  Otc = 'OTC',
  /** Prescription */
  Rx = 'RX'
}

export type Mutation = {
  __typename?: 'Mutation';
  addToCatalog: Medication;
  /** Create a new `Order` for a specific `Patient` */
  createOrder: Order;
  /** Create a new `Patient` record */
  createPatient: Patient;
  /** Create a new `Prescription` associated with the logged in prescriber. A `patientId` is returned after creating a `Patient` with the `createPatient` mutation. `medicationId`s can be searched with the `medications` query. */
  createPrescription: Prescription;
  createWebhookConfig: WebhookConfig;
  deleteWebhookConfig?: Maybe<Scalars['Boolean']>;
  removePatientAllergy: Patient;
  rotateSecret: Client;
  /** Update an existing `Patient` record */
  updatePatient: Patient;
  updateWebhookConfig: WebhookConfig;
};


export type MutationAddToCatalogArgs = {
  catalogId: Scalars['ID'];
  medicationId?: InputMaybe<Scalars['ID']>;
  ndc?: InputMaybe<Scalars['String']>;
};


export type MutationCreateOrderArgs = {
  address: AddressInput;
  externalId?: InputMaybe<Scalars['ID']>;
  fills: Array<FillInput>;
  patientId: Scalars['ID'];
  pharmacyId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreatePatientArgs = {
  address?: InputMaybe<AddressInput>;
  allergies?: InputMaybe<Array<InputMaybe<AllergenInput>>>;
  dateOfBirth: Scalars['AWSDate'];
  email?: InputMaybe<Scalars['AWSEmail']>;
  externalId?: InputMaybe<Scalars['ID']>;
  gender?: InputMaybe<Scalars['String']>;
  medicationHistory?: InputMaybe<Array<InputMaybe<MedHistoryInput>>>;
  name: NameInput;
  phone: Scalars['AWSPhone'];
  sex: SexType;
};


export type MutationCreatePrescriptionArgs = {
  daysSupply: Scalars['Int'];
  diagnoses?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  dispenseAsWritten: Scalars['Boolean'];
  dispenseQuantity: Scalars['Int'];
  dispenseUnit: DispenseUnit;
  effectiveDate?: InputMaybe<Scalars['AWSDate']>;
  externalId?: InputMaybe<Scalars['ID']>;
  instructions: Scalars['String'];
  medicationId: Scalars['ID'];
  notes?: InputMaybe<Scalars['String']>;
  patientId: Scalars['ID'];
  refillsAllowed: Scalars['Int'];
};


export type MutationCreateWebhookConfigArgs = {
  filters?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  sharedSecret?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type MutationDeleteWebhookConfigArgs = {
  id: Scalars['String'];
};


export type MutationRemovePatientAllergyArgs = {
  allergenId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationRotateSecretArgs = {
  id: Scalars['ID'];
};


export type MutationUpdatePatientArgs = {
  allergies?: InputMaybe<Array<InputMaybe<AllergenInput>>>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  externalId?: InputMaybe<Scalars['ID']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  medicationHistory?: InputMaybe<Array<InputMaybe<MedHistoryInput>>>;
  name?: InputMaybe<NameInput>;
  phone?: InputMaybe<Scalars['AWSPhone']>;
};


export type MutationUpdateWebhookConfigArgs = {
  filters?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  sharedSecret?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type Name = {
  __typename?: 'Name';
  first: Scalars['String'];
  /** Convenience method for getting a formated name */
  full: Scalars['String'];
  last: Scalars['String'];
  middle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type NameInput = {
  first: Scalars['String'];
  last: Scalars['String'];
  middle?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  address?: Maybe<Address>;
  createdAt: Scalars['AWSDateTime'];
  externalId?: Maybe<Scalars['ID']>;
  fills: Array<Fill>;
  id: Scalars['ID'];
  patient: Patient;
  /** The pharmacy that owns this `Order` */
  pharmacy?: Maybe<Pharmacy>;
  state: OrderState;
};

export type OrderFilter = {
  patientId?: InputMaybe<Scalars['ID']>;
  patientName?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<OrderState>;
};

export enum OrderState {
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Error = 'ERROR',
  New = 'NEW',
  Processing = 'PROCESSING',
  Ready = 'READY'
}

export enum OrgType {
  Pharmacy = 'PHARMACY',
  Prescriber = 'PRESCRIBER'
}

export type Organization = {
  __typename?: 'Organization';
  NPI?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['AWSEmail']>;
  fax?: Maybe<Scalars['AWSPhone']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  phone?: Maybe<Scalars['AWSPhone']>;
  type?: Maybe<OrgType>;
};

export type PackageFilter = {
  code?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  product: Scalars['ID'];
  type?: InputMaybe<MedicationType>;
};

export type Patient = {
  __typename?: 'Patient';
  address?: Maybe<Address>;
  allergies?: Maybe<Array<Maybe<PatientAllergy>>>;
  dateOfBirth: Scalars['AWSDate'];
  email?: Maybe<Scalars['AWSEmail']>;
  externalId?: Maybe<Scalars['ID']>;
  gender?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  medicationHistory?: Maybe<Array<Maybe<PatientMedication>>>;
  name: Name;
  orders?: Maybe<Array<Maybe<Order>>>;
  phone: Scalars['AWSPhone'];
  prescriptions?: Maybe<Array<Maybe<Prescription>>>;
  sex: SexType;
};


export type PatientOrdersArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<PatientOrderFilter>;
  first?: InputMaybe<Scalars['Int']>;
};


export type PatientPrescriptionsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<PatientPrescriptionFilter>;
  first?: InputMaybe<Scalars['Int']>;
};

export type PatientAllergy = {
  __typename?: 'PatientAllergy';
  allergen: Allergen;
  comment?: Maybe<Scalars['String']>;
  onset?: Maybe<Scalars['AWSDate']>;
};

export type PatientFilter = {
  name?: InputMaybe<Scalars['String']>;
};

export type PatientMedication = {
  __typename?: 'PatientMedication';
  active: Scalars['Boolean'];
  comment?: Maybe<Scalars['String']>;
  medication: Medication;
  prescription?: Maybe<Prescription>;
};

export type PatientOrderFilter = {
  state?: InputMaybe<OrderState>;
};

export type PatientPrescriptionFilter = {
  prescriberId?: InputMaybe<Scalars['ID']>;
  state?: InputMaybe<PrescriptionState>;
};

export type Pharmacy = {
  __typename?: 'Pharmacy';
  NPI?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  fax?: Maybe<Scalars['AWSPhone']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  name2?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['AWSPhone']>;
};

export type Prescription = PrescriptionTemplate & {
  __typename?: 'Prescription';
  daysSupply: Scalars['Int'];
  diagnoses?: Maybe<Array<Maybe<Diagnosis>>>;
  dispenseAsWritten: Scalars['Boolean'];
  dispenseQuantity: Scalars['Int'];
  dispenseUnit: DispenseUnit;
  effectiveDate: Scalars['AWSDate'];
  expirationDate: Scalars['AWSDate'];
  externalId?: Maybe<Scalars['ID']>;
  fills: Array<Maybe<Fill>>;
  id: Scalars['ID'];
  instructions: Scalars['String'];
  medication: Medication;
  notes?: Maybe<Scalars['String']>;
  patient: Patient;
  prescriber: Provider;
  refillsAllowed: Scalars['Int'];
  refillsRemaining: Scalars['Int'];
  state: PrescriptionState;
  writtenAt: Scalars['AWSDateTime'];
};

export type PrescriptionFilter = {
  patientId?: InputMaybe<Scalars['ID']>;
  patientName?: InputMaybe<Scalars['String']>;
  prescriberId?: InputMaybe<Scalars['ID']>;
  state?: InputMaybe<PrescriptionState>;
};

export enum PrescriptionState {
  Canceled = 'CANCELED',
  Depleted = 'DEPLETED',
  Error = 'ERROR',
  Expired = 'EXPIRED',
  Processing = 'PROCESSING',
  Ready = 'READY'
}

export type PrescriptionTemplate = {
  daysSupply: Scalars['Int'];
  dispenseAsWritten: Scalars['Boolean'];
  dispenseQuantity: Scalars['Int'];
  dispenseUnit: DispenseUnit;
  instructions: Scalars['String'];
  medication: Medication;
  notes?: Maybe<Scalars['String']>;
  refillsAllowed: Scalars['Int'];
};

export type ProductFilter = {
  code?: InputMaybe<Scalars['String']>;
  drug: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MedicationType>;
};

export type Provider = {
  __typename?: 'Provider';
  NPI?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  email: Scalars['AWSEmail'];
  externalId?: Maybe<Scalars['ID']>;
  fax?: Maybe<Scalars['AWSPhone']>;
  id: Scalars['ID'];
  name: Name;
  organizations: Array<Organization>;
  phone: Scalars['AWSPhone'];
};

export type Query = {
  __typename?: 'Query';
  /** Get list of allergens, filtered optionally by name (fuzzy search) */
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  /** Get a catalog by id */
  catalog?: Maybe<Catalog>;
  /** Get `Medication` catalogs associated with caller's organization */
  catalogs: Array<Maybe<Catalog>>;
  clients: Array<Maybe<Client>>;
  /** Get a fill */
  fill?: Maybe<Fill>;
  /** Get list of medications */
  medications: Array<Maybe<Medication>>;
  /** Get an order by ID */
  order?: Maybe<Order>;
  /** Get all orders for a patient */
  orders: Array<Maybe<Order>>;
  /** Get the organization the user is currently authenticated with */
  organization: Organization;
  /** Get all the orgnaizations the user belongs to */
  organizations: Array<Maybe<Organization>>;
  /** Get a patient by ID */
  patient?: Maybe<Patient>;
  /** Get all patients associated with caller's organization */
  patients: Array<Maybe<Patient>>;
  /** Search pharmacies */
  pharmacies: Array<Maybe<Organization>>;
  /** Get a pharmacy by ID */
  pharmacy?: Maybe<Pharmacy>;
  /** Get a prescription by ID */
  prescription?: Maybe<Prescription>;
  /** Get all prescriptions associated with caller's organization */
  prescriptions: Array<Maybe<Prescription>>;
  user: User;
  webhooks?: Maybe<Array<Maybe<WebhookConfig>>>;
};


export type QueryAllergensArgs = {
  filter?: InputMaybe<AllergenFilter>;
};


export type QueryCatalogArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryFillArgs = {
  id: Scalars['ID'];
};


export type QueryMedicationsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<MedicationFilter>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<OrderFilter>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryPatientArgs = {
  id: Scalars['ID'];
};


export type QueryPatientsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<PatientFilter>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryPharmaciesArgs = {
  after?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<LatLongSearch>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryPharmacyArgs = {
  id: Scalars['ID'];
};


export type QueryPrescriptionArgs = {
  id: Scalars['ID'];
};


export type QueryPrescriptionsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<PrescriptionFilter>;
  first?: InputMaybe<Scalars['Int']>;
};

export type Role = {
  __typename?: 'Role';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export enum SexType {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type Treatment = {
  codes: TreatmentCodes;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type TreatmentCodes = {
  __typename?: 'TreatmentCodes';
  SKU?: Maybe<Scalars['String']>;
  packageNDC?: Maybe<Scalars['String']>;
  productNDC?: Maybe<Scalars['String']>;
  rxcui?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  externalId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: Maybe<Name>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type WebhookConfig = {
  __typename?: 'WebhookConfig';
  filters?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};