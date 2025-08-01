
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PropertyDetailsTable = ({ details }: { details: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-semibold">Área construída</TableHead>
              <TableCell>{details.builtArea}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Área do terreno</TableHead>
              <TableCell>{details.landArea}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Ano de construção</TableHead>
              <TableCell>{details.yearBuilt}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsTable;
