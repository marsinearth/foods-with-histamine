import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { TextArea, type TextAreaProps } from 'tamagui';

type TamaguiTextAreaProps<T extends FieldValues> = UseControllerProps<T> & {
  inputProps?: Omit<TextAreaProps, 'name'>;
};

const TamaguiTextArea = <T extends FieldValues>({
  name,
  control,
  inputProps,
}: TamaguiTextAreaProps<T>) => {
  const {
    field: { onChange, ...rest },
  } = useController({
    control,
    name,
  });

  return <TextArea onChangeText={onChange} {...rest} {...inputProps} />;
};

export default TamaguiTextArea;
