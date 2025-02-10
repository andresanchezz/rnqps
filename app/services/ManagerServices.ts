import { HTTP } from "../api/services-qps";
import { handleApiErrors } from "../utils/error-handler";

export default class ManagerServices {
    
    public static async listManagerCreatedServices(){
        return await handleApiErrors(() => HTTP.post(`/services/by-communities`));

    }
    public static async getManagerCommunities(managerId:string){
        return await handleApiErrors(() => HTTP.get(`/communities/by-manager/${managerId}`));
    }

    public static async getServicesTypes(){
        return await handleApiErrors(() => HTTP.get(`/types`));
    }

    public static async getExtras(){
        return await handleApiErrors(() => HTTP.get(`/extras`));
    }

    public static async addNewService(newService:any){
        return await handleApiErrors(() => HTTP.post(`/services`, newService));
    }


}