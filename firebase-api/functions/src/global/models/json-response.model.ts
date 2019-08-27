export class JsonResponse {
    data: any;
    errors: Error[] = [];

    constructor(values: any) {
        const isErrorArray = Array.isArray(values) &&
            values.filter((v: any) => v instanceof Error).length > 0;

        if (values instanceof Error || isErrorArray) {
            this.errors.push(values);
        } else {
            this.data = values;
        }
    }

    hasValue(): boolean {
        return !!this.data;
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }
}
