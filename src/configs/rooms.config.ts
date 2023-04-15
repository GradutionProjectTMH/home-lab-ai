export const rooms = [
	{
		id: 0,
		name: "Phòng chung",
		labels: ["LivingRoom", "Balcony", "Entrance"],
		colorTheme: "gray",
		leftIndex: 0,
		rightIndex: 0,
	},
	{
		id: 1,
		name: "Phòng riêng",
		labels: ["MasterRoom", "SecondRoom", "ChildRoom", "StudyRoom", "GuestRoom"],
		colorTheme: "blue",
		leftIndex: 0,
		rightIndex: 0,
	},
	{
		id: 2,
		name: "Phòng chức năng",
		labels: ["Bathroom", "Kitchen", "DiningRoom", "Storage"],
		colorTheme: "green",
		leftIndex: 0,
		rightIndex: 0,
	},
];

export const labelIndex: Record<string, number> = {
	LivingRoom: 0,
	MasterRoom: 1,
	Kitchen: 2,
	Bathroom: 3,
	DiningRoom: 4,
	ChildRoom: 5,
	StudyRoom: 6,
	SecondRoom: 7,
	GuestRoom: 8,
	Balcony: 9,
	Entrance: 10,
	Storage: 11,
	"Wall-in": 12,
	External: 13,
	ExteriorWall: 14,
	FrontDoor: 15,
	InteriorWall: 16,
	InteriorDoor: 17,
};

export type Room = typeof rooms[0];

export const findRoom = (label: string): Room => {
	return rooms.find((room) => room.labels.includes(label))!;
};

export const getRoomLabel = (roomId: number): string => {
	return Object.keys(labelIndex).find((key) => labelIndex[key] == roomId)!;
};
