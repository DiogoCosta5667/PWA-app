import { Table as TableReact } from "reactstrap";
import _ from "lodash";

const Table = ({
  columns = [],
  rows = {
    data: [],
    pagination: {},
  },
}) => {
  return (
    <TableReact hover>
      <thead>
        <tr>
          {columns.map((colum, index) => (
            <th key={`${index}_${colum}`}>{colum}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(rows.data || []).map((row, index) => (
          <tr key={row._id || `row_${index}`}>
            {columns.map((column) => (
              <td key={`${column}_${row._id || index}`}>{_.get(row, column)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableReact>
  );
};

export default Table;
