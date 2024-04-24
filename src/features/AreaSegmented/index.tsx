import { ConfigProvider, Segmented } from 'antd';
import styled from 'styled-components';
import { COLOR_PRIMARY } from 'shared/const';

interface IAreaSegmented {
  options: string[];
  onChange: (value: string) => void;
}

const AreaSegmented = ({ options, onChange }: IAreaSegmented) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemSelectedBg: '#30538A',
            colorBgContainer: '#51A4F1',
          },
        },
      }}
    >
      <SegmentedStyled onChange={onChange} options={options} block />
    </ConfigProvider>
  );
};

export default AreaSegmented;

const SegmentedStyled = styled(Segmented)`
  background-color: ${COLOR_PRIMARY};
  border-radius: 0;
  padding: 0;
  border-left: 2px solid #1b5583;

  & .ant-segmented-item {
    height: 80px;
    position: relative;
    border-right: 2px solid #1b5583;
    border-radius: 0;
    font-size: 16px;
    font-weight: 500;

    & div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
