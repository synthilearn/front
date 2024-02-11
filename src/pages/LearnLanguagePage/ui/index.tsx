import AreaSegmented from 'features/AreaSegmented';

const segmented = ['Словарь', 'Книги', 'Игры', 'Статистика'];

export const LearnLanguagePage = () => {
  return (
    <div>
      <AreaSegmented
        options={segmented}
        onChange={value => console.log(value)}
      />
    </div>
  );
};
