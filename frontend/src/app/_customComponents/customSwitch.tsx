import React from 'react';

type CustomSwitchProps = {
  edit: boolean;
  falseText: string;
  trueText: string;
  value: boolean;
  paramkey?: string;
  type?: 'oneLabel' | 'twoLabel';
  id?: number;
  onChangeValue?: () => void;
  defaultValue?: boolean;
};

const CustomSwitch: React.FC<CustomSwitchProps> = (props) => {
  const { edit, falseText, trueText, value, paramkey, id, type, onChangeValue, defaultValue } = props;

  return (
    <>
      <div></div>
    </>
  );
};

export default React.memo(CustomSwitch);
