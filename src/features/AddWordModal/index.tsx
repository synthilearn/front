import {
  Flex,
  Form,
  Input,
  InputRef,
  notification,
  Select,
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
import { IWord } from 'shared/interfaces';
import { $api } from 'shared/api';
import { isSingleWordOrPhrase } from 'shared/helpers/isSingleWord';
import styled from 'styled-components';

const tagInputStyle: CSSProperties = {
  width: 120,
  height: 32,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

interface IProps {
  open: boolean;
  onClose: () => void;
  dictionaryId: string;
}

const AddWordModal = ({ open, onClose, dictionaryId }: IProps) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [tags, setTags] = useState<string[]>([]);
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
      onClose();
    },
  });

  const handleCreateWord = async () => {
    const payload: Omit<IWord, 'id'> = {
      dictionaryId: dictionaryId,
      text: values.text,
      type: isSingleWordOrPhrase(values.text) ? 'WORD' : 'PHRASE',
      partOfSpeech: values.partOfSpeech,
      translations: tags,
    };
    await createWord(payload);
    await createWord(payload);

    notification.success({
      message: undefined,
      description: 'Слово добавлено!',
    });
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const tagPlusStyle: CSSProperties = {
    height: 32,
    width: 120,
    borderStyle: 'dashed',
  };

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(!!tags.length))
      .catch(() => setSubmittable(false));
  }, [form, values, tags.length]);
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
        <Form.Item
          label={'Выберите тип речи'}
          name={'partOfSpeech'}
          rules={[
            {
              required: true,
              message: 'Выберите тип речи',
            },
          ]}
        >
          <Select
            placeholder={'Выберите тип речи'}
            style={{ width: 300 }}
            options={TYPES_WORD_OPTIONS}
          />
        </Form.Item>
        <Form.Item label={'Добавьте переводы'}>
          <Flex gap="8px 4px" wrap="wrap">
            {tags.map<ReactNode>((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag}
                    size="small"
                    style={tagInputStyle}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.length > 20;
              const tagElem = (
                <TagStyled
                  // @ts-ignore
                  color={ETagColors[index]}
                  key={tag}
                  closable
                  style={{ userSelect: 'none' }}
                  onClose={() => handleClose(tag)}
                >
                  <span
                    onDoubleClick={e => {
                      if (index !== 0) {
                        setEditInputIndex(index);
                        setEditInputValue(tag);
                        e.preventDefault();
                      }
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </TagStyled>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
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
  font-size: 16px;
`;
