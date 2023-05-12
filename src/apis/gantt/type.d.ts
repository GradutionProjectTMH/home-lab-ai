type GanttReq = {
	length: number;
	width: number;
	height: number;
	floor: number;
	location: string;
	laborCost: number;
	estimate: number;
	laborAmount: number;
};

type GanttRes = Record<
	string,
	{
		Labors: number;
		Days: number;
		Costs: number;
	}
>;
