
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const FinancingCalculator = () => {
  const [valorImovel, setValorImovel] = useState('1200000');
  const [entrada, setEntrada] = useState('240000');
  const [taxaJuros, setTaxaJuros] = useState('9.5');
  const [prazo, setPrazo] = useState('30');
  const [parcela, setParcela] = useState<number | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(valorImovel) - parseFloat(entrada);
    const r = parseFloat(taxaJuros) / 100 / 12;
    const n = parseFloat(prazo) * 12;

    if (P > 0 && r > 0 && n > 0) {
      const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setParcela(monthlyPayment);
    } else {
      setParcela(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Financiamento</CardTitle>
        <CardDescription>Simule o valor da sua parcela</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="valor-imovel">Valor do Imóvel (R$)</Label>
          <Input id="valor-imovel" value={valorImovel} onChange={(e) => setValorImovel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="entrada">Entrada (R$)</Label>
          <Input id="entrada" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="taxa-juros">Taxa de Juros Anual (%)</Label>
          <Input id="taxa-juros" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="prazo">Prazo (anos)</Label>
          <Input id="prazo" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
        </div>
        <Button onClick={handleCalculate} className="w-full">Calcular</Button>
        {parcela !== null && (
          <div className="text-center pt-4">
            <p className="text-gray-600">Valor aproximado da parcela:</p>
            <p className="text-2xl font-bold text-primary">
              {parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingCalculator;
