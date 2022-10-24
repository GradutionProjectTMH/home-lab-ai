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

export type Room = typeof rooms[0];

export const findRoom = (label: string): Room => {
	return rooms.find((room) => room.labels.includes(label))!;
};
