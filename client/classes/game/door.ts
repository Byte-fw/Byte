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
    automatic?: {
        distance: number;
        rate?: number;
    };
};

/**
 * Door system class. Useful when dealing with doors without worrying about synchrnozation.
 */
export class CDoor {
    private systemHash: string;
    private doors: Array<DoorInitializer>;
    private config?: DoorSystemConfig;
    constructor(doors: Array<DoorInitializer>, customSystemHash?: string, config?: DoorSystemConfig) {
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
        const { openRatio, holdOpen, automatic } = config;
        if (openRatio)
            DoorSystemSetOpenRatio(systemHash, openRatio, true, true);

        if (holdOpen)
            DoorSystemSetHoldOpen(systemHash, holdOpen);

        if (automatic) {
            const { distance, rate } = automatic;
            DoorSystemSetAutomaticDistance(systemHash, distance, true, true);
            if (rate) DoorSystemSetAutomaticRate(systemHash, rate, true, true);
        }
    }

    public getSystemHash = () => this.systemHash;
    public getDoors = () => this.doors;
    public getConfig = () => this.config;

    public destroy = () => RemoveDoorFromSystem(GetHashKey(this.systemHash));
};