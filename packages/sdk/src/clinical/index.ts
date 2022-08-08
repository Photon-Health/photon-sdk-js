import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { CatalogQueryManager } from "./catalog";
import { MedicationQueryManager } from "./medication";
import { OrderQueryManager } from "./order";
import { PatientQueryManager } from "./patient";
import { PharmacyQueryManager } from "./pharmacy";
import { PrescriptionQueryManager } from "./prescription";

export class ClinicalQueryManager {
  public catalog: CatalogQueryManager;
  public medication: MedicationQueryManager;
  public order: OrderQueryManager;
  public patient: PatientQueryManager;
  public pharmacy: PharmacyQueryManager;
  public prescription: PrescriptionQueryManager;

  constructor(
    apollo: ApolloClient<undefined> | ApolloClient<NormalizedCacheObject>
  ) {
    this.catalog = new CatalogQueryManager(apollo);
    this.medication = new MedicationQueryManager(apollo);
    this.order = new OrderQueryManager(apollo);
    this.patient = new PatientQueryManager(apollo);
    this.pharmacy = new PharmacyQueryManager(apollo);
    this.prescription = new PrescriptionQueryManager(apollo);
  }
}
