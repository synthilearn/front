import {
  Button,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Select,
  SelectProps,
  Switch,
} from 'antd';
import { TYPES_WORD_OPTIONS } from 'shared/const';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useDictionaryState } from 'widgets/DictionaryWidget/state/useDictionaryState';

interface IProps {
  open: boolean;
  onClose: () => void;
  refetchWords: () => void;
}

const dateFormat = 'YYYY-MM-DD';

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options: TYPES_WORD_OPTIONS,
  placeholder: 'Выберите типы слов',
  maxTagCount: 'responsive',
};

const { RangePicker } = DatePicker;

export const DictionarySettingsDrawer = ({
  open,
  onClose,
  refetchWords,
}: IProps) => {
  const [form] = Form.useForm();
  const dictionarySettings = useDictionaryState(
    state => state.dictionarySettings,
  );
  const setDictionarySettings = useDictionaryState(
    state => state.setDictionarySettings,
  );

  const handleSave = () => {
    form.validateFields().then(values => {
      const [dateFrom, dateTo] = values.dates;
      delete values.dates;
      setDictionarySettings({
        ...values,
        dateFrom: dayjs(dateFrom).format(dateFormat),
        dateTo: dayjs(dateTo).format(dateFormat),
      });

      setTimeout(() => {
        refetchWords();
        onClose();
      }, 50);
    });
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Drawer
      title={'Настройка словаря'}
      width={500}
      open={open}
      onClose={onClose}
      footer={
        <FooterWrapper gap={12} justify={'flex-end'}>
          <Button onClick={onClose}>Назад</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </FooterWrapper>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...dictionarySettings,
          dates: [
            dayjs(dictionarySettings?.dateFrom, dateFormat),
            dayjs(dictionarySettings?.dateTo, dateFormat),
          ],
        }}
      >
        <Flex vertical>
          <TitleStyled>Показывать переводы</TitleStyled>
          <Form.Item valuePropName={'checked'} name={'showTranslation'}>
            <Switch />
          </Form.Item>
          <TitleStyled>Фильтровать по</TitleStyled>
          <Form.Item
            label={'Типу слова'}
            name={'phraseTypes'}
            rules={[
              {
                required: true,
                message: 'Выберите хотя бы один тип',
              },
            ]}
          >
            <Select
              mode={'multiple'}
              options={[
                {
                  label: 'Слово',
                  value: 'WORD',
                },
                {
                  label: 'Фраза',
                  value: 'PHRASE',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={'Частям речи'}
            name={'partsOfSpeech'}
            rules={[
              {
                required: true,
                message: 'Выберите хотя бы одну часть речи',
              },
            ]}
          >
            <Select {...sharedProps} />
          </Form.Item>
          <Form.Item label={'Дате добавления слов'} name={'dates'}>
            <RangePicker format={dateFormat} />
          </Form.Item>

          <TitleStyled>Группировать по</TitleStyled>

          <Form.Item name={'groups'}>
            <Select
              mode={'multiple'}
              options={[
                {
                  label: 'Частям речи',
                  value: 'PART_OF_SPEECH',
                },
                {
                  label: 'Алфавиту',
                  value: 'LETTER',
                },
              ]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Drawer>
  );
};

const TitleStyled = styled.div`
  font-weight: 500;
  font-size: 22px;
  margin: 10px 0;
`;

const FooterWrapper = styled(Flex)`
  padding-top: 15px;
  padding-bottom: 10px;
`;
