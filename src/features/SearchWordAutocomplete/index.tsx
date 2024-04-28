import { AutoComplete, Flex, Spin } from 'antd';
import { useInput } from 'shared/hooks/useInput';
import { useMemo, useState } from 'react';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IUserData, IWord } from 'shared/interfaces';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import styled from 'styled-components';
import ViewWordModal from 'features/ViewWordModal';

interface IProps {
  refetchWords: () => void;
}

const SearchWordAutocomplete = ({ refetchWords }: IProps) => {
  const inputProps = useInput();
  const debouncedInputValue = useDebounce(inputProps.value, 1000);
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [choosenWordId, setChoosenWordId] = useState<string | null>();

  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const dictionaryId = useMemo(() => {
    return currentWorkarea?.widgets?.find(
      widget => widget.type === 'DICTIONARY',
    )?.id;
  }, [currentWorkarea]);

  const {
    data: wordsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['searchWords', debouncedInputValue],
    enabled: !!debouncedInputValue,
    queryFn: () => {
      return $api.get<IBackendRes<IWord[]>>(
        `dictionary-service/v1/phrase/by-part/${debouncedInputValue}?dictionaryId=${dictionaryId}`,
      );
    },
  });

  const onSelect = (data: string) => {
    setChoosenWordId(
      wordsData.data.resultData.find(word => word.text === data)?.id ?? null,
    );
  };

  const divideWord = (searchTextValue: string, searchWordText: string) => {
    const index = searchWordText.indexOf(searchTextValue);
    if (index === -1) {
      return [searchWordText, '', ''];
    }

    return [
      searchWordText.slice(0, index),
      searchWordText.slice(index, index + searchTextValue.length),
      searchWordText.slice(index + searchTextValue.length),
    ];
  };

  const getTranslationElement = (
    wordText: string,
    isTitle: boolean = false,
  ) => {
    const [firstPart, neededPart, lastPart] = divideWord(
      inputProps.value,
      wordText,
    );

    return (
      <span>
        <span>{firstPart}</span>
        <HighlightText $isTitle={isTitle}>{neededPart}</HighlightText>
        <span>{lastPart}</span>
      </span>
    );
  };

  return (
    <>
      <AutoComplete
        value={inputProps.value}
        {...inputProps}
        options={
          isFetching
            ? []
            : wordsData?.data?.resultData?.map(word => ({
                value: word.text,
                label: (
                  <Flex vertical>
                    {getTranslationElement(word.text, true)}
                    <TranslationsBlock>
                      {word.phraseTranslates.map(translate =>
                        getTranslationElement(translate.translationText),
                      )}
                    </TranslationsBlock>
                  </Flex>
                ),
              }))
        }
        onSelect={onSelect}
        notFoundContent={
          debouncedInputValue && (
            <NoData align={'center'} justify={'center'}>
              {isFetching ? <Spin /> : 'Слов не найдено'}
            </NoData>
          )
        }
        placeholder={'Поиск слова'}
        style={{ width: '300px' }}
      />
      <ViewWordModal
        wordId={choosenWordId}
        onClose={() => setChoosenWordId(null)}
        dictionaryId={dictionaryId}
        refetchWords={refetchWords}
      />
    </>
  );
};

export default SearchWordAutocomplete;

const TranslationsBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  color: grey;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HighlightText = styled.span<{ $isTitle: boolean }>`
  background: ${({ $isTitle }) => (!$isTitle ? 'yellow' : '#102C54')};
`;

const NoData = styled(Flex)`
  padding: 10px;
`;
