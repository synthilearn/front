import { Button, Flex, Modal } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IWordsData, IWordTemplate } from 'shared/interfaces';
import { useState } from 'react';
import TemplateModal from 'features/TemplateModal';

interface IProps {
  open: boolean;
  onClose: () => void;
  refetchWords: () => void;
}

const TemplatesModal = ({ open, onClose, refetchWords }: IProps) => {
  const [templateId, setTemplateId] = useState<string>();
  const { data: templatesData } = useQuery({
    queryKey: ['wordsTemplates'],
    queryFn: () => {
      return $api.get<IBackendRes<IWordTemplate[]>>(
        'dictionary-service/v1/template/all',
      );
    },
  });
  return (
    <>
      <Modal
        centered
        title={'Шаблоны слов'}
        width={600}
        open={open}
        onCancel={onClose}
        okButtonProps={{
          style: { display: 'none' },
        }}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
      >
        <Flex
          vertical
          gap={5}
          wrap={'wrap'}
          align={'flex-start'}
          style={{ maxHeight: '500px' }}
        >
          {templatesData?.data?.resultData &&
            templatesData?.data?.resultData?.map(({ id, name }) => (
              <Button key={id} type={'link'} onClick={() => setTemplateId(id)}>
                {name}
              </Button>
            ))}
        </Flex>
      </Modal>
      <TemplateModal
        templateId={templateId}
        onClose={() => setTemplateId(undefined)}
        onCloseTemplatesModal={onClose}
        refetchWords={refetchWords}
      />
    </>
  );
};

export default TemplatesModal;
