import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src="/logo.png" className={`${props.className}`} />
    );
}
