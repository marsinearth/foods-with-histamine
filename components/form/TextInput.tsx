import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { Input, type InputProps } from 'tamagui';

type TamaguiTextInputProps<T extends FieldValues> = UseControllerProps<T> & {
  inputProps?: Omit<InputProps, 'name'>;
};

const TamaguiTextInput = <T extends FieldValues>({
  name,
  control,
  inputProps,
}: TamaguiTextInputProps<T>) => {
  const {
    field: { onChange, onBlur, ...rest },
  } = useController({
    control,
    name,
  });

  return <Input onChangeText={onChange} {...rest} {...inputProps} />;
};

export default TamaguiTextInput;
