import { uuid } from "../../utils/uuid";
import { ByteGameObject } from "../byteObject";
import { IZone } from "./IZone";

export class CircleZone extends ByteGameObject implements IZone {
    private id: string;
    private center: Vector2;
    private radius: number;

    constructor(center: Vector2, radius: number) {
        super();
        this.id = uuid();
        this.center = center;
        this.radius = radius;
    }

    public getId = () => this.id;
    public getCenter = () => this.center;
    public isPointInside = (point: Vector2) => point.sub(this.center).length() <= this.radius;

    public override asString() {
        return `CircleZone { id: ${this.id} }`;
    }
};