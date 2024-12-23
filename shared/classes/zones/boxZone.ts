import { uuid } from "../../utils/uuid";
import { ByteGameObject } from "../byteObject";
import { IZone } from "./IZone";

export class BoxZone extends ByteGameObject implements IZone {
    private id: string;
    private center: Vector2;
    private width: number;
    private height: number;

    constructor(center: Vector2, width: number, height: number) {
        super();
        this.id = uuid();
        this.center = center;
        this.width = width;
        this.height = height;
    }

    public getId = () => this.id;
    public getCenter = () => this.center;
    public isPointInside = (point: Vector2) => {
        const { x, y } = this.center;
        const { x: px, y: py } = point;
        return px >= x - this.width / 2
            && px <= x + this.width / 2
            && py >= y - this.height / 2
            && py <= y + this.height / 2;
    };

    public override asString() {
        return `BoxZone { id: ${this.id} }`;
    }
};