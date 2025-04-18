import { Image } from "react-native"

interface IconProps {
    icon: any;
    size: number;
}

const Icon: React.FC<IconProps> = ({ ...props }) => {
    const { icon, size } = props;

    return (
        <Image source={icon} style={{ width: size, height: size }} />
    )
}

export default Icon;