import { CheckCircle, ChevronDown } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { Adapt, Select, Sheet, type SelectProps } from 'tamagui';

export type Option = {
  name: string;
  value: string;
};

type TamaguiSelectProps<T extends FieldValues> = UseControllerProps<T> & {
  selectProps?: Omit<SelectProps, 'name'>;
  optionsLabel?: string;
  placeholder?: string;
  options: Option[];
  disabledValues?: any[];
};

const TamaguiSelect = <T extends FieldValues>({
  name,
  control,
  optionsLabel,
  options,
  placeholder,
  selectProps,
  defaultValue,
  disabledValues,
}: TamaguiSelectProps<T>) => {
  const {
    field: { onChange, ref, ...rest },
  } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <Select onValueChange={onChange} {...rest} {...selectProps}>
      <Select.Trigger flexShrink={1} iconAfter={ChevronDown}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          native
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport
          // to do animations:
          animation="quick"
          animateOnly={['transform', 'opacity']}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={120}
          flexShrink={1}
        >
          <Select.Group>
            <Select.Label>{optionsLabel}</Select.Label>
            {useMemo(
              () =>
                options.map(({ name, value }, i) => {
                  const disabledToSelect = disabledValues?.some(val => !!val && val === value);
                  return (
                    <Select.Item
                      index={i}
                      key={name}
                      value={value}
                      style={{
                        pointerEvents: disabledToSelect ? 'none' : 'auto',
                      }}
                    >
                      <Select.ItemText color={disabledToSelect ? '$gray7' : '$accentColor'}>
                        {name}
                      </Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <CheckCircle color="$green7" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [options, disabledValues]
            )}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  );
};

export default TamaguiSelect;
