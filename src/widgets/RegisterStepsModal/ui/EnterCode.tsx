import OTPInput from 'react-otp-input';
import { Dispatch, SetStateAction, useState } from 'react';
import styled, { css } from 'styled-components';
import './EnterCodeStyle.scss';

const InputCSS = css`
  width: 30px;
  height: 40px;
  border: none;
  background-color: inherit;
  font-size: 20px;
`;

interface IEnterCode {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
}

const EnterCode = ({ otp, setOtp }: IEnterCode) => {
  const [isError, setIsError] = useState(false);

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

export default EnterCode;

const CodeContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
