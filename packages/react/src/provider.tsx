import { ApolloError, DocumentNode } from "@apollo/client";
import { useStore } from "@nanostores/react";
import { GraphQLError } from "graphql";
import { action, map } from "nanostores";
import { PhotonClient } from "@photonhealth/sdk";
import {
  Allergen,
  AllergenFilter,
  Catalog,
  Client,
  LatLongSearch,
  Maybe,
  Medication,
  MedicationFilter,
  Order,
  Organization,
  Patient,
  Pharmacy,
  Prescription,
  PrescriptionState,
  WebhookConfig,
} from "@photonhealth/sdk/dist/types";
import { useEffect, createContext, useContext, useReducer } from "react";

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "INITIALISED":
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
        isLoading: false,
        error: undefined,
      };
    case "HANDLE_REDIRECT_COMPLETE":
      if (state.user?.updated_at === action.user?.updated_at) {
        return state;
      }
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
      };
    case "GET_ACCESS_TOKEN_COMPLETE":
      if (state.user?.updated_at === action.user?.updated_at) {
        return state;
      }
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
      };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: undefined,
      };
  }
};

const defaultOnRedirectCallback = (appState?: any): void => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export type GetCatalogReturn = {
  catalog: Catalog;
  loading: boolean;
  error?: ApolloError;
  refetch: PhotonClient["clinical"]["catalog"]["getCatalog"];
};

export type GetMedicationReturn = {
  medications: Medication[];
  loading: boolean;
  error?: ApolloError;
  refetch: PhotonClient["clinical"]["medication"]["getMedications"];
};

export type GetAllergensReturn = {
  allergens: Allergen[];
  loading: boolean;
  error?: ApolloError;
  refetch: PhotonClient["clinical"]["allergens"]["getAllergens"];
};

export interface PhotonClientContextInterface {
  getPatient: ({ id }: { id: string }) => {
    patient: Patient;
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["patient"]["getPatient"];
  };
  getPatients: ({
    after,
    first,
    name,
  }: {
    after?: Maybe<string>;
    first?: Maybe<number>;
    name?: Maybe<string>;
  }) => {
    patients: Patient[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["patient"]["getPatients"];
  };
  createPatient: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { createPatient: Patient } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  updatePatient: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { updatePatient: Patient } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  removePatientAllergy: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { removePatientAllergy: Patient } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  getOrder: ({ id }: { id: string }) => {
    order: Order;
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["order"]["getOrder"];
  };
  getOrders: ({
    after,
    first,
    patientId,
    patientName,
  }: {
    after?: Maybe<string>;
    first?: Maybe<number>;
    patientId?: Maybe<string>;
    patientName?: Maybe<string>;
  }) => {
    orders: Order[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["order"]["getOrders"];
  };
  createOrder: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { createOrder: Order } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  getPrescription: ({ id }: { id: string }) => {
    prescription: Prescription;
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["prescription"]["getPrescription"];
  };
  getPrescriptions: ({
    patientId,
    patientName,
    prescriberId,
    state,
    after,
    first,
  }: {
    patientId?: Maybe<string>;
    patientName?: Maybe<string>;
    prescriberId?: Maybe<string>;
    state?: Maybe<PrescriptionState>;
    after?: Maybe<string>;
    first?: Maybe<number>;
  }) => {
    prescriptions: Prescription[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["prescription"]["getPrescriptions"];
  };
  createPrescription: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { createPrescription: Prescription } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  getCatalog: ({
    id,
    fragment,
  }: {
    id: string;
    fragment?: Record<string, DocumentNode>;
  }) => GetCatalogReturn;
  getCatalogs: () => {
    catalogs: Catalog[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["catalog"]["getCatalogs"];
  };
  getMedications: ({
    filter,
    first,
    after,
  }: {
    filter?: MedicationFilter;
    first?: Number;
    after?: String;
  }) => GetMedicationReturn;
  getAllergens: ({
    filter,
  }: {
    filter?: AllergenFilter;
  }) => GetAllergensReturn;
  getPharmacies: ({
    name,
    location,
  }: {
    name?: Maybe<string>;
    location?: Maybe<LatLongSearch>;
  }) => {
    pharmacies: Pharmacy[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["clinical"]["pharmacy"]["getPharmacies"];
  };
  getOrganization: () => {
    organization: Organization;
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["management"]["organization"]["getOrganization"];
  };
  getOrganizations: () => {
    organizations: Organization[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["management"]["organization"]["getOrganizations"];
  };
  getWebhooks: () => {
    webhooks: WebhookConfig[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["management"]["webhook"]["getWebhooks"];
  };
  createWebhook: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { createWebhook: WebhookConfig } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  deleteWebhook: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { deleteWebhook: boolean } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  getClients: () => {
    clients: Client[];
    loading: boolean;
    error?: ApolloError;
    refetch: PhotonClient["management"]["client"]["getClients"];
  };
  rotateSecret: ({
    refetchQueries,
    awaitRefetchQueries,
  }: {
    refetchQueries: string[];
    awaitRefetchQueries?: boolean;
  }) => [
    ({
      variables,
      onCompleted,
    }: {
      variables: object;
      onCompleted?: (data: any) => void | undefined;
    }) => Promise<void>,
    {
      data: { rotateSecret: Client } | undefined | null;
      error: GraphQLError;
      loading: boolean;
    }
  ];
  clearError: () => void;
  login: PhotonClient["authentication"]["login"];
  getToken: PhotonClient["authentication"]["getAccessToken"];
  hasAuthParams: (searchParams: string) => boolean;
  handleRedirect: PhotonClient["authentication"]["handleRedirect"];
  logout: PhotonClient["authentication"]["logout"];
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  error: any;
}

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <PhotonProvider>.");
};

const PhotonClientContext = createContext<PhotonClientContextInterface>({
  getAllergens: stub,
  getPatients: stub,
  getPatient: stub,
  createPatient: stub,
  updatePatient: stub,
  removePatientAllergy: stub,
  createOrder: stub,
  getClients: stub,
  getPharmacies: stub,
  getMedications: stub,
  getCatalog: stub,
  getCatalogs: stub,
  getWebhooks: stub,
  getOrganizations: stub,
  getPrescriptions: stub,
  getOrganization: stub,
  getOrder: stub,
  getOrders: stub,
  getPrescription: stub,
  createPrescription: stub,
  createWebhook: stub,
  deleteWebhook: stub,
  login: stub,
  rotateSecret: stub,
  hasAuthParams: stub,
  handleRedirect: stub,
  logout: stub,
  clearError: stub,
  getToken: stub,
  isLoading: true,
  isAuthenticated: false,
  user: undefined,
  error: undefined,
});

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

export const PhotonProvider = (opts: {
  children: any;
  client: PhotonClient;
  searchParams?: string;
  onRedirectCallback?: any;
}) => {
  const {
    children,
    client,
    onRedirectCallback = defaultOnRedirectCallback,
    searchParams,
  } = opts;
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
    isLoading: true,
  });

  const functionLookup: Record<string, Function> = {};

  useEffect(() => {
    const initialize = async () => {
      if (hasAuthParams()) {
        try {
          const { appState } = await client.authentication.handleRedirect();
          onRedirectCallback(appState);
        } catch (e) {
          let message = (e as Error).message;
          dispatch({ type: "ERROR", error: message });
        }
      }
      await client.authentication.checkSession();
      const user = await client.authentication.getUser();
      dispatch({ type: "INITIALISED", user });
    };
    initialize();
  }, [client, onRedirectCallback]);

  /// Auth0

  const handleRedirect = async (url?: string) => {
    try {
      await client.authentication.handleRedirect(url);
    } catch (e) {
      let message = (e as Error).message;
      dispatch({ type: "ERROR", error: message });
    }
    dispatch({
      type: "HANDLE_REDIRECT_COMPLETE",
      user: await client.authentication.getUser(),
    });
  };

  useEffect(() => {
    if (hasAuthParams(searchParams)) {
      handleRedirect();
    }
  }, [searchParams]);

  const login = ({
    organizationId,
    invitation,
    appState,
  }: {
    organizationId?: string;
    invitation?: string;
    appState?: object;
  } = {}) => {
    return client.authentication.login({
      organizationId,
      invitation,
      appState,
    });
  };

  const clearError = () => {
    dispatch({
      type: "CLEAR_ERROR",
    });
  };

  const logout = ({ returnTo }: { returnTo?: string }) =>
    client.authentication.logout({ returnTo });

  const getToken = async ({ audience }: { audience?: string } = {}) => {
    const token = await client.authentication.getAccessToken({ audience });
    dispatch({
      type: "GET_ACCESS_TOKEN_COMPLETE",
      user: await client.authentication.getUser(),
    });
    return token;
  };
  /// Utilities

  const runRefetch = (
    query: any,
    refetchQueries: string[],
    awaitRefetchQueries: boolean
  ) =>
    useEffect(() => {
      const asyncExecutor = async () => {
        if (query) {
          if (refetchQueries) {
            const promises = refetchQueries
              .filter((x) => {
                if (!Object.keys(functionLookup).includes(x)) {
                  console.warn(`${x} is not a defined query in the React SDK`);
                  return false;
                }
                return true;
              })
              .map((x) => {
                const fn = functionLookup[x];
                return fn();
              });
            if (awaitRefetchQueries) {
              await Promise.all(promises);
            } else {
              Promise.all(promises);
            }
          }
        }
      };
      asyncExecutor();
    }, [query]);

  /// Patient

  const getPatientStore = map<{
    patient?: Patient;
    loading: boolean;
    error?: ApolloError;
  }>({
    patient: undefined,
    loading: true,
    error: undefined,
  });

  const fetchPatient = action(
    getPatientStore,
    "fetchPatient",
    async (store, { id }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.patient.getPatient({
        id,
      });
      store.setKey("patient", data?.patient || undefined);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getPatient = ({ id }: { id: string }) => {
    const { patient, loading, error } = useStore(getPatientStore);

    useEffect(() => {
      fetchPatient({ id });
    }, [id]);

    return {
      patient,
      loading,
      error,
      refetch: ({ id }: { id: string }) =>
        client.clinical.patient.getPatient({ id }),
    };
  };

  const getPatientsStore = map<{
    patients: Patient[];
    loading: boolean;
    error?: ApolloError;
  }>({
    patients: [],
    loading: true,
    error: undefined,
  });

  const fetchPatients = action(
    getPatientsStore,
    "fetchPatients",
    async (store, args?: any) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.patient.getPatients({
        after: args?.after,
        first: args?.first || 25,
        name: args?.name,
      });
      store.setKey("patients", data?.patients || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getPatients = (
    {
      after,
      first,
      name,
    }: {
      after?: string;
      first?: number;
      name?: string;
    } = { first: 25 }
  ) => {
    const { patients, loading, error } = useStore(getPatientsStore);

    useEffect(() => {
      fetchPatients({ after, first, name });
    }, [after, first, name]);

    return {
      patients,
      loading,
      error,
      refetch: (
        {
          after,
          first,
          name,
        }: {
          after?: string;
          first?: number;
          name?: string;
        } = { first: 25 }
      ) => client.clinical.patient.getPatients({ after, first, name }),
    };
  };

  const createPatientStore = map<{
    createPatient?: Patient;
    loading: boolean;
    error?: GraphQLError;
  }>({
    createPatient: undefined,
    loading: false,
    error: undefined,
  });

  const createPatientMutation = client.clinical.patient.createPatient({});

  const constructFetchCreatePatient = () =>
    action(
      createPatientStore,
      "createPatientMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await createPatientMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("createPatient", data?.createPatient);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const createPatient = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { createPatient, loading, error } = useStore(createPatientStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(createPatient, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchCreatePatient(),
      {
        createPatient,
        loading,
        error,
      },
    ];
  };

  const updatePatientStore = map<{
    updatePatient?: Patient;
    loading: boolean;
    error?: GraphQLError;
  }>({
    updatePatient: undefined,
    loading: false,
    error: undefined,
  });

  const updatePatientMutation = client.clinical.patient.updatePatient({});

  const constructFetchUpdatePatient = () =>
    action(
      updatePatientStore,
      "updatePatientMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await updatePatientMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("updatePatient", data?.updatePatient);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const updatePatient = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { updatePatient, loading, error } = useStore(updatePatientStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(updatePatient, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchUpdatePatient(),
      {
        updatePatient,
        loading,
        error,
      },
    ];
  };

  const removePatientAllergyStore = map<{
    removePatientAllergy?: Patient;
    loading: boolean;
    error?: GraphQLError;
  }>({
    removePatientAllergy: undefined,
    loading: false,
    error: undefined,
  });

  const removePatientAllergyMutation = client.clinical.patient.removePatientAllergy({});

  const constructFetchRemovePatientAllergy = () =>
    action(
      removePatientAllergyStore,
      "removePatientAllergyMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await removePatientAllergyMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("removePatientAllergy", data?.removePatientAllergy);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const removePatientAllergy = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { removePatientAllergy, loading, error } = useStore(removePatientAllergyStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(removePatientAllergy, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchRemovePatientAllergy(),
      {
        removePatientAllergy,
        loading,
        error,
      },
    ];
  };

  /// Order

  const getOrderStore = map<{
    order?: Order;
    loading: boolean;
    error?: ApolloError;
  }>({
    order: undefined,
    loading: true,
    error: undefined,
  });

  const fetchOrder = action(
    getOrderStore,
    "fetchOrder",
    async (store, { id }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.order.getOrder({
        id,
      });
      store.setKey("order", data?.order || undefined);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getOrder = ({ id }: { id: string }) => {
    const { order, loading, error } = useStore(getOrderStore);

    useEffect(() => {
      fetchOrder({ id });
    }, [id]);

    return {
      order,
      loading,
      error,
      refetch: ({ id }: { id: string }) =>
        client.clinical.order.getOrder({ id }),
    };
  };

  const getOrdersStore = map<{
    orders: Order[];
    loading: boolean;
    error?: ApolloError;
  }>({
    orders: [],
    loading: true,
    error: undefined,
  });

  const fetchOrders = action(
    getOrdersStore,
    "fetchOrders",
    async (store, args?: any) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.order.getOrders({
        after: args?.after,
        first: args?.first || 25,
        patientName: args?.patientName,
        patientId: args?.patientId,
      });
      store.setKey("orders", data?.orders || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getOrders = (
    {
      after,
      first,
      patientId,
      patientName,
    }: {
      after?: string;
      first?: number;
      patientId?: string;
      patientName?: string;
    } = { first: 25 }
  ) => {
    const { orders, loading, error } = useStore(getOrdersStore);

    useEffect(() => {
      fetchOrders({ after, first, patientId, patientName });
    }, [after, first, patientId, patientName]);

    return {
      orders,
      loading,
      error,
      refetch: (
        {
          after,
          first,
          patientId,
          patientName,
        }: {
          after?: string;
          first?: number;
          patientId?: string;
          patientName?: string;
        } = { first: 25 }
      ) =>
        client.clinical.order.getOrders({
          after,
          first,
          patientId,
          patientName,
        }),
    };
  };

  const createOrderStore = map<{
    createOrder?: Order;
    loading: boolean;
    error?: GraphQLError;
  }>({
    createOrder: undefined,
    loading: false,
    error: undefined,
  });

  const createOrderMutation = client.clinical.order.createOrder({});

  const constructFetchCreateOrder = () =>
    action(
      createOrderStore,
      "createOrderMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await createOrderMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("createOrder", data?.createOrder);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const createOrder = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { createOrder, loading, error } = useStore(createOrderStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(createOrder, refetchQueries, awaitRefetchQueries);
    }
    return [
      constructFetchCreateOrder(),
      {
        createOrder,
        loading,
        error,
      },
    ];
  };

  /// Prescription

  const getPrescriptionStore = map<{
    prescription?: Prescription;
    loading: boolean;
    error?: ApolloError;
  }>({
    prescription: undefined,
    loading: true,
    error: undefined,
  });

  const fetchPrescription = action(
    getPrescriptionStore,
    "fetchPrescription",
    async (store, { id }) => {
      store.setKey("loading", true);
      const { data, error } =
        await client.clinical.prescription.getPrescription({
          id,
        });
      store.setKey("prescription", data?.prescription || undefined);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getPrescription = ({ id }: { id: string }) => {
    const { prescription, loading, error } = useStore(getPrescriptionStore);

    useEffect(() => {
      fetchPrescription({ id });
    }, [id]);

    return {
      prescription,
      loading,
      error,
      refetch: ({ id }: { id: string }) =>
        client.clinical.prescription.getPrescription({ id }),
    };
  };

  const getPrescriptionsStore = map<{
    prescriptions: Prescription[];
    loading: boolean;
    error?: ApolloError;
  }>({
    prescriptions: [],
    loading: true,
    error: undefined,
  });

  const fetchPrescriptions = action(
    getPrescriptionsStore,
    "fetchOrders",
    async (store, args?: any) => {
      store.setKey("loading", true);
      const { data, error } =
        await client.clinical.prescription.getPrescriptions({
          after: args?.after,
          first: args?.first || 25,
          patientName: args?.patientName,
          patientId: args?.patientId,
          prescriberId: args?.prescriberId,
          state: args?.state,
        });
      store.setKey("prescriptions", data?.prescriptions || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getPrescriptions = (
    {
      after,
      first,
      patientId,
      patientName,
      prescriberId,
      state,
    }: {
      after?: string;
      first?: number;
      patientId?: string;
      patientName?: string;
      prescriberId?: string;
      state?: PrescriptionState;
    } = { first: 25 }
  ) => {
    const { prescriptions, loading, error } = useStore(getPrescriptionsStore);

    useEffect(() => {
      fetchPrescriptions({
        after,
        first,
        patientId,
        patientName,
        prescriberId,
        state,
      });
    }, [after, first, patientId, patientName]);

    return {
      prescriptions,
      loading,
      error,
      refetch: (
        {
          after,
          first,
          patientId,
          patientName,
        }: {
          after?: string;
          first?: number;
          patientId?: string;
          patientName?: string;
          prescriberId?: string;
          state?: PrescriptionState;
        } = { first: 25 }
      ) =>
        client.clinical.prescription.getPrescriptions({
          after,
          first,
          patientId,
          patientName,
        }),
    };
  };

  const createPrescriptionStore = map<{
    createPrescription?: Prescription;
    loading: boolean;
    error?: GraphQLError;
  }>({
    createPrescription: undefined,
    loading: false,
    error: undefined,
  });

  const createPrescriptionMutation =
    client.clinical.prescription.createPrescription({});

  const constructFetchCreatePrescription = () =>
    action(
      createPrescriptionStore,
      "createPrescriptionMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await createPrescriptionMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("createPrescription", data?.createPrescription);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const createPrescription = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { createPrescription, loading, error } = useStore(
      createPrescriptionStore
    );

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(createPrescription, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchCreatePrescription(),
      {
        createPrescription,
        loading,
        error,
      },
    ];
  };

  /// Catalog

  const getCatalogStore = map<{
    catalog?: Catalog;
    loading: boolean;
    error?: ApolloError;
  }>({
    catalog: undefined,
    loading: true,
    error: undefined,
  });

  const fetchCatalog = action(
    getCatalogStore,
    "fetchCatalog",
    async (store, { id, fragment }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.catalog.getCatalog({
        id,
        fragment,
      });
      store.setKey("catalog", data?.catalog || undefined);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getCatalog = ({
    id,
    fragment,
  }: {
    id: string;
    fragment?: Record<string, DocumentNode>;
  }) => {
    const { catalog, loading, error } = useStore(getCatalogStore);

    useEffect(() => {
      if (id) {
        fetchCatalog({ id, fragment });
      }
    }, [id]);

    return {
      catalog,
      loading,
      error,
      refetch: ({
        id,
      }: {
        id: string;
        fragment?: Record<string, DocumentNode>;
      }) => client.clinical.catalog.getCatalog({ id, fragment }),
    };
  };

  const getCatalogsStore = map<{
    catalogs: Catalog[];
    loading: boolean;
    error?: ApolloError;
  }>({
    catalogs: [],
    loading: true,
    error: undefined,
  });

  const fetchCatalogs = action(
    getCatalogsStore,
    "fetchCatalogs",
    async (store) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.catalog.getCatalogs();
      store.setKey("catalogs", data?.catalogs || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getCatalogs = () => {
    const { catalogs, loading, error } = useStore(getCatalogsStore);

    useEffect(() => {
      fetchCatalogs();
    }, []);

    return {
      catalogs,
      loading,
      error,
      refetch: () => client.clinical.catalog.getCatalogs(),
    };
  };

  /// Allergens

  const getAllergensStore = map<{
    allergens: Allergen[];
    loading: boolean;
    error?: ApolloError;
  }>({
    allergens: [],
    loading: true,
    error: undefined,
  });

  const fetchAllergens = action(
    getAllergensStore,
    "fetchAllergens",
    async (store, { filter }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.allergens.getAllergens({
        filter,
      });
      store.setKey("allergens", data?.allergens || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getAllergens = ({
    filter
  }: {
    filter?: AllergenFilter;
  }) => {
    const { allergens, loading, error } = useStore(getAllergensStore);

    useEffect(() => {
      fetchAllergens({ filter });
    }, [
      filter?.name
    ]);

    return {
      allergens,
      loading,
      error,
      refetch: ({
        filter,
      }: {
        filter?: AllergenFilter;
      }) => client.clinical.allergens.getAllergens({ filter }),
    };
  };

  /// Medication

  const getMedicationsStore = map<{
    medications: Medication[];
    loading: boolean;
    error?: ApolloError;
  }>({
    medications: [],
    loading: true,
    error: undefined,
  });

  const fetchMedications = action(
    getMedicationsStore,
    "fetchMedications",
    async (store, { filter, first, after }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.medication.getMedications({
        filter,
        first,
        after,
      });
      store.setKey("medications", data?.medications || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getMedications = ({
    filter,
    first,
    after,
  }: {
    filter?: MedicationFilter;
    first?: number;
    after?: string;
  }) => {
    const { medications, loading, error } = useStore(getMedicationsStore);

    useEffect(() => {
      fetchMedications({ filter, first, after });
    }, [
      filter?.drug?.name,
      filter?.drug?.code,
      filter?.product?.name,
      filter?.product?.drug,
      filter?.product?.code,
      filter?.product?.type,
      filter?.package?.name,
      filter?.package?.product,
      filter?.package?.code,
      filter?.package?.type,
      first,
      after,
    ]);

    return {
      medications,
      loading,
      error,
      refetch: ({
        filter,
        first,
        after,
      }: {
        filter?: MedicationFilter;
        first?: number;
        after?: string;
      }) => client.clinical.medication.getMedications({ filter, first, after }),
    };
  };

  /// Pharmacy

  const getPharmaciesStore = map<{
    pharmacies: Pharmacy[];
    loading: boolean;
    error?: ApolloError;
  }>({
    pharmacies: [],
    loading: true,
    error: undefined,
  });

  const fetchPharmacies = action(
    getPharmaciesStore,
    "fetchPharmacies",
    async (store, { name, location }) => {
      store.setKey("loading", true);
      const { data, error } = await client.clinical.pharmacy.getPharmacies({
        name,
        location,
      });
      store.setKey("pharmacies", data?.pharmacies || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getPharmacies = ({
    name,
    location,
  }: {
    name?: string;
    location?: LatLongSearch;
  }) => {
    const { pharmacies, loading, error } = useStore(getPharmaciesStore);

    useEffect(() => {
      fetchPharmacies({ name, location });
    }, [name, location]);

    return {
      pharmacies,
      loading,
      error,
      refetch: ({
        name,
        location,
      }: {
        name?: string;
        location?: LatLongSearch;
      }) => client.clinical.pharmacy.getPharmacies({ name, location }),
    };
  };

  // Organization

  const getOrganizationStore = map<{
    organization?: Organization;
    loading: boolean;
    error?: ApolloError;
  }>({
    organization: undefined,
    loading: true,
    error: undefined,
  });

  const fetchOrganization = action(
    getOrganizationStore,
    "fetchOrganization",
    async (store) => {
      store.setKey("loading", true);
      const { data, error } =
        await client.management.organization.getOrganization();
      store.setKey("organization", data?.organization || undefined);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getOrganization = () => {
    const { organization, loading, error } = useStore(getOrganizationStore);

    useEffect(() => {
      fetchOrganization();
    }, []);

    return {
      organization,
      loading,
      error,
      refetch: () => client.management.organization.getOrganization(),
    };
  };

  const getOrganizationsStore = map<{
    organizations: Organization[];
    loading: boolean;
    error?: ApolloError;
  }>({
    organizations: [],
    loading: true,
    error: undefined,
  });

  const fetchOrganizations = action(
    getOrganizationsStore,
    "fetchOrganizations",
    async (store) => {
      store.setKey("loading", true);
      const { data, error } =
        await client.management.organization.getOrganizations();
      store.setKey("organizations", data?.organizations || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getOrganizations = () => {
    const { organizations, loading, error } = useStore(getOrganizationsStore);

    useEffect(() => {
      fetchOrganizations();
    }, []);

    return {
      organizations,
      loading,
      error,
      refetch: () => client.management.organization.getOrganizations(),
    };
  };

  // Webhooks

  const getWebhooksStore = map<{
    webhooks: WebhookConfig[];
    loading: boolean;
    error?: ApolloError;
  }>({
    webhooks: [],
    loading: true,
    error: undefined,
  });

  const fetchWebhooks = action(
    getWebhooksStore,
    "fetchWebhooks",
    async (store) => {
      store.setKey("loading", true);
      const { data, error } = await client.management.webhook.getWebhooks();
      store.setKey("webhooks", data?.webhooks || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getWebhooks = () => {
    const { webhooks, loading, error } = useStore(getWebhooksStore);

    useEffect(() => {
      fetchWebhooks();
    }, []);

    return {
      webhooks,
      loading,
      error,
      refetch: () => client.management.webhook.getWebhooks(),
    };
  };

  const createWebhookStore = map<{
    createWebhook?: WebhookConfig;
    loading: boolean;
    error?: GraphQLError;
  }>({
    createWebhook: undefined,
    loading: false,
    error: undefined,
  });

  const createWebhookMutation = client.management.webhook.createWebhook({});

  const constructFetchCreateWebhook = () =>
    action(
      createWebhookStore,
      "createWebhookMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await createWebhookMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("createWebhook", data?.createWebhookConfig);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const createWebhook = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { createWebhook, loading, error } = useStore(createWebhookStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(createWebhook, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchCreateWebhook(),
      {
        createWebhook,
        loading,
        error,
      },
    ];
  };

  const deleteWebhookStore = map<{
    deleteWebhook?: Boolean;
    loading: boolean;
    error?: GraphQLError;
  }>({
    deleteWebhook: undefined,
    loading: false,
    error: undefined,
  });

  const deleteWebhookMutation = client.management.webhook.deleteWebhook();

  const constructFetchDeleteWebhook = () =>
    action(
      deleteWebhookStore,
      "deleteWebhookMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await deleteWebhookMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("deleteWebhook", data?.deleteWebhookConfig);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const deleteWebhook = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { deleteWebhook, loading, error } = useStore(deleteWebhookStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(deleteWebhook, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchDeleteWebhook(),
      {
        deleteWebhook,
        loading,
        error,
      },
    ];
  };

  /// Clients

  const getClientsStore = map<{
    clients: Client[];
    loading: boolean;
    error?: ApolloError;
  }>({
    clients: [],
    loading: true,
    error: undefined,
  });

  const fetchClients = action(
    getClientsStore,
    "fetchClients",
    async (store) => {
      store.setKey("loading", true);
      const { data, error } = await client.management.client.getClients();
      store.setKey("clients", data?.clients || []);
      store.setKey("error", error);
      store.setKey("loading", false);
    }
  );

  const getClients = () => {
    const { clients, loading, error } = useStore(getClientsStore);

    useEffect(() => {
      fetchClients();
    }, []);

    return {
      clients,
      loading,
      error,
      refetch: () => client.management.client.getClients(),
    };
  };

  const rotateSecretStore = map<{
    rotateSecret?: Client;
    loading: boolean;
    error?: GraphQLError;
  }>({
    rotateSecret: undefined,
    loading: false,
    error: undefined,
  });

  const rotateSecretMutation = client.management.client.rotateSecret({});

  const constructFetchRotateSecret = () =>
    action(
      rotateSecretStore,
      "rotateSecretMutation",
      async (store, { variables, onCompleted }) => {
        store.setKey("loading", true);

        const { data, errors } = await rotateSecretMutation({
          variables,
          refetchQueries: [],
          awaitRefetchQueries: false,
        });

        store.setKey("rotateSecret", data?.rotateSecret);
        store.setKey("error", errors?.[0]);
        store.setKey("loading", false);
        if (onCompleted) {
          onCompleted(data);
        }
      }
    );

  const rotateSecret = ({
    refetchQueries = undefined,
    awaitRefetchQueries = false,
  }: {
    refetchQueries?: string[];
    awaitRefetchQueries?: boolean;
  }) => {
    const { rotateSecret, loading, error } = useStore(rotateSecretStore);

    if (refetchQueries && refetchQueries.length > 0) {
      runRefetch(rotateSecret, refetchQueries, awaitRefetchQueries);
    }

    return [
      constructFetchRotateSecret(),
      {
        rotateSecret,
        loading,
        error,
      },
    ];
  };

  functionLookup.getWebhooks = fetchWebhooks;
  functionLookup.getOrders = fetchOrders;
  functionLookup.getPatients = fetchPatients;
  functionLookup.getPrescriptions = fetchPrescriptions;
  functionLookup.getClients = fetchClients;

  const contextValue = {
    ...state,
    login,
    logout,
    getToken,
    hasAuthParams,
    handleRedirect,
    getPatient,
    getPatients,
    createPatient,
    getOrder,
    getOrders,
    createOrder,
    getPrescription,
    getPrescriptions,
    createPrescription,
    getCatalog,
    getCatalogs,
    getMedications,
    getOrganizations,
    getOrganization,
    getWebhooks,
    createWebhook,
    deleteWebhook,
    getPharmacies,
    getClients,
    rotateSecret,
    clearError,
    updatePatient,
    getAllergens,
    removePatientAllergy
  };

  return (
    <PhotonClientContext.Provider value={contextValue}>
      {children}
    </PhotonClientContext.Provider>
  );
};

export const usePhoton = () => useContext(PhotonClientContext);
