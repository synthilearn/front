import {
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  InputRef,
  MenuProps,
  Modal,
  notification,
  Tag,
  Tooltip,
} from 'antd';
import { TYPES_WORD_OPTIONS } from 'shared/const';
import {
  ChangeEvent,
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ETagColors } from 'shared/enums';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { IBackendRes, ITranslation, IWord, IWorkarea } from 'shared/interfaces';
import { $api } from 'shared/api';
import { isSingleWordOrPhrase } from 'shared/helpers/isSingleWord';
import styled from 'styled-components';
import { TPartsOfSpeech } from 'shared/types';
import { useQuery } from '@tanstack/react-query';

const tagInputStyle: CSSProperties = {
  width: 140,
  height: 40,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const tagPlusStyle: CSSProperties = {
  height: 40,
  width: 140,
  borderStyle: 'dashed',
};

interface IProps {
  wordId: string;
  onClose: () => void;
  dictionaryId: string;
  refetchWords: () => void;
}

const ViewWordModal = ({
  wordId,
  onClose,
  dictionaryId,
  refetchWords,
}: IProps) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [tags, setTags] = useState<ITranslation[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [submittable, setSubmittable] = useState<boolean>(false);

  const { mutate: editWord, isPending: editingWord } = useMutation({
    mutationFn: (payload: IWord) => {
      return $api.post<IWord>('dictionary-service/v1/phrase', payload);
    },
    onSuccess: async () => {
      refetchWords();
      notification.success({
        message: undefined,
        description: 'Слово отредактировано!',
      });
      onClose();
    },
  });

  const { mutate: deleteWord, isPending: deletingWord } = useMutation({
    mutationFn: () => {
      return $api.delete<IWord>(`dictionary-service/v1/phrase/${wordId}`);
    },
    onSuccess: async () => {
      refetchWords();
      notification.success({
        message: undefined,
        description: `Слово ${wordData.data.resultData.text} удалено!`,
      });
      refetchWords();
      onClose();
    },
  });

  const { data: wordData } = useQuery({
    queryKey: ['word'],
    enabled: !!wordId,
    queryFn: () => {
      return $api.get<IBackendRes<IWord>>(
        `dictionary-service/v1/phrase/${wordId}`,
      );
    },
  });

  const handleEditWord = async () => {
    const payload: IWord = {
      dictionaryId: dictionaryId,
      id: wordId,
      text: values.text,
      type: isSingleWordOrPhrase(values.text) ? 'WORD' : 'PHRASE',
      phraseTranslates: tags,
    };
    editWord(payload);
  };

  const handleClose = (removedTag: ITranslation) => {
    const newTags = tags.filter(
      tag => tag.translationText !== removedTag.translationText,
    );
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.some(tag => tag.translationText === inputValue)) {
      setTags([...tags, { translationText: inputValue, partOfSpeech: 'NOUN' }]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...JSON.parse(JSON.stringify(tags))];
    newTags[editInputIndex].text = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const choosePartOfSpeech = (key: TPartsOfSpeech, index: number) => {
    const newTags = [...JSON.parse(JSON.stringify(tags))];
    newTags[index].partOfSpeech = key;
    setTags(newTags);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(!!tags.length))
      .catch(() => setSubmittable(false));
  }, [form, values, tags.length]);

  useEffect(() => {
    if (!open) {
      form.setFieldValue('text', '');
      setTags([]);
    }
  }, [open]);

  useEffect(() => {
    if (!!wordData?.data) {
      setTags(
        wordData.data.resultData.phraseTranslates.map(translate => translate),
      );
      form.setFieldValue('text', wordData.data.resultData.text);
    }
  }, [wordData?.data]);

  return (
    <Modal
      centered
      width={600}
      open={!!wordId}
      onCancel={onClose}
      okText={'Создать'}
      title={'Редактирование слова'}
      footer={
        <Flex style={{ marginTop: 30 }} justify={'space-between'}>
          <Button loading={deletingWord} onClick={() => deleteWord()} danger>
            Удалить
          </Button>
          <Button
            loading={editingWord}
            disabled={!submittable}
            onClick={handleEditWord}
          >
            Сохранить
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={'Введите слово'}
          name={'text'}
          rules={[
            {
              required: true,
              message: 'Введите слово',
            },
          ]}
        >
          <Input placeholder={'word'} />
        </Form.Item>
        <Form.Item label={'Добавьте переводы'}>
          <Flex style={{ marginTop: '10px' }} gap="12px 6px" wrap="wrap">
            {tags.map<ReactNode>((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag.translationText}
                    size="small"
                    style={tagInputStyle}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.translationText.length > 20;
              const tagElem = (
                <Dropdown
                  trigger={['hover']}
                  placement="bottom"
                  menu={{
                    items: TYPES_WORD_OPTIONS.map(({ label, value }) => ({
                      label,
                      key: value,
                      onClick: (elem: any) => {
                        choosePartOfSpeech(elem.key, index);
                      },
                    })),
                    selectedKeys: [tag.partOfSpeech],
                  }}
                >
                  <TagStyled
                    // @ts-ignore
                    color={ETagColors[index]}
                    key={tag.translationText}
                    closable
                    style={{ userSelect: 'none' }}
                    onClose={() => handleClose(tag)}
                  >
                    <span
                      onDoubleClick={e => {
                        if (index !== 0) {
                          setEditInputIndex(index);
                          setEditInputValue(tag.translationText);
                          e.preventDefault();
                        }
                      }}
                    >
                      {isLongTag
                        ? `${tag.translationText.slice(0, 20)}...`
                        : tag.translationText}
                    </span>
                  </TagStyled>
                </Dropdown>
              );
              return isLongTag ? (
                <Tooltip title={tag.translationText} key={tag.translationText}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}
            {inputVisible ? (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                style={tagInputStyle}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            ) : (
              <TagStyled
                style={tagPlusStyle}
                icon={<PlusOutlined />}
                onClick={showInput}
              >
                Добавить
              </TagStyled>
            )}
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ViewWordModal;

const TagStyled = styled(Tag)`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
`;
