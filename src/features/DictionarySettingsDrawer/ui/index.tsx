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
import { useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

interface IProps {
  open: boolean;
  onClose: () => void;
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

export const DictionarySettingsDrawer = ({ open, onClose }: IProps) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      title={'Настройка словаря'}
      width={500}
      open={open}
      onClose={onClose}
      footer={
        <FooterWrapper gap={12} justify={'flex-end'}>
          <Button onClick={onClose}>Назад</Button>
          <Button>Сохранить</Button>
        </FooterWrapper>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          showTranslates: true,
          partsOfSpeech: ['NOUN'],
        }}
      >
        <Flex vertical>
          <TitleStyled>Показывать переводы</TitleStyled>
          <Form.Item valuePropName={'checked'} name={'showTranslates'}>
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
          <Form.Item label={'Дате добавления слов'}>
            <RangePicker
              defaultValue={[
                dayjs('2024-04-23', dateFormat),
                dayjs('2024-04-26', dateFormat),
              ]}
              format={dateFormat}
            />
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
