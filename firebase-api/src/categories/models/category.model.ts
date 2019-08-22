export class CategoryModel {
    _id: string;
    name: string;
    description: string;

    constructor(id: string, name: string, description: string) {
        this._id = id;
        this.name = name;
        this.description = description;
    }
}
