import { Modal, notification, Table } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { $api } from 'shared/api';
import {
  IBackendRes,
  ITranslation,
  IWord,
  IWordTemplate,
} from 'shared/interfaces';
import { useMemo } from 'react';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';

interface IProps {
  templateId: string;
  onClose: () => void;
  onCloseTemplatesModal: () => void;
  refetchWords: () => void;
}
const TemplateModal = ({
  onClose,
  onCloseTemplatesModal,
  refetchWords,
  templateId,
}: IProps) => {
  const { data: templateData } = useQuery({
    queryKey: ['wordsTemplate'],
    enabled: !!templateId,
    queryFn: () => {
      return $api.get<
        IBackendRes<
          {
            phraseTranslates: ITranslation[];
            text: string;
            type: 'PHRASE' | 'WORD';
          }[]
        >
      >(`dictionary-service/v1/template/${templateId}`);
    },
  });

  const { mutate: addWords, isPending: addingWords } = useMutation({
    mutationFn: () => {
      return $api.post<IWord>(
        `dictionary-service/v1/template/execute/${templateId}`,
        {},
        {
          params: {
            dictionaryId,
          },
        },
      );
    },
    onSuccess: async () => {
      notification.success({
        message: undefined,
        description: 'Слова добавлены!',
      });
      onClose();
      onCloseTemplatesModal();

      setTimeout(() => {
        refetchWords();
      }, 300);
    },
  });

  const columns: any[] = [
    {
      title: 'Слово',
      dataIndex: 'text',
      key: 'word',
    },
    {
      title: 'Переводы',
      dataIndex: 'phraseTranslates',
      key: 'phraseTranslates',
      render: (translations: ITranslation[]) => {
        return (
          <div>
            {translations
              .map(translate => translate.translationText)
              .join(', ')}
          </div>
        );
      },
    },
  ];

  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const dictionaryId = useMemo(() => {
    return currentWorkarea?.widgets?.find(
      widget => widget.type === 'DICTIONARY',
    )?.id;
  }, [currentWorkarea]);
  return (
    <Modal
      title={'Добавление слов'}
      open={!!templateId}
      onCancel={onClose}
      okText={'Добавить'}
      cancelText={'Отмена'}
      centered
      onOk={() => addWords()}
    >
      <Table
        style={{ marginTop: '15px' }}
        dataSource={templateData?.data?.resultData}
        columns={columns}
        pagination={{
          pageSize: 7,
        }}
      />
    </Modal>
  );
};

export default TemplateModal;
