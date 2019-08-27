export interface IAuditable {
    createdOn: Date;
    createdBy: string;
    updatedOn: Date;
    updatedBy: string;

    modifyCreated(createdBy?: string): void;

    modifyUpdated(updatedBy?: string): void;
}
