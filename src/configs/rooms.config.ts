export const rooms = [
	{
		id: 0,
		name: "Public Area",
		labels: ["LivingRoom", "Balcony", "Entrance"],
		colorTheme: "gray",
		currentIndex: 0,
	},
	{
		id: 1,
		name: "Bedroom",
		labels: ["MasterRoom", "SecondRoom", "ChildRoom", "StudyRoom", "GuestRoom"],
		colorTheme: "blue",
		currentIndex: 0,
	},
	{
		id: 2,
		name: "Function Area",
		labels: ["Bathroom", "Kitchen", "DiningRoom", "Storage"],
		colorTheme: "green",
		currentIndex: 0,
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
