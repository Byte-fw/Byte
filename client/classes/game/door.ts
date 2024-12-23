import { ByteGameObject } from "../../shared/classes/byteObject";
import { uuid } from "../../shared/utils/uuid";

export type DoorInitializer = {
    modelHash: number;
    coords: Vector3;
    local?: boolean;
};

export type DoorSystemConfig = {
    /**
     * Refered to as `ajar` in the [natives docs](https://docs.fivem.net/natives/?_0xB6E6FBA95C7324AC).
     * Value goes from `-1.0` to `1.0`.
    */
    openRatio?: number;
    holdOpen?: boolean;
    removeSpring?: boolean;
    automatic?: {
        distance: number;
        rate?: number;
    };
};

export enum DoorState {
    UNLOCKED = 0,
    LOCKED = 1,
    DOORSTATE_FORCE_LOCKED_UNTIL_OUT_OF_AREA = 2,
    DOORSTATE_FORCE_UNLOCKED_THIS_FRAME = 3,
    DOORSTATE_FORCE_LOCKED_THIS_FRAME = 4,
    DOORSTATE_FORCE_OPEN_THIS_FRAME = 5,
    DOORSTATE_FORCE_CLOSED_THIS_FRAME = 6
};

/**
 * Door system class. Useful when dealing with doors without worrying about synchrnozation.
 */
export class CDoor extends ByteGameObject {
    private systemHash: string;
    private doors: Array<DoorInitializer>;
    private config?: DoorSystemConfig;
    constructor(doors: Array<DoorInitializer>, customSystemHash?: string, config?: DoorSystemConfig) {
        super();
        this.systemHash = customSystemHash || uuid();
        doors.forEach(door => this.addDoor(door));
        if (config) this.configure(config);
        this.doors = doors;
        this.config = config;
    }

    protected addDoor(data: DoorInitializer) {
        const { modelHash, local, coords: { x, y, z } } = data;
        AddDoorToSystem(GetHashKey(this.systemHash), modelHash, x, y, z, false, false, local ?? false);
    }

    private configure(config: DoorSystemConfig) {
        const systemHash = GetHashKey(this.systemHash);
        const { openRatio, holdOpen, automatic, removeSpring } = config;
        if (openRatio)
            DoorSystemSetOpenRatio(systemHash, openRatio, true, true);

        if (holdOpen)
            DoorSystemSetHoldOpen(systemHash, holdOpen);

        if (removeSpring)
            DoorSystemSetSpringRemoved(systemHash, removeSpring, true, true);

        if (automatic) {
            const { distance, rate } = automatic;
            DoorSystemSetAutomaticDistance(systemHash, distance, true, true);
            if (rate) DoorSystemSetAutomaticRate(systemHash, rate, true, true);
        }
    }

    public getSystemHash = () => this.systemHash;
    public getDoors = () => this.doors;
    public getConfig = () => this.config;

    public setState = (state: DoorState) => DoorSystemSetDoorState(GetHashKey(this.systemHash), state, true, true);
    public getState = (): DoorState => DoorSystemGetDoorState(GetHashKey(this.systemHash));

    public destroy = () => RemoveDoorFromSystem(GetHashKey(this.systemHash));

    public asString() {
        return `CDoor { systemHash: ${this.systemHash} }`;
    }
};