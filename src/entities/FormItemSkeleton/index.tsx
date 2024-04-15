import styled from 'styled-components';
import { Flex, Skeleton } from 'antd';

interface IProps {
  width: string;
}

const FormItemSkeleton = ({ width }: IProps) => {
  return (
    <Flex vertical gap={8} justify={'flex-start'}>
      <Label />
      <SkeletonInput style={{ width: width }} />
    </Flex>
  );
};

export default FormItemSkeleton;

const SkeletonInput = styled(Skeleton.Input)<{ $width: string }>`
  span {
    height: 40px !important;
  }
`;

const Label = styled.span`
  background: rgba(0, 0, 0, 0.06);
  width: 60px;
  height: 20px;
`;
