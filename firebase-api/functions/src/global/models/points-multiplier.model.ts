export class PointsMultiplierModel {
    static pointsMultiplier = 50;

    static calculate(value: number): number {
        return value * this.pointsMultiplier;
    }
}
