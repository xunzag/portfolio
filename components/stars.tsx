import { Stars as DreiStars } from "@react-three/drei"

const Stars = () => {
  return <DreiStars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
}

export default Stars; 