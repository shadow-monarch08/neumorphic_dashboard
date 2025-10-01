import {
  forwardRef,
  useRef,
  useImperativeHandle,
  type ComponentRef,
  useEffect,
} from "react";
import { Player } from "@lordicon/react";

// This is the type for the icon data JSON. If the library doesn't export it,
// you can safely use 'any'.
type IconData = any;

// This trick gets the exact instance type of the Player component for our ref.
type PlayerRef = ComponentRef<typeof Player>;

// 1. Define the component's props with types
interface LordIconPlayerProps {
  icon: IconData;
  size: number;
  color?: string;
  moreStyle?: string;
  infinite?: boolean;
}

// 2. Use the types in the forwardRef generic: forwardRef<RefType, PropsType>
const LordIconPlayer = forwardRef<PlayerRef, LordIconPlayerProps>(
  ({ icon, size, color, moreStyle = "", infinite = false }, ref) => {
    // 3. The internal ref must also be correctly typed
    const playerRef = useRef<PlayerRef>(null);

    // This hook exposes the internal playerRef to the parent component
    useImperativeHandle(ref, () => playerRef.current!, [playerRef.current]);

    useEffect(() => {
      if (infinite && playerRef.current) {
        playerRef.current.playFromBeginning();
      }
    }, [infinite]);

    return (
      <div className={`inline-block h-fit w-fit ${moreStyle}`}>
        <Player
          ref={playerRef}
          icon={icon}
          size={size}
          colorize={color}
          onComplete={() => infinite && playerRef.current?.playFromBeginning()}
        />
      </div>
    );
  }
);

LordIconPlayer.displayName = "LordIconPlayer";

export default LordIconPlayer;
