import { uuid } from "../../utils/uuid";
import { ByteGameObject } from "../byteObject";
import { IZone } from "./IZone";

export class PolygonZone extends ByteGameObject implements IZone {
    private id: string;
    private vertices: Array<Vector2>;
    private readonly center: Vector2;

    constructor(vertices: Array<Vector2>) {
        super();
        this.id = uuid();
        this.vertices = vertices;

        // calculate the mean of the vertices to use as the center
        this.center = vertices.reduce((acc, v) => acc.add(v), vector2(0, 0)).div(vertices.length);
    }

    public getId = () => this.id;
    public getCenter = () => this.center;
    public isPointInside = (point: Vector2) => {
        // ray-casting algorithm based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
        let isInside = false;
        let j = this.vertices.length - 1;
        for (let i = 0; i < this.vertices.length; i++) {
            const { x: xi, y: yi } = this.vertices[i];
            const { x: xj, y: yj } = this.vertices[j];
            if ((yi > point.y) !== (yj > point.y) && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi) {
                isInside = !isInside;
            }
            j = i;
        }
        return isInside;
    };

    public override asString() {
        return `PolygonZone { id: ${this.id} }`;
    }
};