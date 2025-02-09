import { HTTP } from "../api/services-qps";
import { handleApiErrors } from "../utils/error-handler";
import { Task } from "../models/task-model";

export default class EmployeeServices {

    public static async getTaskList(userId: number, page: number) {
        return await handleApiErrors(() => HTTP.post(`/services/by-cleaner/${userId}?order=ASC&page=${page}&take=10`,
            // Parámetro de consulta: página actual
            // take Parámetro de consulta: elementos por página
            // order Parámetro de consulta: orden de los resultados
        ))
    }

    public static async DenyTask(task: Task, comment: string) {
        
        const updatedData = {
            date: task.date,
            schedule: task.schedule,
            comment: task.comment,
            unitySize: task.unitySize,
            unitNumber: task.unitNumber,
            communityId: task.communityId,
            typeId: task.typeId,
            statusId: "4",
            userId: task.userId,
            userComment: comment  
        }

        return await handleApiErrors(() =>
            HTTP.patch(`/services/${task.id}`, updatedData)
        );
    }

    public static async AcceptTask(task: Task) {

        const updatedData = {
            date: task.date,
            schedule: task.schedule,
            comment: task.comment,
            userComment: task.userComment,
            unitySize: task.unitySize,
            unitNumber: task.unitNumber,
            communityId: task.communityId,
            typeId: task.typeId,
            statusId: "3",
            userId: task.userId,
        }

        console.log(updatedData);

        return await handleApiErrors(() =>
            HTTP.patch(`/services/${task.id}`, updatedData)
        );
    }

}