import { useTheme } from "tamagui";

export function theme<A extends React.FC>(Component: A) {
  const useWrapped = (props: IconProps | any) => {
    const token = props.fill ?? props.color ?? "color3";

    const color = useTheme()[token].get();

    return <Component {...props} fill={color} />;
  };

  return useWrapped;
}

export type IconProps = {
  fill?: string;
  width?: number;
  height?: number;
};
