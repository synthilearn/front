import OTPInput from 'react-otp-input';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import '../styles/styles.scss';

interface IEnterCode {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
}

export const OTPCodeInput = ({ otp, setOtp }: IEnterCode) => {
  return (
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
  );
};

const CodeContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
