import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import FirebaseTestComponent from '@/components/examples/FirebaseTestComponent';

const FirebaseTestPage = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teste do Firebase</h1>
          <p className="text-muted-foreground">
            Configure e teste a conexão com o Firebase para o CRM Imobiliário
          </p>
        </div>
        
        <FirebaseTestComponent />
      </div>
    </PageLayout>
  );
};

export default FirebaseTestPage; 