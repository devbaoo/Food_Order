import { Image } from "react-native"

interface IconProps {
    icon: any;
    size?: number;
    width?: number;
    height?: number;
}

const Icon: React.FC<IconProps> = ({ ...props }) => {
    const { icon, size, width, height } = props;

    return (
        <Image source={icon} style={{ width: size ?? width, height: size ?? height }} resizeMode="contain" />
    )
}

export default Icon;