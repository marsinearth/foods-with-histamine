import {
  Apple,
  Beaker,
  Bean,
  Beef,
  CupSoda,
  Drumstick,
  Egg,
  Fish,
  LeafyGreen,
  Milk,
  Nut,
  PiggyBank,
  Pizza,
  Shell,
  Soup,
  Utensils,
  Wheat,
  Wine,
} from '@tamagui/lucide-icons';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case '콩과식물':
      return <Bean size="$1.5" />;
    case '유제품':
      return <Milk size="$1.5" />;
    case '과일':
      return <Apple size="$1.5" />;
    case '견과류':
      return <Nut size="$1.5" />;
    case '곡물류':
      return <Wheat size="$1.5" />;
    case '어류':
      return <Fish size="$1.5" />;
    case '해산물':
      return <Shell size="$1.5" />;
    case '발효식품':
      return <Soup size="$1.5" />;
    case '적색육류':
      return <Beef size="$1.5" />;
    case '백색육류':
      return <Drumstick size="$1.5" />;
    case '알류':
      return <Egg size="$1.5" />;
    case '가공육류':
      return <PiggyBank size="$1.5" />;
    case '채소류':
      return <LeafyGreen size="$1.5" />;
    case '주류':
      return <Wine size="$1.5" />;
    case '음료':
      return <CupSoda size="$1.5" />;
    case '가공식품':
      return <Pizza size="$1.5" />;
    case '조미료':
      return <Beaker size="$1.5" />;
    default:
      return <Utensils size="$1.5" />;
  }
};
