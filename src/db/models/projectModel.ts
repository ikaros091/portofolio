import { database } from "../config/mongodb";

class ProjectModel {
  static collection() {
    return database.collection("project");
  }
}

export default ProjectModel;
