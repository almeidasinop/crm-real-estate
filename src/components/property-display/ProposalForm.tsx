
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const proposalSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  proposalValue: z.number({ invalid_type_error: "Valor é obrigatório" }).positive('O valor da proposta deve ser positivo'),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  propertyId?: string;
}

const ProposalForm = ({ propertyId }: ProposalFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
  });

  const onSubmit = (data: ProposalFormData) => {
    // Aqui você pode adicionar a lógica para enviar a proposta para o Firebase ou API
    console.log({ ...data, propertyId });
    toast.success('Proposta enviada!', {
      description: 'O corretor responsável entrará em contato em breve.',
    });
    reset();
  };

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposalValue">Valor da Proposta (R$)</Label>
            <Input id="proposalValue" type="number" {...register('proposalValue', { valueAsNumber: true })} />
            {errors.proposalValue && <p className="text-sm text-red-500">{errors.proposalValue.message}</p>}
          </div>
          <Button type="submit" className="w-full">Enviar Proposta</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProposalForm;
