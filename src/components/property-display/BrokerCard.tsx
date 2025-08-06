
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const BrokerCard = ({ broker, propertyId }: { broker: any, propertyId: string }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!broker) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'visits'), {
        propertyId,
        brokerId: broker.id, // Assuming broker object has an id
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        visitDate: formData.date,
        message: formData.message,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Agendamento Enviado!",
        description: "O corretor entrará em contato em breve.",
      });
      setFormData({ name: '', email: '', phone: '', date: '', message: '' });
    } catch (error) {
      console.error("Error scheduling visit: ", error);
      toast({
        title: "Erro",
        description: "Não foi possível agendar a visita. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Agent Info */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <img src={broker.imageUrl || 'https://placehold.co/100x100/E2E8F0/4A5568?text=GP'} alt={`Foto de ${broker.name}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-200" />
        <h3 className="text-xl font-semibold text-gray-800">{broker.name}</h3>
        <p className="text-gray-500">Corretor de Imóveis</p>
        <div className="mt-4 space-y-2">
          <a href={`mailto:${broker.email}`} className="block w-full">
            <Button className="w-full bg-brand-blue hover:bg-brand-blue-dark">
              <Mail className="mr-2 h-4 w-4" /> E-mail
            </Button>
          </a>
          <a href={`tel:${broker.phone}`} className="block w-full">
            <Button className="w-full bg-gray-700 hover:bg-gray-800">
              <Phone className="mr-2 h-4 w-4" /> Telefone
            </Button>
          </a>
        </div>
      </div>

      {/* Agendar Visita Form */}

    </div>
  );
};

export default BrokerCard;
