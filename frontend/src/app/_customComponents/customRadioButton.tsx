import React from 'react';

type CustomRadioButtonProps = {
  edit: boolean;
  falseText: string;
  trueText: string;
  value: string;
  paramkey?: string;
  id?: number;
  onChangeValue?: () => void;
  defaultValue?: string;
};

const CustomRadioButton: React.FC<CustomRadioButtonProps> = (props) => {
  const { edit, falseText, trueText, value, paramkey, id, onChangeValue, defaultValue } = props;
  return (
    <>
      <div></div>
    </>
  );
};

export default React.memo(CustomRadioButton);
