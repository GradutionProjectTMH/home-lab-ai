type TableColumn = {
	key: string;
	title: string;
	dataIndex?: string;
	render?: <TableDataItem extends Object>(value: any, record: TableDataItem, index: number) => React.ReactNode;
	renderHeader?: (value: string, index: number) => React.ReactNode;
};

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
	dataSource: Record<string, any>[];
	columns: TableColumn[];
}
