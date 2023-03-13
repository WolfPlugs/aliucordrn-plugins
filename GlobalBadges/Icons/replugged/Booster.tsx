import { getByProps } from 'aliucord/metro';
const { SvgXml } = getByProps("Circle", "Rect", "Shape")

const booster = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38">
    <path
      fill="#7289da"
      d="m19.666,0.0005l-12.666,12.666l0,12.667l12.666,12.666l12.667,-12.666l0,-12.667l-12.667,-12.666zm9.5,24.035l-9.5,9.5l-9.499,-9.5l0,-10.07l9.499,-9.5l9.5,9.5l0,10.07z"
    />
    <path
      fill="#7289da"
      d="m13.333,15.2955l0,7.41l6.333,6.333l6.334,-6.333l0,-7.41l-6.334,-6.333l-6.333,6.333z"
    />
  </svg>
`

export default () => <SvgXml height={24} width={24} resizeMode="contain" marginHorizontal={4} xml={booster} />