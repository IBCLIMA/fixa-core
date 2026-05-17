import { Composition } from "remotion";
import { FixaDemo } from "./FixaDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FixaDemo"
      component={FixaDemo}
      durationInFrames={30 * 30} // 30 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
