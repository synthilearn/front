import {
  Dropdown,
  Flex,
  Form,
  Input,
  InputRef,
  MenuProps,
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
import Modal from 'shared/components/Modal';
import { useMutation } from '@tanstack/react-query';
import { ITranslation, IWord } from 'shared/interfaces';
import { $api } from 'shared/api';
import { isSingleWordOrPhrase } from 'shared/helpers/isSingleWord';
import styled from 'styled-components';
import { TPartsOfSpeech } from 'shared/types';

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
  open: boolean;
  onClose: () => void;
  dictionaryId: string;
  refetchWords: () => void;
}

const AddWordModal = ({
  open,
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

  const { mutate: createWord, isPending: creatingWord } = useMutation({
    mutationFn: (payload: Omit<IWord, 'id'>) => {
      return $api.post<IWord>('dictionary-service/v1/phrase', payload);
    },
    onSuccess: async () => {
      refetchWords();
      notification.success({
        message: undefined,
        description: 'Слово добавлено!',
      });
      onClose();
    },
  });

  const handleCreateWord = async () => {
    const payload: Omit<IWord, 'id'> = {
      dictionaryId: dictionaryId,
      text: values.text,
      type: isSingleWordOrPhrase(values.text) ? 'WORD' : 'PHRASE',
      translations: tags,
    };
    createWord(payload);
  };

  const handleClose = (removedTag: ITranslation) => {
    const newTags = tags.filter(tag => tag.text !== removedTag.text);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.some(tag => tag.text === inputValue)) {
      setTags([...tags, { text: inputValue, partOfSpeech: 'NOUN' }]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    console.log('зашел');
    const newTags = [...JSON.parse(JSON.stringify(tags))];
    newTags[editInputIndex].text = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
    console.log('вышел');
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

  return (
    <Modal
      width={600}
      open={open}
      onClose={onClose}
      okText={'Создать'}
      okLoading={creatingWord}
      onOk={handleCreateWord}
      okDisabled={!submittable}
      title={'Создание слова'}
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
          <Flex gap="8px 4px" wrap="wrap">
            {tags.map<ReactNode>((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag.text}
                    size="small"
                    style={tagInputStyle}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.text.length > 20;
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
                    key={tag.text}
                    closable
                    style={{ userSelect: 'none' }}
                    onClose={() => handleClose(tag)}
                  >
                    <span
                      onDoubleClick={e => {
                        if (index !== 0) {
                          setEditInputIndex(index);
                          setEditInputValue(tag.text);
                          e.preventDefault();
                        }
                      }}
                    >
                      {isLongTag ? `${tag.text.slice(0, 20)}...` : tag.text}
                    </span>
                  </TagStyled>
                </Dropdown>
              );
              return isLongTag ? (
                <Tooltip title={tag.text} key={tag.text}>
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

export default AddWordModal;

const TagStyled = styled(Tag)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
`;
