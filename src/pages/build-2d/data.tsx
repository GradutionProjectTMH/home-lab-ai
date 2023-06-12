import livingRoomJpg from "./images/living-room.jpg";
import bedRoomJpg from "./images/bed-room.jpg";
import diningRoomJpg from "./images/dining-room.jpg";
import studyRoomJpg from "./images/study-room.jpg";

export const data = [
	{
		id: "Không gian",
		isLoading: false,
		items: [
			{
				id: "Phòng khách",
				title: "Phòng khách",
				prompt: "dreamy sunken living room conversation pit",
				imgUrl: "https://noithatxinh.vn/Images/Upload/images/phu-kien-trang-tri-phong-khach-dep%20(1).jpg",
				isChoose: false,
			},
			{
				id: "Phòng ngủ",
				title: "Phòng ngủ",
				prompt: "luminous lighting bedroom",
				imgUrl: bedRoomJpg,
				isChoose: false,
			},
			{
				id: "Phòng ăn",
				title: "Phòng ăn",
				prompt: "open space kitchen with dining room",
				imgUrl: diningRoomJpg,
				isChoose: false,
			},
			{
				id: "Phòng làm việc",
				title: "Phòng làm việc",
				prompt: "luxury and modern office room, working table on the corner, small room for one person",
				imgUrl: studyRoomJpg,
				isChoose: false,
			},
		],
		prompt: "Room Name",
		title: "Không gian",
	},

	{
		id: "Phong cách",
		isLoading: false,
		items: [
			{
				id: "Hiện đại",
				title: "Hiện đại",
				prompt:
					"high resolution photography interior design, (Room Name), (Floor), (Outside), bauhaus furniture and decoration includes (Categories), (Ceiling), (Palette), interior design magazine, (Feeling)",
				imgUrl: livingRoomJpg,
				isChoose: false,
			},
			{
				id: "Tối giản",
				title: "Tối giản",
				prompt:
					"high resolution photography interior design, (Room Name), (Floor), (Outside), minimalist architecture, minimalist furniture includes (Categories), (Ceiling), (Palette), interior design magazine, (Feeling)",
				imgUrl:
					"https://www.mydomaine.com/thmb/r4DSEQFXhKYmEiLqO3y-vyCb6Pw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/truehomeminimalistlivingroom-341b422eba9a43fa8035d056bf452064.jpeg",
				isChoose: false,
			},
			{
				id: "Thiên nhiên",
				title: "Thiên nhiên",
				prompt:
					"high resolution photography interior design, (Room Name), (Floor), (Outside), bauhaus furniture and decoration includes (Categories), (Ceiling), (Palette), lots of plants indoor architecture, peaceful, (Feeling)",
				imgUrl:
					"https://cdn.onekindesign.com/wp-content/uploads/2020/10/Minimalist-Home-Design-Peterssen-Keller-Architecture-23-1-Kindesign.jpg",
				isChoose: false,
			},
			{
				id: "Nghệ thuật",
				title: "Nghệ thuật",
				prompt:
					"high resolution photography interior design, an apartment complex as seen from inside, (Room Name), must have four paintings on the wall, (Floor), (Outside), (Ceiling), (Palette), a detailed anime style, (Feeling)",
				imgUrl: "https://www.1991design.vn/wp-content/uploads/2021/05/phong-cach-thiet-ke-indochine-5-min.jpg",
				isChoose: false,
			},
		],
		prompt: "Style",
		title: "Phong cách",
	},

	// {
	// 	id: "Vật dụng",
	// 	isLoading: false,
	// 	items: [
	// 		{
	// 			id: "Lò vi sóng",
	// 			title: "Lò vi sóng",
	// 			prompt: "Moderna Microwave",
	// 			imgUrl: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/9/16/1093790/BCBCB259-B0F4-4A9D-8.jpeg",
	// 			isChoose: false,
	// 		},
	// 		{
	// 			id: "Tủ lạnh",
	// 			title: "Tủ lạnh",
	// 			prompt: "Infinity Refrigerator",
	// 			imgUrl: "https://salt.tikicdn.com/ts/product/97/a0/25/9c624b7950c1344cae8e158a4f6a4d3e.jpg",
	// 			isChoose: false,
	// 		},
	// 		{
	// 			id: "Máy rửa bát",
	// 			title: "Máy rửa bát",
	// 			prompt: "Apex Dishwasher",
	// 			imgUrl: "https://beptot.vn/Data/upload/images/may-rua-bat-bao-nhieu-tien.png",
	// 			isChoose: false,
	// 		},
	// 		{
	// 			id: "Máy xay",
	// 			title: "Máy xay",
	// 			prompt: "Zenith Blender",
	// 			imgUrl:
	// 				"https://cdn.tgdd.vn/Files/2021/10/21/1392630/nen-mua-may-xay-sinh-to-hay-may-xay-sinh-to-cam-tay-cho-gian-bep-nha-minh-202110212303458732.jpg",
	// 			isChoose: false,
	// 		},
	// 	],
	// 	prompt: "Categories",
	// 	title: "Vật dụng",
	// },
	{
		id: "Sàn nhà",
		isLoading: false,
		items: [
			{
				id: "Sàn gỗ",
				title: "Sàn gỗ",
				prompt: "wooden floor",
				imgUrl: "https://sangogiadinh.com/wp-content/uploads/2020/12/go-lot-san-tu-nhien.jpg",
				isChoose: false,
			},
			{
				id: "Sàn gạch men",
				title: "Sàn gạch men",
				prompt: "ceramic tile floor",
				imgUrl: "https://cdn.onehousing.vn/transaction-media/UhyMkOpyjfYobbbCWfVmYGUYLhMMzn.jpg",
				isChoose: false,
			},
		],
		prompt: "Floor",
		title: "Sàn nhà",
	},
	{
		id: "Trần nhà",
		isLoading: false,
		items: [
			{
				id: "Trần cao",
				title: "Trần cao",
				prompt: "high ceiling",
				imgUrl:
					"https://kientrucvietnam.org.vn/wp-content/uploads/2019/11/dep-den-muc-nay-thi-bao-sao-nha-ai-cung-lua-chon-tran-cao-de-lam-1-1-1533481796038727216909.jpg",
				isChoose: false,
			},
			{
				id: "Đèn chùm",
				title: "Đèn chùm",
				prompt: "high ceiling with chandelier",
				imgUrl: "https://noithatdepgiare.vn/upload/images/den-chum-pha-le.jpg",
				isChoose: false,
			},
			{
				id: "Đèn treo",
				title: "Đèn treo",
				prompt: "high ceiling with downlight",
				imgUrl: "https://cf.shopee.vn/file/587ff6babf3ff3518dee6fd3ed7431a7",
				isChoose: false,
			},
		],
		prompt: "Ceiling",
		title: "Trần nhà",
	},
	{
		id: "Tông màu",
		isLoading: false,
		items: [
			{
				id: "Xanh be",
				title: "Xanh be",
				prompt: "beige blue salmon pastel palette",
				imgUrl:
					"https://file.hstatic.net/1000330219/article/blog_sonmynano.com_6_d26420857da047f98519357ba3156b63_1024x1024.jpg",
				isChoose: false,
			},
			{
				id: "Xanh thiên nhiên",
				title: "Xanh thiên nhiên",
				prompt: "dark green amber palette",
				imgUrl: "https://nicekitchen.vn/MediaUploader/DucPhuHome_rHbYxqpiGOs5KRZogD7y10601062018_105256_PM_.png",
				isChoose: false,
			},
			{
				id: "Cam",
				title: "Cam",
				prompt: "dramatic light palette",
				imgUrl: "https://noithatduongdai.cdn.vccloud.vn/wp-content/uploads/2022/01/phong-khach-mau-cam.jpg",
				isChoose: false,
			},
		],
		prompt: "Pallette",
		title: "Tông màu",
	},
	{
		id: "Không gian bên ngoài",
		isLoading: false,
		items: [
			{
				id: "Vườn hoa",
				title: "Vườn hoa",
				prompt: "small windows opening onto the garden",
				imgUrl: "https://static-images.vnncdn.net/files/publish/2023/2/26/nha-vuon-1-819.jpg",
				isChoose: false,
			},
			{
				id: "Biển",
				title: "Biển",
				prompt: "big door opening onto the beach",
				imgUrl: "https://icdn.dantri.com.vn/thumb_w/660/2021/07/29/chuan-6docx-1627521770638.jpeg",
				isChoose: false,
			},
			{
				id: "Thành phố",
				title: "Thành phố",
				prompt: "large steel windows viewing a city",
				imgUrl:
					"https://image.made-in-china.com/2f0j00YZHltzWKVEqG/Steel-Windows-Mild-Steel-Window-Grills-Galvanized-Steel-Profile-for-Windows-and-Door.jpg",
				isChoose: false,
			},
		],
		prompt: "Outside",
		title: "Không gian bên ngoài",
	},
	{
		id: "Cảm giác",
		isLoading: false,
		items: [
			{
				id: "Ấm cúng",
				title: "Ấm cúng",
				prompt: "cozy atmosphere",
				imgUrl: "https://afamilycdn.com/2018/7/6/1-15308363961811750760569.jpg",
				isChoose: false,
			},
		],
		prompt: "Feeling",
		title: "Cảm giác",
	},
];
