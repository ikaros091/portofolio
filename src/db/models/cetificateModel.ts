import { database } from "../config/mongodb";

class CertificateModel {
  static collection() {
    return database.collection("certificate");
  }
}

export default CertificateModel;
