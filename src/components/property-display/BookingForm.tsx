import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Certifique-se de que este componente exista
import { toast } from 'sonner';

const BookingForm = () => {
  // Estado para controlar os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
  });

  // Estado para controlar o status de envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manipulador para atualizar o estado quando o usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Manipulador para o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Dados do formulário para envio:", formData);
    // Aqui você integraria a lógica para enviar os dados para sua API

    // Simulação de uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Pedido de agendamento enviado com sucesso!");
    setIsSubmitting(false);

    // Limpa o formulário após o envio
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      message: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agende uma Visita</CardTitle>
      </CardHeader>
      <CardContent>
        {/* O contêiner e o formulário que você solicitou */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Agendar uma Visita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="name" type="text" placeholder="Nome" value={formData.name} onChange={handleInputChange} required />
            <Input id="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <Input id="phone" type="tel" placeholder="Telefone" value={formData.phone} onChange={handleInputChange} required />
            <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required className="text-gray-500" />
            <Textarea id="message" placeholder="Mensagem (opcional)" value={formData.message} onChange={handleInputChange} rows={3} />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
