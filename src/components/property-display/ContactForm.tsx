
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fale com o Corretor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Seu nome completo" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" type="tel" placeholder="(11) 99999-8888" />
        </div>
        <div>
          <Label htmlFor="message">Mensagem</Label>
          <Textarea id="message" placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações." />
        </div>
        <Button className="w-full">Enviar Mensagem</Button>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
