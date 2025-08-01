
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const AdvancedSearch = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Busca Avançada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select>
          <SelectTrigger><SelectValue placeholder="Tipo de Imóvel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="venda">Venda</SelectItem>
            <SelectItem value="aluguel">Aluguel</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Cidade" />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Área (m²)" />
          <Input placeholder="Quartos" type="number" />
          <Input placeholder="Banheiros" type="number" />
        </div>
        <div>
          <Label>Faixa de Preço</Label>
          <Slider defaultValue={[500000, 5000000]} max={10000000} step={100000} />
        </div>
        <Button className="w-full">Buscar</Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
