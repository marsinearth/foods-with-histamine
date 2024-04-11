import { useCallback } from 'react';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { Input, type InputProps } from 'tamagui';

type TamaguiTextInputProps<T extends FieldValues> = UseControllerProps<T> & {
  inputProps?: Omit<InputProps, 'name'>;
  onBlurCb?: () => void;
};

const TamaguiTextInput = <T extends FieldValues>({
  name,
  control,
  inputProps,
  onBlurCb,
}: TamaguiTextInputProps<T>) => {
  const {
    field: { onChange, onBlur, ...rest },
  } = useController({
    control,
    name,
  });

  const customOnBlur = useCallback(() => {
    onBlur();
    if (typeof onBlurCb === 'function') {
      onBlurCb();
    }
  }, [onBlurCb, onBlur]);

  return <Input onChangeText={onChange} onBlur={customOnBlur} {...rest} {...inputProps} />;
};

export default TamaguiTextInput;
