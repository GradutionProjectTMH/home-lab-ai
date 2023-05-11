import axiosHomeLab from "../../configs/homelab-server.config";

export const postGanttApi = async (data: GanttReq): Promise<GanttRes> => {
	return axiosHomeLab.post<GanttReq, GanttRes>(`gantt`, data);
};
