import { UUID } from "../../utils/uuid";

export interface IZone {
    getId(): UUID;
    getCenter(): Vector2;
    isPointInside(point: Vector2): boolean;
};