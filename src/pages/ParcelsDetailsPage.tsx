
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import GuadeloupeParcelDetail from '../components/GuadeloupeParcelDetail';
import usePageMetadata from '../hooks/use-page-metadata';

const ParcelsDetailsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Gestão de Propriedades na Guadeloupe',
    defaultDescription: 'Gerencie, monitore e otimize suas propriedades agrícolas em todo o arquipélago'
  });

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
        />

        <GuadeloupeParcelDetail />
      </div>
    </PageLayout>
  );
};

export default ParcelsDetailsPage;
