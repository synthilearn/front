import styled from 'styled-components';
import { Spin } from 'antd';

const AdaptiveLoader = () => {
  return (
    <SpinWrapper>
      <Spin />
    </SpinWrapper>
  );
};

export default AdaptiveLoader;

const SpinWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
