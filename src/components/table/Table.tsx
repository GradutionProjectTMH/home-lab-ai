import React, { forwardRef } from "react";
import { joinTxts } from "../../utils/text.util";
import H5 from "../typography/h5";
import Text from "../typography/text";

export const Table = forwardRef<HTMLTableElement, TableProps>(({ dataSource, columns, className, ...props }, ref) => {
	return (
		<table ref={ref} className={joinTxts("border-collapse table-auto w-full", className)} {...props}>
			<thead className="text-left">
				<tr>
					{columns.map(({ key, title, renderHeader }, index) => {
						return (
							<th key={key} className="border-b border-black pl-0 pt-0 pr-4 pb-4">
								{renderHeader ? renderHeader(title, index) : <H5>{title}</H5>}
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{dataSource.length > 0 ? (
					dataSource.map((data) => (
						<tr key={Object.values(data).join("|")}>
							{columns.map(({ key, dataIndex, render }, index) => (
								<td key={key} className="border-b border-in-gray pl-0 pr-4 py-4">
									{render ? render(data[dataIndex || ""], data, index) : data[dataIndex || ""]}
								</td>
							))}
						</tr>
					))
				) : (
					<Text className="text-gray-500 mt-4">Không có dữ liệu</Text>
				)}
			</tbody>
		</table>
	);
});
