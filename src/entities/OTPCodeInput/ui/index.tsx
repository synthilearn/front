import OTPInput from 'react-otp-input';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import '../styles/styles.scss';
import { Flex, Typography } from 'antd';

interface IEnterCode {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
}

export const OTPCodeInput = ({ otp, setOtp }: IEnterCode) => {
  return (
    <Flex align={'center'} gap={15} vertical>
      <Typography.Text>Введите код отправленный на вашу почту</Typography.Text>
      <CodeContainer>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputStyle={'my-input'}
          placeholder={'123456'}
          renderSeparator={<span style={{ width: '10px' }}></span>}
          renderInput={props => <input {...props} />}
        />
      </CodeContainer>
    </Flex>
  );
};

const CodeContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
